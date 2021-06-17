const path = require('path')
const express = require('express')
const xss = require('xss')
const RememberedBusinessesService = require('./remembered-businesses-service')

const rememberedBusinessesRouter = express.Router()
const jsonParser = express.json();

const serializeRememberedBusiness = remembered => ({
    id: remembered.id,
    user_id: remembered.user_id,
    business_id: remembered.business_id,
})

rememberedBusinessesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get("db");
        RememberedBusinessesService.getRememberedBusinesses(knexInstance)
            .then(rememberedes => {
                res.json(rememberedes.map(serializeRememberedBusiness))
            })
            .catch(next)
    })

    .post(jsonParser, (req, res, next) => {
        const { user_id, business_id } = req.body;
        const newRememberedBusiness = { user_id, business_id }
    
        for (const [key, value] of Object.entries(newRememberedBusiness))
          if (value == null)
            return res.status(400).json({
              error: { message: `Missing '${key}' in request body` }
            });
    
        RememberedBusinessesService.addRememberedBusiness(req.app.get("db"), newRememberedBusiness)
          .then((remembered) => {
            res
              .status(201)
              .json(serializeRememberedBusiness(remembered))
          })
          .catch(next)

    });

rememberedBusinessesRouter
    .route('/:remembered_business_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.remembered_business_id))) {
            return res.status(404).json({
                error: {
                    message: `Invalid id`
                }
            })
        }

        //connect to the service to get the data
        RememberedBusinessesService.getById(
            req.app.get('db'),
            req.params.remembered_business_id
        )
        .then(remembered => {
            if(!remembered) {
                return res.status(404).json({
                    error: {
                        message: `Business has not been remembered`
                    }
                })
            }
            res.remembered = remembered
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeRememberedBusiness(res.remembered))
    })
    .delete((req, res, next) => {
        RememberedBusinessesService.removeRememberedBusiness(
            req.app.get('db'),
            req.params.remembered_business_id
        )
        .then(numRowsAffected => {
            res.status(204).json(numRowsAffected).end()
        })
        .catch(next)
    })

rememberedBusinessesRouter
    .route('/remembered-by-me/:user_id')
    .all((req, res, next) => {
        
        //connect to the service to get the data
        RememberedBusinessesService.getRememberedBusinessesByUser(
            req.app.get('db'),
            req.params.user_id
        )
        .then(rememberedes => {
            if(!rememberedes) {
                return res.status(404).json({
                    error: {
                        message: `This user has not remembered any businesses in the database`
                    }
                })
            }
            res.json(rememberedes.map(serializeRememberedBusiness))            
        })
        .catch(next)
    })

module.exports = rememberedBusinessesRouter