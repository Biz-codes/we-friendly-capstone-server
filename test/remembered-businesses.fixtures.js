function makeRememberedBusinessesArray() {
    return [
        {
            id: 1,
            user_id: 2,
            business_id: 2
        },
        {
            id: 2,
            user_id: 2,
            business_id: 1
        },
        {
            id: 3,
            user_id: 2,
            business_id: 5
        },
        {
            id: 4,
            user_id: 2,
            business_id: 1
        },
    ]
}

module.exports = {
    makeRememberedBusinessesArray,
}

