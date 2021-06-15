const request = require('supertest'),
  app = require('../app'),
  assert = require('assert');

describe('Account Managment Test Cases', () => {


  describe('POST /accounts', () => {

    let userData = {
      "email": `test.${new Date().getTime()}@yopmail.com`,
      "password": '111111',
      "websites": ["https://google.com"],
      "status": "ACTIVE",
      "role": 1,
      "name": "test data"
    };



    describe('Validations check', () => {


      it('Require(name):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        delete requestedData.name;

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Require(email):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        delete requestedData.email;

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });

      it('Require(websites):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        delete requestedData.websites;

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Require(status):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        delete requestedData.status;

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });



      it('Require(password):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        delete requestedData.password;

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });



      it('Maxlength(name):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Maxlength(email):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.email = 'loremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytext@yopmail.com';

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });

      it('Maxlength(websites):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.websites = ['Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name'];

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Email validate(email):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.email = 'testmail.com';

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Type Validation(status):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.status = 'ACTIVE1';

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });

      it('Type Validation(role):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.role = 3;

        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });

    });


    describe('Create new account', () => {

      it('It should return 200', (done) => {

        let requestedData = { ...userData };
        request(app)
          .post('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 200);
            done();
          });
      });
    });
  });
});
