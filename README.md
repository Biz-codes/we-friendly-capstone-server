# we-friendly 

(Proposal - will make it more catchy/user-friendly)
The "we-friendly" app would allow users to review businesses and services specifically for how "-friendly" 
they are to members of certain communities against whom people historically discriminate. The target 
demographic for the app would be users who are members of these communities, who want non-discriminatory 
experiences. The categories of communities would be: "Black, Asian/Pacific Islander, Latinx, and Indigenous 
persons", "Disabled persons", "Migrants/Immigrants", "LGBTQIA+", and "Women" . The categories of businesses 
would be "restaurant/bar", "shopping", "hotel/accommodations", "service", "housing/realty", "education", 
and "healthcare". "Users can create an account to rate/review businesses, as well as to search for reviews
of businesses, filtering by specific business and community categories, and sorting by rating.



### 1. Working Prototype
You can access a working prototype of the React app here: https://we-friendly.vercel.app/ and Node app here: https://we-friendly.herokuapp.com/



### 2. User Stories 
This app is for two types of users: a visitor and a logged-in user.

##### Landing Page/Sign Up Page 
* as a visitor,
* I want to sign up for an account,
* so I can view and write reviews

##### Landing Page/Log In Page
* as a visitor,
* I want to log into a demo account,
* so I can try out the app

##### Landing Page/Log In Page
* as a logged-in user,
* I want to log into my account,
* so I can search for and write reviews

##### Reviews Page
* as a logged-in user,
* I want to search for reviews by business name and/or zipcode, filter by state, business type and/or identity group, and sort by rating, date modified, name, or zipcode,
* so I can find reviews of relevant businesses and services where I can have positive experiences

##### Reviews Page
* as a logged-in user,
* I want to click on the name of each business or service being reviewed and link to the Businesses Page, 
* so I can find contact information for places with positive reviews

##### Businesses Page
* as a logged-in user,
* I want to search for businesses and services by name and/or zipcode, filter by state and/or business type, and sort by name or zipcode,
* so I can review businesses/services I have visited, and visit ones from the Reviews Page

##### Businesses Page
* as a logged-in user,
* I want to click on a link for each business or service and link to the Reviews Page,
* so I can read the reviews for that business

##### Businesses Page
* as a logged-in user,
* I want to click on link buttons for each business or service
* so I can add a business, write a review, or save a business

##### Saved Page
* as a logged-in user,
* I want to view, edit and delete reviews I have written,
* so I can manage the reviews I write

##### Saved Page
* as a logged-in user,
* I want to view and edit businesses and services I have added to the database,
* so I can follow a link to write a review

##### Saved Page
* as a logged-in user,
* I want to view, delete, and link to write a review of businesses and services I have saved,
* so I can remember to try (or avoid) places based on reviews

##### Add Review Page
* as a logged-in user,
* I want to write and post reviews 
* To share my experiences with other users

##### Add Business Page
* as a logged-in user,
* I want to add information for businesses and services
* so that other people and I can review them

##### Edit Review Page
* as a logged-in user,
* I want to edit my previous reviews
* in case I made errors or have had a different experience

##### Edit Business Page
* as a logged-in user,
* I want to edit businesses and services I have added
* in case I made errors, or something has changed about their contact information



### 3. Functionality 
The app's functionality (v1.0) includes:
* All users can access a demo account to try the app.
* All users can create an account.
* All users can click on contact information links for the app creator.
* Logged-in users can search for reviews by business name and/or zipcode, filter by state, business type and/or identity group, and sort by rating, date modified, name, or zipcode. 
* Logged-in users can search for businesses and services by name and/or zipcode, filter by state and/or business type, and sort by name or zipcode.
* Logged-in users can read all reviews, write reviews, and edit and delete the reviews they have written.
* Logged-in users can view details about, save and add businesses/services, and edit details for businesses they have added.
* Logged-in users can cross-reference businesses and reviews.
* Logged-in users can navigate between the Landing, Reviews and Businesses pages, and their Saved page - using top navigation.
* Logged-in users can log out to return to the Landing page.
* All users can use accessibility features such as text-to-speech and navigation via keyboard.



