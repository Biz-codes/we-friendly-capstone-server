const BusinessesService = {

    getBusinesses(knex) {
        return knex
            .select('*')
            .from('businesses')
    },

    insertBusiness(knex, newBusiness) {
        return knex
            .insert(newBusiness)
            .into('businesses')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .select('*')
            .from('businesses')
            .where('id', id)
            .first()
    },

    getBusinessesByCategory(knex, category) {
        return knex
            .select('*')
            .from('businesses')
            .where('category', category)
    },

    

    updateBusiness(knex, id, newBusinessFields) {
        return knex('businesses')
            .where({ id })
            .update(newBusinessFields)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteBusiness(knex, id) {
        return knex('businesses')  
            .where({id})
            .delete()
    }
}

module.exports = BusinessesService