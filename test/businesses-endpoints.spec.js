const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeBusinessesArray, makeMaliciousBusiness } = require('./businesses.fixtures')

describe('Businesses Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
      
    after('disconnect from db', () => db.destroy())    

    before('clean the table', () => db.raw('TRUNCATE users, businesses RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE users, businesses RESTART IDENTITY CASCADE'))

    describe(`GET /api/businesses`, () => {

        context(`Given no businesses`, () => {
            it(`responds with 200 and an empty list`, () => {
              return supertest(app)
                .get('/api/businesses')
                .expect(200, [])
            })
        })

        context('Given there are businesses in the database', () => {
            const testUsers = makeUsersArray();
            const testBusinesses = makeBusinessesArray()
      
            beforeEach('insert businesses', () => {
              return db
              .into('users')
                .insert(testUsers)
                .then(() => {
                  return db
                    .into('businesses')
                    .insert(testBusinesses)
                })
                
            })
      
            it('responds with 200 and all of the businesses', () => {
              return supertest(app)
                .get('/api/businesses')
                .expect(200, testBusinesses)
            })
        })

        context(`Given an XSS attack business`, () => {
          const testUsers = makeUsersArray();
          const { maliciousBusiness, expectedBusiness } = makeMaliciousBusiness();
    
          beforeEach("insert malicious business", () => {
            return db
              .into("users")
              .insert(testUsers)
              .then(() => {
                return db.into("businesses").insert([maliciousBusiness]);
              });
          });
    
          it("removes XSS attack content", () => {
            return supertest(app)
              .get(`/api/businesses`)
              .expect(200)
              .expect((res) => {
                expect(res.body[0].adder_id).to.eql(expectedBusiness.adder_id);
                expect(res.body[0].category).to.eql(expectedBusiness.category);
                expect(res.body[0].name).to.eql(expectedBusiness.name);
                expect(res.body[0].address).to.eql(expectedBusiness.address);
                expect(res.body[0].city).to.eql(expectedBusiness.city);
                expect(res.body[0].state).to.eql(expectedBusiness.state);
                expect(res.body[0].zipcode).to.eql(expectedBusiness.zipcode);
                expect(res.body[0].website).to.eql(expectedBusiness.website);
              });
          });
        });
    })
   
    describe(`POST /api/businesses`, () => {

        const testUsers = makeUsersArray();
  
        beforeEach('post businesses', () => {
          return db
            .into('users')
            .insert(testUsers)
        })

        it(`creates a business, responding with 201 and the new business`, function() {
            
            const newBusiness = {
                adder_id: 1,
                category: 'shopping',
                name: 'Test business',
                address: '1 Main St',
                city: 'Cityville',
                state: 'MA',
                zipcode: '11111',
                website: "www.website.com"
            }
            return supertest(app)
                .post('/api/businesses')
                .send(newBusiness)
                .expect(201) 
                .expect(res => {
                    expect(res.body.adder_id).to.eql(newBusiness.adder_id)
                    expect(res.body.category).to.eql(newBusiness.category)
                    expect(res.body.name).to.eql(newBusiness.name)
                    expect(res.body.address).to.eql(newBusiness.address)
                    expect(res.body.city).to.eql(newBusiness.city)
                    expect(res.body.state).to.eql(newBusiness.state)
                    expect(res.body.zipcode).to.eql(newBusiness.zipcode)
                    expect(res.body.website).to.eql(newBusiness.website)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/businesses/${res.body.id}`)
                })
            .then(res =>
                supertest(app)
                .get(`/api/businesses/${res.body.id}`)
                .expect(res.body)
            )
        })
    
  
      const requiredFields = ['adder_id', 'category', 'name', 'address', 'city', 'state', 'zipcode', 'website']
  
      requiredFields.forEach(field => {
        const newBusiness = {
            adder_id: 1,
            category: 'shopping',
            name: 'Test business',
            address: '1 Main St',
            city: 'Cityville',
            state: 'MA',
            zipcode: '11111',
            website: "www.website.com"
        }
      
    
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newBusiness[field]
    
          return supertest(app)
            .post('/api/businesses')
            .send(newBusiness)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
    })

    it("removes XSS attack content", () => {
      const { maliciousBusiness, expectedBusiness } = makeMaliciousBusiness();
      return supertest(app)
        .post(`/api/businesses`)
        .send(maliciousBusiness)
        .expect(201)
        .expect((res) => {
          expect(res.body.adder_id).to.eql(expectedBusiness.adder_id);
          expect(res.body.category).to.eql(expectedBusiness.category);
          expect(res.body.name).to.eql(expectedBusiness.name);
          expect(res.body.address).to.eql(expectedBusiness.address);
          expect(res.body.city).to.eql(expectedBusiness.city);
          expect(res.body.state).to.eql(expectedBusiness.state);
          expect(res.body.zipcode).to.eql(expectedBusiness.zipcode);
          expect(res.body.website).to.eql(expectedBusiness.website);
        });
    });
})

    describe(`DELETE /api/businesses/:business_id`, () => {
        context(`Given no supplies`, () => {
          it(`responds with 404`, () => {
            const businessId = 123456
            return supertest(app)
              .delete(`/api/businesses/${businessId}`)
              .expect(404, { error: { message: `Business not in the database` } })
          })
         })
    
    
         context('Given there are businesses in the database', () => {
            const testUsers = makeUsersArray();
            const testBusinesses = makeBusinessesArray()
      
            beforeEach('insert businesses', () => {
              return db
              .into('users')
                .insert(testUsers)
                .then(() => {
                  return db
                    .into('businesses')
                    .insert(testBusinesses)
                })
                
            })
    
          it('responds with 204 and removes the business', () => {
            const idToRemove = 2
            const expectedBusiness = testBusinesses.filter(business => business.id !== idToRemove)
            return supertest(app)
              .delete(`/api/businesses/${idToRemove}`)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/api/businesses`)
                  .expect(expectedBusiness)
              )
          })
        })
      })

      describe(`PATCH /api/businesses/:business_id`, () => {
        context(`Given no businesses`, () => {
          it(`responds with 404`, () => {
            const businessId = 123456
            return supertest(app)
              .patch(`/api/businesses/${businessId}`)
              .expect(404, { error: { message: `Business not in the database` } })
          })
        })
    
        context('Given there are businesses in the database', () => {
          const testUsers = makeUsersArray();
          const testBusinesses = makeBusinessesArray()
    
          beforeEach('insert businesses', () => {
            return db
            .into('users')
              .insert(testUsers)
              .then(() => {
                return db
                  .into('businesses')
                  .insert(testBusinesses)
              })
              
          })
          
          it('responds with 201 and updates the business', () => {
            const idToUpdate = 2
            const updatedBusiness = {
              adder_id: 1,
              category: 'shopping',
              name: 'Updated business',
              address: '1 Main St',
              city: 'Cityville',
              state: 'MA',
              zipcode: '11111',
              website: "to-do it myself"
            }
            const expectedBusiness = {
              ...testBusinesses[idToUpdate - 1],
              ...updatedBusiness
            }
            return supertest(app)
              .patch(`/api/businesses/${idToUpdate}`)
              .send(updatedBusiness)
              .expect(201)
              .then(res =>
                supertest(app)
                  .get(`/api/businesses/${idToUpdate}`)
                  .expect(expectedBusiness)
              )
          })
    
          it(`responds with 400 when no required fields supplied`, () => {
            const idToUpdate = 2
            return supertest(app)
              .patch(`/api/businesses/${idToUpdate}`)
              .send({ irrelevantField: 'foo' })
              .expect(400, {
                error: {
                  message: `Request body must contain either 'category', 'name', 'address', 'city', 'state', zipcode, or 'website'.`
                }
              })
          })
          
          it(`responds with 201 when updating only a subset of fields`, () => {
            const idToUpdate = 2
            const updatedBusiness = {
              name: 'Updated business',
            }
            const expectedBusiness = {
              ...testBusinesses[idToUpdate - 1],
              ...updatedBusiness
            }
            
            return supertest(app)
              .patch(`/api/businesses/${idToUpdate}`)
              .send({
                ...updatedBusiness,
                fieldToIgnore: 'should not be in GET response'
              })
              .expect(201)
                .then(res =>
                  supertest(app)
                    .get(`/api/businesses/${idToUpdate}`)
                    .expect(expectedBusiness)
                )
          })
          
        })
      })
})