### 4. Technology
* Front-End: HTML5, CSS3, JavaScript ES6, React
* Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, Postgres
* Development Environment: Heroku, DBeaver



### 5. Wireframes
Landing Page
:-------------------------:
![Landing Page](/github-images/wireframes/landing-page.jpeg)
Sign Up Page
![Sign Up Page](/github-images/wireframes/sign-up-page.jpg)
Log In Page
![Log In Page](/github-images/wireframes/log-in-page.jpeg)
Reviews Page
![Reviews Page](/github-images/wireframes/reviews.jpg)
Businesses Page
!["Businesses Page"](/github-images/wireframes/businesses.jpeg)
Saved Page 
![Saved Page Reviews](/github-images/wireframes/saved-reviews.jpg)
![Saved Page Businesses Added](/github-images/wireframes/saved-businesses-added.jpg)
![Saved Page Businesses to Remember](/github-images/wireframes/saved-businesses-remember.jpg)
Add/Edit Review
![Add/Edit Review](/github-images/wireframes/add-edit-review.jpg)
Add/Edit Business
![Add/Edit Business](/github-images/wireframes/add-edit-business.jpeg)
User Flows
![User Flows 1](/github-images/wireframes/user-flows-1.jpg)
![User Flows 2](/github-images/wireframes/user-flows-2.jpg)
![User Flows 3](/github-images/wireframes/user-flows-3.jpg)




### 6. Front-end Structure - React Components Map
* __index.js__ (stateless)
    * __App.js__ (stateful)
        * __Landing.js__ (stateless)
            * __LogIn.js__ (stateful)
            * __SignUp.js__ (stateful)
            * __Dashboard.js__ (stateless)
                * __Nav.js__ (stateless)
                * __Supplies.js__  (stateful)
                    * __AddSupply.js__ (stateful)
                    * __EditSupply.js__ (stateful)
                * __Tools.js__ (stateful)
                    * __AddTool.js__ (stateful)
                    * __EditTool.js__ (stateful)
                * __Projects.js__ (stateful)
                    * __AddProject.js__ (stateful))
                    * __EditProject.js__ (stateful)



### 7. Back-end Structure - Business Objects
* Users (database table)
    * id (auto-generated)
    * username (email validation)
    * password (at least 8 chars, at least one alpha and a special character validation)
    * name (full name, at least 3 chars)
* Supplies (database table)
    * id (auto-generated)
    * user_id (foreign key to users table)
    * supply_name (varchar255 NOT NULL)
    * details (text)
    * quantity (integer NOT NULL default 0)
* Tools (database table)
    * id (auto-generated)
    * user_id (foreign key to users table)
    * tool_name (varchar255 NOT NULL)
    * details (text)
    * quantity (integer NOT NULL default 0)
* Projects (database table)
    * id (auto-generated)
    * user_id (foreign key to users table)
    * project_name (varchar255 NOT NULL)
    * tools_needed (text)
    * supplies_needed (text)
    * instructions (text)
    * delivery_date ()
    * done (varchar255 NOT NULL)

    



### 8. API Documentation
#### API Overview
```text
    /api
    .
    ├── /auth
    │   └── POST
    │       ├── /login
    ├── /users
    │   └── POST
    │       └── /
    ├── /supplies
    |   └── GET
    |       ├── /:user_id
    |   └── POST
    |       ├── /
    |   └── DELETE
    |       ├── /:supply_id
    |   └── PATCH
    |       └── /:supply_id
    ├── /tools
    |   └── GET
    |       ├── /:user_id
    |   └── POST
    |       ├── /
    |   └── DELETE
    |       ├── /:supply_id
    |   └── PATCH
    |       └── /:supply_id
    ├── projects
    |   └── GET
    |       ├── /:user_id
    |   └── POST
    |       ├── /
    |   └── DELETE
    |       ├── /:supply_id
    |   └── PATCH
    |       └── /:supply_id
```

