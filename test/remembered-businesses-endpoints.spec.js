const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeUsersArray } = require("./users.fixtures");
const { makeRememberedBusinessesArray } = require("./remembered-businesses.fixtures");

describe("RememberedBusinesses Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE users, remembered_businesses RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE users, remembered_businesses RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/remembered-businesses`, () => {
    context(`Given no remembered_businesses`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/remembered-businesses").expect(200, []);
      });
    });

    context("Given there are remembered_businesses in the database", () => {
      const testUsers = makeUsersArray();
      const testRememberedBusinesses = makeRememberedBusinessesArray();

      beforeEach("insert remembered_businesses", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("remembered_businesses").insert(testRememberedBusinesses);
          });
      });

      it("responds with 200 and all of the remembered_businesses", () => {
        return supertest(app).get("/api/remembered-businesses").expect(200, testRememberedBusinesses);
      });
    });


  });

  describe(`POST /api/remembered-businesses`, () => {
    const testUsers = makeUsersArray();

    beforeEach("post remembered_businesses", () => {
      return db.into("users").insert(testUsers);
    });

    it(`creates a remembered_business, responding with 201 and the new remembered_business`, function () {
      const newRememberedBusiness = {
        user_id: 1,
        business_id: 1,
      };
      return supertest(app)
        .post("/api/remembered_businesses")
        .send(newRememberedBusiness)
        .expect(201)
        .expect((res) => {
          expect(res.body.user_id).to.eql(newRememberedBusiness.user_id);
          expect(res.body.business_id).to.eql(newRememberedBusiness.business_id);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/remembered-businesses/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/remembered-businesses/${res.body.id}`).expect(res.body)
        );
    });

    const requiredFields = ["user_id", "business_id"];

    requiredFields.forEach((field) => {
      const newRememberedBusiness = {
        user_id: 1,
        business_id: 1,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newRememberedBusiness[field];

        return supertest(app)
          .post("/api/remembered_businesses")
          .send(newRememberedBusiness)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });

  describe(`DELETE /api/remembered-businesses/:remembered_business_id`, () => {
    context(`Given no remembered_businesses`, () => {
      it(`responds with 404`, () => {
        const remembered_businessId = 123456;
        return supertest(app)
          .delete(`/api/remembered-businesses/${remembered_businessId}`)
          .expect(404, { error: { message: `remembered_business doesn't exist` } });
      });
    });

    context("Given there are remembered_businesses in the database", () => {
      const testUsers = makeUsersArray();
      const testRememberedBusinesses = makeRememberedBusinessesArray();

      beforeEach("insert remembered_businesses", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("remembered_businesses").insert(testRememberedBusinesses);
          });
      });

      it("responds with 204 and removes the remembered_business", () => {
        const idToRemove = 2;
        const expectedRememberedBusiness = testRememberedBusinesses.filter(
          (remembered) => remembered.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/remembered_businesses/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get(`/api/remembered_businesses`).expect(expectedRememberedBusiness)
          );
      });
    });
  });
});
