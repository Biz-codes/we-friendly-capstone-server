const path = require('path')
const express = require('express')
const xss = require('xss')
const ReviewsService = require('./reviews-service')

const reviewsRouter = express.Router()
const jsonParser = express.json

const serializeReview = wreview => ({
    id: wreview.id,
    reviewer_id: wreview.reviewer_id,
    business_id: wreview.business_id,
    date_modified: wreview.date_modified,
    friendly_for: wreview.friendly_for,
    rating: wreview.rating,
    review: xss(wreview.review),
})

reviewsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get("db");
        ReviewsService.getReviews(knexInstance)
            .then(reviews => {
                res.json(reviews.map(serializeReview))
            })
            .catch(next)
    })

    .post(jsonParser, (req, res, next) => {
        const { reviewer_id, business_id, date_modified, friendly_for, rating, review } = req.body;
        const newReview = { reviewer_id, business_id, date_modified, friendly_for, rating, review }
    
        for (const [key, value] of Object.entries(newReview))
          if (value == null)
            return res.status(400).json({
              error: { message: `Missing '${key}' in request body` }
            });
    
        ReviewsService.insertReview(req.app.get("db"), newReview)
          .then((wreview) => {
            res
              .status(201)
              .json(serializeReview(wreview))
          })
          .catch(next)

    });

reviewsRouter
    .route('/:review_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.review_id))) {
            return res.status(404).json({
                error: {
                    message: `Invalid id`
                }
            })
        }

        //connect to the service to get the data
        ReviewsService.getById(
            req.app.get('db'),
            req.params.review_id
        )
        .then(wreview => {
            if(!wreview) {
                return res.status(404).json({
                    error: {
                        message: `Review not in the database`
                    }
                })
            }
            res.wreview = wreview
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeReview(res.wreview))
    })
    .patch(jsonParser, (req, res, next) => {

        const { reviewer_id, business_id, date_modified, friendly_for, rating, review } = req.body
        const reviewToUpdate = { reviewer_id, business_id, date_modified, friendly_for, rating, review }

        const numberOfValues = Object.values(reviewToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'friendly_for', 'rating', or 'review'.`
                }
            })
        }

        //save input to db
        ReviewsService.updatedReview(
            req.app.get('db'),
            req.params.review_id,
            reviewToUpdate
        )
        .then(updatedReview => {
            res.status(200).json(serializeReview(updatedReview))
        })
        .catch(next)
    })

    .delete((req, res, next) => {
        ReviewsService.deleteReview(
            req.app.get('db'),
            req.params.review_id
        )
        .then(numRowsAffected => {
            res.status(204).json(numRowsAffected).end()
        })
        .catch(next)
    })


reviewsRouter
    .route('/reviews-by-business/:business_id')
    .all((req, res, next) => {
        
        //connect to the service to get the data
        ReviewsService.getReviewsByBusiness(
            req.app.get('db'),
            req.params.business_id
        )
        .then(reviews => {
            if(!reviews) {
                return res.status(404).json({
                    error: {
                        message: `This business does not have any reviews in the database`
                    }
                })
            }
            res.json(reviews.map(serializeReview))            
        })
        .catch(next)
    })

reviewsRouter
    .route('/written-by-me/:reviewer_id')
    .all((req, res, next) => {
        
        //connect to the service to get the data
        ReviewsService.getReviewsByReviewer(
            req.app.get('db'),
            req.params.reviewer_id
        )
        .then(reviews => {
            if(!reviews) {
                return res.status(404).json({
                    error: {
                        message: `This user has not added any reviews in the database`
                    }
                })
            }
            res.json(reviews.map(serializeReview))            
        })
        .catch(next)
    })

reviewsRouter
    .route('/identities/:friendly_for')
    .all((req, res, next) => {
        
        //connect to the service to get the data
        ReviewsService.getReviewsByIdentityGroup(
            req.app.get('db'),
            req.params.friendly_for
        )
        .then(reviews => {
            if(!reviews) {
                return res.status(404).json({
                    error: {
                        message: `There are no reviews for this group yet in the database`
                    }
                })
            }
            res.json(reviews.map(serializeReview))            
        })
        .catch(next)
    })

module.exports = reviewsRouter