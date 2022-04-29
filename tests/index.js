// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
// Configure chai
chai.should();
chai.use(chaiHttp);

describe("Unit Testing", () => {

    //test for getting data without token
    describe("GET RECORDS WITHOUT TOKEN BY ADMIN /", () => {
        it("should get all films records", (done) => {
            chai.request(app)
                .get('/admin/all-films')
                .end((err, response) => {

                    response.should.have.property('statusCode').to.equal(200);
                    response.body.should.have.property('success').to.be.true;
                    response.body.should.be.a('object');
                    done();
                });
        });


    });


    ///test for user signup
    describe("User Signup Test /", () => {
        it("should save user", (done) => {
            chai.request(app)
                .post('/auth/signup')
                .set("Connection", "keep alive")
                .set("Content-Type", "application/json")
                .type("form")
                .send({ "name": "dummy Reviewer", "isReviewer": true, "description": "im a reviewer", "email": "reviewer1@gmail.com", password: "Reviewer@123456" })
                .end((err, response) => {

                    response.should.have.property('statusCode').to.equal(200);
                    response.body.should.have.property('success').to.be.true;
                    response.body.should.be.a('object');
                    done();
                });
        });


    });

});