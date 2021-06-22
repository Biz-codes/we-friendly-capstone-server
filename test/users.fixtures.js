function makeUsersArray() {
    return [
        {
            id: 1,
            name: 'Dorothy Gale',
            username: 'NotInKansas',
            password: 'Friendly1'
        },
        {
            id: 2,
            name: 'Scarecrow',
            username: 'NoBrain',
            password: 'Friendly1'
        },
        {
            id: 3,
            name: 'Tinman',
            username: 'NoHeart',
            password: 'Friendly1'
        },
        {
            id: 4,
            name: 'Cowardly Lion',
            username: 'KingOfTheForest',
            password: 'Friendly1'
        }
    ]
}

function makeMaliciousUser() {
    const maliciousUser = {
        id: 1,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        username: 'Naughty naughty very naughty <script>alert("xss");</script>',
        password: 'Naughty naughty very naughty <script>alert("xss");</script>',

    }
    const expectedUser = {
        ...maliciousUser,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', // converts script to render it inert
        username: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', // converts script to render it inert
        password: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;', // converts script to render it inert
        
    }
    return {
        maliciousUser,
        expectedUser,
    }
}

module.exports = {
    makeUsersArray,
    makeMaliciousUser,
}