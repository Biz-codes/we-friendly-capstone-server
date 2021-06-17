const ReviewsService = {

    getReviews(knex) {
        return knex
            .select('*')
            .from('reviews') 
    },

    insertReview(knex, newReview) {
        return knex
            .insert(newReview)
            .into('reviews')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .from('reviews')
            .select('*')
            .where('id', id)
            .first()
    },

    getReviewsByBusiness(knex, business_id) {
        return knex
            .select('*')
            .from('reviews')
            .where('business_id', business_id)
    },

    getReviewsByReviewer(knex, reviewer_id) {
        return knex
            .select('*')
            .from('reviews')
            .where('reviewer_id', reviewer_id)
    },

    getReviewsByIdentityGroup(knex, friendly_for) {
        return knex
            .select('*')
            .from('reviews')
            .where('friendly_for', friendly_for)
    },

    updateReview(knex, id, newReviewFields) {
        return knex('reviews')
            .where({id})
            .update(newReviewFields)
    },

    deleteReview(knex, id) {
        return knex('reviews')
        .where({id})
        .delete()
    },

}

module.exports = ReviewsService