##### POST `/api/auth/login`
```js
    // req.body
    {
        "name": "Demo User",
        "username": "demo-email@gmail.com",
        "password": "Fabulous1"
    }

    // res.body
    {
        "authToken": String,
        "userId": 4
    }
```

##### POST `/api/users/`
```js
    // req.body
    {
        "name": "Tin Woodsman",
        "password": "Fabulous1",
        "username": "no-heart@gmail.com"
    }


    // res.body
    {
        "id": 10,
        "name": "Tin Woodsman",
        "username": "no-heart@gmail.com"
    }
```

##### GET `/api/supplies/:user_id`
```js
    // req.query
        id: 2

    // res.body
    [
        {
            "id": 1,
            "user_id": 2,
            "supply_name": "fabric - cotton - jersey knit",
            "details": "blue, yards",
            "quantity": 3
        },
        {
            "id": 4,
            "user_id": 2,
            "supply_name": "thread",
            "details": "green, spools",
            "quantity": 1
        },
        {
            "id": 2,
            "user_id": 2,
            "supply_name": "nails",
            "details": "...",
            "quantity": 50
        }
    ]
```

##### POST `/api/supplies/`
```js
    // req.body
    {
        "user_id": 3,
        "supply_name": "thread",
        "details": "green, spools",
        "quantity": 1
    }


    // res.body
    {
        "id": 20,
        "user_id": 3,
        "supply_name": "thread",
        "details": "green, spools",
        "quantity": 1
    }
```

##### DELETE `/api/supplies/:supply_id`
```js
    // req.query
    id: 3

    // res.body
    
```

##### PATCH `/api/supplies/:supply_id`
```js
    // req.body
    {
        "user_id": 2,
        "supply_id": "dirt",
        "details": "moo mix",
        "quantity": 2
    }
    // res.body

```

##### GET `/api/tools/:user_id`
```js
    // req.query
        id: 2

    // res.body
    [
        {
            "id": 2,
            "user_id": 2,
            "tool_name": "paintbrush",
            "details": "large",
            "quantity": 10
        },
        {
            "id": 3,
            "user_id": 2,
            "tool_name": "sandpaper",
            "details": "fine",
            "quantity": 5
        },
        {
            "id": 1,
            "user_id": 2,
            "tool_name": "hammer",
            "details": "small, blue",
            "quantity": 2
        }
    ]
```

##### POST `/api/tools/`
```js
    // req.body
    {
        "user_id": 3,
        "tool_name": "origami paper",
        "details": "multicolored sheets",
        "quantity": 30
    }


    // res.body
    {
        "id": 14,
        "user_id": 3,
        "tool_name": "origami paper",
        "details": "multicolored sheets",
        "quantity": 30
    }
```

##### DELETE `/api/tools/:tool_id`
```js
    // req.query
    id: 5

    // res.body
    
```

##### PATCH `/api/tools/:tool_id`
```js
    // req.body
    {
        "user_id": 2,
        "tool_name": "hammer",
        "details": "small, blue",
        "quantity": 3
    }
    // res.body

```

##### GET `/api/projects/:user_id`
```js
    // req.query
        id: 2

    // res.body
    [
        {
            "id": 3,
            "user_id": 3,
            "project_name": "Raised Bed Garden",
            "supplies_needed": "wood, screws, chicken wire",
            "tools_needed": "drill, wire cutters",
            "instructions": "1. Cut the boards, 2. Screw them together. 3. put dirt in.",
            "delivery_date": "2021-05-02T00:00:00.000Z",
            "done": "DONE it myself!"
        },
        {
            "id": 5,
            "user_id": 3,
            "project_name": "Stormy Pants",
            "supplies_needed": "blue thread, jersey knit cotton, pattern",
            "tools_needed": "marking pen, pins, scissors, sewing machine, sewing machine needle",
            "instructions": "cut the pattern and sew",
            "delivery_date": "2021-09-30T00:00:00.000Z",
            "done": "to-do myself"
        },
        {
            "id": 1,
            "user_id": 3,
            "project_name": "Beehive shelves",
            "supplies_needed": "wood, screws",
            "tools_needed": "saw, ruler",
            "instructions": "Cut, screw and build",
            "delivery_date": "2021-05-14T00:00:00.000Z",
            "done": "doin' it myself"
        },
        {
            "id": 2,
            "user_id": 3,
            "project_name": "Herb garden",
            "supplies_needed": "seeds, dirt",
            "tools_needed": "shovel, trowel",
            "instructions": "plant",
            "delivery_date": "2021-05-15T00:00:00.000Z",
            "done": "DONE it myself!"
        }
    ]
```

