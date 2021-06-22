const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeUsersArray } = require("./users.fixtures");
const {
  makeReviewsArray,
  makeMaliciousReview,
} = require("./reviews.fixtures");

describe("Reviews Endpoints", function () {
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
    db.raw("TRUNCATE users, reviews RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE users, reviews RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/reviews`, () => {
    context(`Given no reviews`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/reviews").expect(200, []);
      });
    });

    context("Given there are reviews in the database", () => {
      const testUsers = makeUsersArray();
      const testReviews = makeReviewsArray();

      beforeEach("insert reviews", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("reviews").insert(testReviews);
          });
      });

      it("responds with 200 and all of the reviews", () => {
        return supertest(app).get("/api/reviews").expect(200, testReviews);
      });
    });

    context(`Given an XSS attack review`, () => {
      const testUsers = makeUsersArray();
      const { maliciousReview, expectedReview } = makeMaliciousReview();

      beforeEach("insert malicious review", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("reviews").insert([maliciousReview]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/reviews`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].reviewer_id).to.eql(expectedReview.reviewer_id);
            expect(res.body[0].business_id).to.eql(expectedReview.business_id);
            expect(res.body[0].date_modified).to.eql(expectedReview.date_modified);
            expect(res.body[0].friendly_for).to.eql(expectedReview.friendly_for);
            expect(res.body[0].rating).to.eql(expectedReview.rating);
            expect(res.body[0].review).to.eql(expectedReview.review);
            
          });
      });
    });
  });

  describe(`POST /api/reviews`, () => {
    const testUsers = makeUsersArray();

    beforeEach("post reviews", () => {
      return db.into("users").insert(testUsers);
    });

    it(`creates a review, responding with 201 and the new review`, function () {
      const newReview = {
        reviewer_id: 1,
        business_id: 1,
        date_modified: "2021-09-30T04:00:00.000Z",
        friendly_for: "Women",
        rating: 1,
        review: "Test review",
      };
      return supertest(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(201)
        .expect((res) => {
          expect(res.body.reviewer_id).to.eql(newReview.reviewer_id);
          expect(res.body.business_id).to.eql(newReview.business_id);
          expect(res.body.date_modified).to.eql(newReview.date_modified);
          expect(res.body.friendly_for).to.eql(newReview.friendly_for);
          expect(res.body.rating).to.eql(newReview.rating);
          expect(res.body.review).to.eql(newReview.review);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/reviews/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/reviews/${res.body.id}`).expect(res.body)
        );
    });

    const requiredFields = ["reviewer_id", "business_id", "date_modified", "friendly_for", "rating", "review"];

    requiredFields.forEach((field) => {
      const newReview = {
        reviewer_id: 1,
        business_id: 1,
        date_modified: "2021-09-30T04:00:00.000Z",
        friendly_for: "Women",
        review: "Test description",
        rating: 1,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newReview[field];

        return supertest(app)
          .post("/api/reviews")
          .send(newReview)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });


    it("removes XSS attack content", () => {
      const { maliciousReview, expectedReview } = makeMaliciousReview();
      return supertest(app)
        .post(`/api/reviews`)
        .send(maliciousReview)
        .expect(201)
        .expect((res) => {
          expect(res.body.reviewer_id).to.eql(expectedReview.reviewer_id);
          expect(res.body.business_id).to.eql(expectedReview.business_id);
          expect(res.body.date_modified).to.eql(expectedReview.date_modified);
          expect(res.body.friendly_for).to.eql(expectedReview.friendly_for);
          expect(res.body.rating).to.eql(expectedReview.rating);
          expect(res.body.review).to.eql(expectedReview.review);
        });
    });
  });

  describe(`DELETE /api/reviews/:review_id`, () => {
    context(`Given no reviews`, () => {
      it(`responds with 404`, () => {
        const reviewId = 123456;
        return supertest(app)
          .delete(`/api/reviews/${reviewId}`)
          .expect(404, { error: { message: `Review doesn't exist` } });
      });
    });

    context("Given there are reviews in the database", () => {
      const testUsers = makeUsersArray();
      const testReviews = makeReviewsArray();

      beforeEach("insert reviews", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("reviews").insert(testReviews);
          });
      });

      it("responds with 204 and removes the review", () => {
        const idToRemove = 2;
        const expectedReview = testReviews.filter(
          (review) => review.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/reviews/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get(`/api/reviews`).expect(expectedReview)
          );
      });
    });
  });

  describe(`PATCH /api/reviews/:review_id`, () => {
    context(`Given no reviews`, () => {
      it(`responds with 404`, () => {
        const reviewId = 123456;
        return supertest(app)
          .patch(`/api/reviews/${reviewId}`)
          .expect(404, { error: { message: `Review doesn't exist` } });
      });
    });

    context("Given there are reviews in the database", () => {
      const testUsers = makeUsersArray();
      const testReviews = makeReviewsArray();

      beforeEach("insert reviews", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("reviews").insert(testReviews);
          });
      });

      it("responds with 204 and updates the review", () => {
        const idToUpdate = 2;
        const updatedReview = {
          reviewer_id: 1,
          business_id: 1,
          date_modified: "2021-09-30T04:00:00.000Z",
          friendly_for: "Women",
          rating: 1,
          review: "Updated description",
        };
        const expectedReview = {
          ...testReviews[idToUpdate - 1],
          ...updatedReview,
        };
        return supertest(app)
          .patch(`/api/reviews/${idToUpdate}`)
          .send(updatedReview)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/reviews/${idToUpdate}`)
              .expect(expectedReview)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/reviews/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body must contain either 'friendly_for', 'review', or 'rating'.`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updatedReview = {
          friendly_for: "Updated review",
        };
        const expectedReview = {
          ...testReviews[idToUpdate - 1],
          ...updatedReview,
        };

        return supertest(app)
          .patch(`/api/reviews/${idToUpdate}`)
          .send({
            ...updatedReview,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/reviews/${idToUpdate}`)
              .expect(expectedReview)
          );
      });
    });
  });
});
