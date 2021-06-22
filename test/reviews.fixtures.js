function makeReviewsArray() {
    return [
        {
            id: 1,
            reviewer_id: 1,
            business_id: 1,
            date_modified: '2021-09-30T04:00:00.000Z',
            friendly_for: 'LGBTQIA+', 
            rating: 5, 
            review: 'Very queer friendly! And great coffee too'
        },
        {
            id: 2,
            reviewer_id: 2, 
            business_id: 1, 
            date_modified: '2021-09-30T04:00:00.000Z', 
            friendly_for: 'LGBTQIA+', 
            rating: 5, 
            review: 'I felt totally welcomed. Northampton rocks!'
        },
        {
            id: 3,
            reviewer_id: 3,
            business_id: 2,
            date_modified: '2021-09-30T04:00:00.000Z',
            friendly_for: 'Disabled persons',
            rating: 3,
            review:  'I had to go out into Thornes to take the elevator to the second floor, and some of the displays were close together, but the staff were helpful!'
        },
        {
            id: 4,
            reviewer_id: 3,
            business_id: 1,
            date_modified: '2021-09-30T04:00:00.000Z',
            friendly_for: 'Disabled persons',
            rating: 3,
            review: 'No stairs, but no automatic doors either'
        },
    ]
}

function makeMaliciousReview() {
    const maliciousReview = {
        id: 1,
        reviewer_id: 1,
        business_id: 1,
        date_modified: "2021-09-30T04:00:00.000Z",
        friendly_for: "Women",
        rating: 3,
        review: "Naughty naughty very naughty <script>alert('xss');</script>"
    }
    const expectedReview = {
        ...maliciousReview,
        reviewer_id: 1,
        business_id: 1,
        date_modified: '2021-09-30T04:00:00.000Z',
        friendly_for: 'Women',
        rating: 3,
        review: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;' // converts script to render it inert
    }
    return {
        maliciousReview,
        expectedReview,
    }
}

module.exports = {
    makeReviewsArray,
    makeMaliciousReview,
}
