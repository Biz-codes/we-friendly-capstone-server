const RememberedBusinessesService = {

    getRememberedBusinesses(knex) {
        return knex
            .select('*')
            .from('remembered_businesses')
    },

    addRememberedBusiness(knex, newRememberedBusiness) {
        return knex
            .insert(newRememberedBusiness)
            .into('remembered_businesses')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex
            .select('*')
            .from('remembered_businesses')
            .where('id', id)
            .first()
    },

    getRememberedBusinessesByUser(knex, user_id) {
        return knex
            .select('*')
            .from('remembered_businesses')
            .where('user_id', user_id)
    },

    removeRememberedBusiness(knex, id) {
        return knex('remembered_businesses')  
            .where({id})
            .delete()
    }
}

module.exports = RememberedBusinessesService