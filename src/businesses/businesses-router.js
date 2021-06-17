const path = require('path')
const express = require('express')
const xss = require('xss')
const BusinessesService = require('./businesses-service')

const businessesRouter = express.Router()
const jsonParser = express.json

const serializeBusiness = business => ({
    id: business.id,
    adder_id: business.adder_id,
    category: business.category,
    name: xss(business.name),
    address: xss(business.address),
    city: xss(business.city),
    state: business.state,
    zipcode: business.zipcode,
    website: xss(business.website),
})

businessesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get("db");
        BusinessesService.getBusinesses(knexInstance)
            .then(businesses => {
                res.json(businesses.map(serializeBusiness))
            })
            .catch(next)
    })

    .post(jsonParser, (req, res, next) => {
        const { adder_id, category, name, address, city, state, zipcode, website } = req.body;
        const newBusiness = { adder_id, category, name, address, city, state, zipcode, website }
    
        for (const [key, value] of Object.entries(newBusiness))
          if (value == null)
            return res.status(400).json({
              error: { message: `Missing '${key}' in request body` }
            });
    
        BusinessesService.insertBusiness(req.app.get("db"), newBusiness)
          .then((business) => {
            res
              .status(201)
              .json(serializeBusiness(business))
          })
          .catch(next)

    });

businessesRouter
    .route('/:business_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.business_id))) {
            return res.status(404).json({
                error: {
                    message: `Invalid id`
                }
            })
        }

        //connect to the service to get the data
        BusinessesService.getById(
            req.app.get('db'),
            req.params.business_id
        )
        .then(business => {
            if(!business) {
                return res.status(404).json({
                    error: {
                        message: `Business not in the database`
                    }
                })
            }
            res.business = business
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeBusiness(res.business))
    })
    .patch(jsonParser, (req, res, next) => {

        const { adder_id, category, name, address, city, state, website } = req.body
        const businessToUpdate = { adder_id, category, name, address, city, state, website }

        const numberOfValues = Object.values(businessToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'category', 'name', 'address', 'city', 'state', or 'website'.`
                }
            })
        }

        //save input to db
        BusinessesService.updatedBusiness(
            req.app.get('db'),
            req.params.business_id,
            businessToUpdate
        )
        .then(updatedBusiness => {
            res.status(200).json(serializeBusiness(updatedBusiness))
        })
        .catch(next)
    })

    .delete((req, res, next) => {
        BusinessesService.deleteBusiness(
            req.app.get('db'),
            req.params.business_id
        )
        .then(numRowsAffected => {
            res.status(204).json(numRowsAffected).end()
        })
        .catch(next)
    })

businessesRouter
    .route('/categories/:business_category')
    .all((req, res, next) => {
        
        //connect to the service to get the data
        BusinessesService.getBusinessesByCategory(
            req.app.get('db'),
            req.params.business_category
        )
        .then(businesses => {
            if(!businesses) {
                return res.status(404).json({
                    error: {
                        message: `No businesses in that category in the database`
                    }
                })
            }
            res.json(businesses.map(serializeBusiness))            
        })
        .catch(next)
    })
    
businessesRouter
    .route('/states/:state')
    .all((req, res, next) => {
        
        //connect to the service to get the data
        BusinessesService.getBusinessesByState(
            req.app.get('db'),
            req.params.state
        )
        .then(businesses => {
            if(!businesses) {
                return res.status(404).json({
                    error: {
                        message: `No businesses in that state in the database`
                    }
                })
            }
            res.json(businesses.map(serializeBusiness))            
        })
        .catch(next)
    })

businessesRouter
    .route('/added-by-me/:adder_id')
    .all((req, res, next) => {
        
        //connect to the service to get the data
        BusinessesService.getBusinessesByAdder(
            req.app.get('db'),
            req.params.adder_id
        )
        .then(businesses => {
            if(!businesses) {
                return res.status(404).json({
                    error: {
                        message: `This user has not added any businesses in the database`
                    }
                })
            }
            res.json(businesses.map(serializeBusiness))            
        })
        .catch(next)
    })

module.exports = businessesRouter