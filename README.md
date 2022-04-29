# films-reviews


###### This repo is about films-reviews CRUD Operation in node Express js.

###### Main Features/Modules:

- Admin Auth (Login)
- Users & Reviewers Auth (Login & Signup)
- User Comment
- Reviewer Reivew/Rate a film with 1-5 in range ratings.


###### How To Run the Application:

- You must have Node,Mongodb Service in your machine.
- clone this repo
- Run npm i to install all the required dependencies
- make sure your localMongodb instance is running
- Run nodemon app.js command to run the express server.
- you can get all the collections from here this postman Collection: Click Here(https://www.postman.com/tncdevs/workspace/films-review-project/collection/18858011-4c13e756-47ee-4859-824e-0e3eeec791a5?action=share&creator=18858011).

- you can also explore this swagger Api documentation as well here. Click here(https://app.swaggerhub.com/apis/shahkar-team/films-reviews-api/1.0.0)
-just change your apiurl in postman if you are running on local


###### How To Run tests:

- Some Tests are define inside ./tests/index.js file
- To test: Run npm run test
- you will see the test results in console


###### Some Important points:

-A Reviwer can reviwer only once on a film
-User can put multiple comments on each film with different comments








