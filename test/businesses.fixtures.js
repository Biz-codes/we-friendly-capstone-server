function makeBusinessesArray() {
    return [

        {
            id: 1,
            adder_id: 1,
            category: 'restaurant/bar',
            name: 'Woodstar Cafe',
            address: '60 Masonic Street',
            city: 'Northampton',
            state: 'MA',
            zipcode: '01060',
            website: 'woodstarcafe.com'
        },
        {
            id: 2,
            adder_id: 2,
            category: 'shopping',
            name: 'Cedar Chest',
            address: '150 Main Street',
            city: 'Northampton',
            state: 'MA',
            zipcode: '01060',
            website: 'explorecedarchest.com'
        },
        {
            id: 3,
            adder_id: 3,
            category: 'hotel/accommodations',
            name: 'The Colonel Williams Inn',
            address: '111 Staver Road',
            city: 'Brattleboro',
            state: 'VT',
            zipcode: '05344',
            website: 'thecolonelwilliamsinn.com'
        },
        {
            id: 4,
            adder_id: 1,
            category: 'service',
            name: 'Home Environmental Services',
            address: '4 School Street',
            city: 'Westfield',
            state: 'MA',
            zipcode: '01085',
            website: 'homeenvironmentalservices.com'
        },
        {
            id: 5,
            adder_id: 2,
            category: 'housing/realty',
            name: 'Mill Valley Estates',
            address: '420 Riverglade Drive',
            city: 'Amherst',
            state: 'MA',
            zipcode: '01002',
            website: 'millvalleyapts.com'
        },
        {
            id: 6,
            adder_id: 3,
            category: 'education',
            name: 'Leeds Elementary School',
            address: '20 Florence Street',
            city: 'Northampton',
            state: 'MA',
            zipcode: '01053',
            website: 'northamptonschools.org/project/leeds-elementary-school'
        },
        {
            id: 7,
            adder_id: 1,
            category: 'healthcare',
            name:  'Carroll McGrath APRN',
            address: '234 Russell Street, Suite 203',
            city: 'Hadley',
            state: 'MA',
            zipcode: '01035',
            website: 'www.psychologytoday.com/us/psychiatrists/carroll-mcgrath-aprn-hadley-ma/174408'
        },
    ]
}

function makeMaliciousBusiness() {
    const maliciousBusiness = {
        id: 1,
        adder_id: 1,
        category: "shopping",
        name: "Naughty naughty very naughty <script>alert('xss');</script>",
        address: "Naughty naughty very naughty <script>alert('xss');</script>",
        city: "Naughty naughty very naughty <script>alert('xss');</script>",
        state: "AK",
        zipcode: "66666",
        website: "Naughty naughty very naughty <script>alert('xss');</script>"
    }
    const expectedBusiness = {
        ...maliciousBusiness,
        adder_id: 1,
        category: 'shopping',
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        address: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        city: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
        state: 'AK',
        zipcode: '66666',
        website: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;', // converts script to render it inert
    }
    return {
        maliciousBusiness,
        expectedBusiness,
    }
}

module.exports = {
    makeBusinessesArray,
    makeMaliciousBusiness
}