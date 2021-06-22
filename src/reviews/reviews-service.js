const ReviewsService = {

    getReviews(knex) {
          // knex raw is sql query which needs to be excuted by knex without any shortcuts (ex:.select('*') .where('reviews.id', reviews_id))
        // joining recipe and businesses table
        // input is recipe.user_id  (re.user_id = ${user_id};)
        // table connection is reviews.business_id = businesses.id (re.business_id = bs.id)
        // output is businesses.diet.name (bs.name)
        return knex.raw(`
            SELECT	
                bs.name AS name, 
                bs.category AS category, 
                bs.zipcode AS zipcode,
                bs.state AS state, 
                re.id AS id,
                re.reviewer_id AS reviewer_id,
                re.date_modified AS date_modified,
                re.friendly_for AS friendly_for,
                re.rating AS rating,
                re.review AS review
            FROM 
                reviews re
            LEFT JOIN 
                businesses bs 
            ON 
                re.business_id = bs.id
            ORDER BY
                bs.name ASC
            `);
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
        return knex.raw(`
        SELECT	
            bs.name AS name, 
            bs.category AS category, 
            bs.zipcode AS zipcode, 
            re.id AS id,
            re.reviewer_id AS reviewer_id,
            re.date_modified AS date_modified,
            re.friendly_for AS friendly_for,
            re.rating AS rating,
            re.review AS review
        FROM 
            reviews re
        LEFT JOIN 
            businesses bs 
        ON 
            re.business_id = bs.id
        ORDER BY
            bs.name ASC
        WHERE 
            re.reviewer_id = ${user_id};
        `);
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
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteReview(knex, id) {
        return knex('reviews')
        .where({id})
        .delete()
    },

}

module.exports = ReviewsService