##### POST `/api/projects/`
```js
    // req.body
    {
        "user_id": 4,
        "project_name": "Stormy Pants",
        "supplies_needed": "blue thread, jersey knit cotton, pattern",
        "tools_needed": "marking pen, pins, scissors, sewing machine, sewing machine needle",
        "instructions": "...",
        "delivery_date": "2021-09-30T04:00:00.000Z",
        "done": "to-do myself"
    }


    // res.body
    {
        "id": 10,
        "user_id": 4,
        "project_name": "Stormy Pants",
        "supplies_needed": "blue thread, jersey knit cotton, pattern",
        "tools_needed": "marking pen, pins, scissors, sewing machine, sewing machine needle",
        "instructions": "...",
        "delivery_date": "2021-09-30T04:00:00.000Z",
        "done": "to-do myself"
    }
```

##### DELETE `/api/project/:project_id`
```js
    // req.query
    id: 3

    // res.body
    
```

##### PATCH `/api/projects/:project_id`
```js
    // req.body
    {
        "user_id": 3,
        "project_name": "Herb garden",
        "supplies_needed": "seeds, dirt",
        "tools_needed": "shovel, trowel",
        "instructions": "plant",
        "delivery_date": "2021-06-15T00:00:00.000Z",
        "done": "DONE it myself"
    }
    // res.body

```





### 9. Screenshots
Landing Page
:-------------------------:
![Landing Page](/github-images/screenshots/landing-page.png)
Sign Up Page
![Sign Up Page](/github-images/screenshots/sign-up-page.png)
Log In Page
![Log In Page](/github-images/screenshots/log-in-page.png)
"My DIY Dashboard"
!["My DIY Dashboard"](/github-images/screenshots/dashboard.png)
"My DIY Supplies"
!["My DIY Supplies"](/github-images/screenshots/supplies.png)
Add Supply
![Add Supply](/github-images/screenshots/add-supply.png)
Edit Supply
![Edit Supply](/github-images/screenshots/edit-supply.png)
"My DIY Tools"
!["My DIY Tools"](/github-images/screenshots/tools.png)
Add Tool
![Add Tool](/github-images/screenshots/add-tool.png)
Edit Tool
![Edit Tool](/github-images/screenshots/edit-tool.png)
"My DIY Projects"
!["My DIY Projects"](/github-images/screenshots/projects.png)
Add Project
![Add Project](/github-images/screenshots/add-project.png)
Edit Project
![Edit Project](/github-images/screenshots/edit-project.png)



### 10. Development Roadmap
This is v2.0 of the app, but future enhancements are expected to include:
* add functionality to allow users to create a shopping list for items they are missing for a project
* add functionality for users to retrieve forgotten log in information
* add functionality for users to upload pictures of their projects
* add icons and/or images for common inventory items
* add databases shared among users to add tools, supplies and projects that other users have added




### 11. How to run it
Use command line to navigate into the project folder and run the following in terminal

##### Local React scripts
* To install the react project ===> npm install
* To run react (on port 3000) ===> npm start
* To run tests ===> npm run test

##### Local Node scripts
* To install the node project ===> npm install
* To migrate the database ===> npm run migrate -- 1
* To run Node server (on port 8000) ===> npm run dev
* To run tests ===> npm run test