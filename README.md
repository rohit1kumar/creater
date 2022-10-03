# Creator API

**Deployed on [Heroku](https://api-creator.herokuapp.com/).
Test the API with [Postman](https://www.getpostman.com/).**

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/20980024-cacd58c8-8eba-491a-8035-ceaf4fcc503b?action=collection%2Ffork&collection-url=entityId%3D20980024-cacd58c8-8eba-491a-8035-ceaf4fcc503b%26entityType%3Dcollection%26workspaceId%3D1c687d97-092e-4c07-b900-d7384e10b729)


## Steps to run the code :

### Clone the repository
    $ git clone https://github.com/rohit1kumar/creater.git

### Install dependencies & run
    $ cd creater
    $ npm install && npm start

### Go to http://localhost:3000/ to see the app running.

### Base URL : http://localhost:3000/api/v1
---

## API Endpoints

|  REQUEST  |  ENDPOINT  |  DESCRIPTION  |
|    ---    |    ---     |     ---       |
| POST      | /user/login| Login with `username` and `password`         |
| POST      | /user/singup | Create user with `username`, `password`, `profession`, & `avatar` (upload it as form-data in postman)  |
| GET     | /user/logout   |Logout the user |
| GET   | /user | Get all the users |
| POST   | /donation | Make donation to someone using `to_creator`, `amount`, `name`, `message` <br> *Note: to_creator is the id of creator whom u want to donate* |
| POST | /donation/me | Get the all the donation my loginned user |
| GET | /donation/{from_creator}/{to_creator} | Get the all the donation from a particular creator A to a particular creator B
 |
