# Burnsville - Mern-App 

# Simple eCommerce platform built with the MERN stack.

Deployed here: https://burnsvilleapp.herokuapp.com/

### Table of Contents

You're sections headers will be used to reference location of destination.

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [GET Routes](#getroutes)
- [Beyond GET Routes](#beyondgetroutes)
- [Postman](#postman)
- [References](#references)
- [License](#license)
- [Author Info](#author-info)

## Features

- Node js
- Express
- React
- Mongo DB
- Mongo DB compass UI -[mongo DB compass](#https://www.mongodb.com/products/compass)
- PayPal API - [PayPal](#https://developer.paypal.com/classic-home/)
- Full featured shopping cart
- Product reviews and ratings
- Top products carousel
- Product pagination
- Product search feature
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Mark orders as delivered option
- Checkout process (shipping, payment method, etc)
- PayPal / credit card / PayFast integration
- Database seeder (products & users)

## Requirements for Env Variables

- NODE_ENV = development
- PORT = 5000
- MONGO_URI = your mongodb uri
- JWT_SECRET = 'anyname you desire'
- PAYPAL_CLIENT_ID = your paypal client id

## Installation - Run

- `01.\DOWNLOAD THE ZIP REPOSITORY`
- `02.\_UNZIP`
- `03.\_CD INTO PROJECT`
- `04.\_NPM INSTALL`
- `05.\_CD INTO PROJECT IN CLIENT FOLDER`
- `06.\_NPM INSTALL`
- `07.\CD OUT AND BACK INTO ROOT FOLDER`
- `08.\_NPM RUN DEV - USING CONCURRENTLY TO RUN BOTH SERVERS IN ONE COMMAND`
- `10.\_ENJOY!`

`OR`

- `01.\DOWNLOAD THE ZIP REPOSITORT`
- `02.\_UNZIP`
- `03.\_CD INTO PROJECT`
- `04.\_NPM INSTALL`
- `05.\_NPM START`
- `06.\_CD INTO PROJECT IN CLIENT FOLDER`
- `07.\_NPM INSTALL`
- `08.\_NPM START`
- `09.\_ENJOY!`

- `11.\ NB ** If having trouble with dual servers running : run this command "sudo killall -9 node!" to kill all servers. **`

# Create frontend prod buil

- cd frontend
- npm run build

- There is a Heroku postbuild script, so if you push to Heroku, no need to build manually for deployment to Heroku

### Seed Database

- You can use the following commands to seed the database with some sample users and products as well as destroy all data

# Import data

- npm run data:import

# Destroy data

- npm run data:destroy

# Sample User Logins

- admin@example.com (Admin)
-  123456

- kenny@example.com (Customer)
- 123456

- imraan@example.com', (Customer)
- 123456

### GET Routes

- visit http://localhost: I'm 5000

  - /api/users
  - /api/orders
  - /api/products

### Beyond GET Routes

#### CURL

- Create a new weblist with:
  - `curl -X POST -H "Content-Type:application/json" http://localhost:5000/api/products/`
  - Update a new weblist with:
  - `curl -X PUT -H "Content-Type:application/json" http://localhost:5000/api/users/`
- Delete a message with:
  - `curl -X DELETE -H "Content-Type:application/json" http://localhost:5000/api/orders/`

#### Postman

- Install [Postman](https://www.getpostman.com/apps) to interact with REST API
- Create a message with:
  - URL: http://localhost:5000/api
  - Method: POST
  - Body: raw + JSON (application/json)
  - Update a message with:
  - URL: http://localhost:5000/api/
  - Method: PUT
- Delete a message with:
  - URL: http://localhost:5000/api/:id
  - Method: DELETE

## References


- All info gathered from a site called - https://heatonist.com/

- Hyperion Development Bootcamp

[Back To The Top](#read-me-template)

---

## License

MIT License

Copyright (c) [2022][david k miller]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[Back To The Top](#read-me-template)

---

## Author Info

- Twitter - [@DavidMillerster](https://twitter.com/DavidMillerster)

[Back To The Top](#read-me-template)
