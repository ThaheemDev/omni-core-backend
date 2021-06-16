const request = require('supertest'),
  app = require('../app'),
  assert = require('assert');
chai = require('chai');


let loginRequestedData = {
  email: "",
  password: "111111"
};
let createdUserID = 0;
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
          .then(function (res) {
            if (res.status == 200) {
              loginRequestedData['email'] = requestedData.email;
              createdUserID = res.body.data.id;
            }
            assert.strictEqual(res.status, 200);
            done();
          });
      });
    });

  });


  describe('POST /login', () => {

    describe('Validations check', () => {

      it('Require(email):- It should return 401 error', (done) => {

        let requestedData = { ...loginRequestedData };
        delete requestedData.email;

        request(app)
          .post('/api/login')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 401);
            done();
          });
      });

      it('Require(password):- It should return 401 error', (done) => {

        let requestedData = { ...loginRequestedData };
        delete requestedData.password;

        request(app)
          .post('/api/login')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 401);
            done();
          });
      });
    });

    describe('Login', () => {
      it('It should logged-in successfully', (done) => {

        let requestedData = { ...loginRequestedData };
        request(app)
          .post('/api/login')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 200);
            done();
          });
      });

    });

  });

  describe('PUT /accounts', () => {

    let userData = {
      "email": `test.${new Date().getTime()}@yopmail.com`,
      "websites": ["https://google.com"],
      "status": "ACTIVE",
      "role": 1,
      "name": "test data",
      "password": 111111
    };

    before(() => {
      let requestedData = { ...userData };
      return request(app)
        .post('/api/accounts')
        .send(requestedData)
        .then(function (res) {
          if (res.status == 200) {
            return userData['id'] = res.body.data.id;
          }

        });
    });


    describe('Validations check', () => {




      it('Require(id):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        delete requestedData.id;
        delete requestedData.password;

        request(app)
          .put('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Maxlength(name):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        delete requestedData.password;

        requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

        request(app)
          .put('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Maxlength(email):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.email = 'loremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytext@yopmail.com';

        delete requestedData.password;

        request(app)
          .put('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });

      it('Maxlength(websites):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.websites = ['Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name'];
        delete requestedData.password;

        request(app)
          .put('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Email validate(email):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.email = 'testmail.com';
        delete requestedData.password;
        request(app)
          .put('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });


      it('Type Validation(status):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.status = 'ACTIVE1';
        delete requestedData.password;
        request(app)
          .put('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });

      it('Type Validation(role):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        requestedData.role = 3;
        delete requestedData.password;
        request(app)
          .put('/api/accounts')
          .send(requestedData)
          .then(function (err, res) {
            assert.strictEqual(err.status, 422);
            done();
          });
      });
    });


    describe('Update Account', () => {




      it('It should return 200', (done) => {

        let requestedData = { ...userData };
        delete requestedData.password;
        request(app)
          .put('/api/accounts')
          .send(requestedData)
          .then(function (res) {
            if (res.stauts == 200) {
              loginRequestedData['email'] = requestedData.email;
            }
            assert.strictEqual(res.status, 200);
            done();
          });
      });

    });



  });


  describe('GET /accounts', () => {

    describe('Account Listing', () => {
      it('It should return array on objects with 200', (done) => {

        let requestedData = { ...loginRequestedData };
        request(app)
          .get('/api/accounts')
          .send(requestedData)
          .then(function (res) {
            chai.expect(res.body.data).to.be.an('array');
            assert.strictEqual(res.status, 200);
            done();
          });
      });

    });

  });


  describe('DELETE /accounts', () => {

    let userData = {
      "email": `test.${new Date().getTime()}@yopmail.com`,
      "websites": ["https://google.com"],
      "status": "ACTIVE",
      "role": 1,
      "name": "test data",
      "password": 111111
    };

    before(() => {
      let requestedData = { ...userData };
      return request(app)
        .post('/api/accounts')
        .send(requestedData)
        .then(function (res) {
          if (res.status == 200) {
            return userData['id'] = res.body.data.id;
          }

        });
    });


    describe('Validations check', () => {

      it('Require(id):- It should return 422 error', (done) => {

        let requestedData = { ...userData };
        delete requestedData.id;
        delete requestedData.password;

        request(app)
          .delete('/api/accounts')
          .send(requestedData)
          .then(function (res) {
            assert.strictEqual(res.status, 422);
            done();
          });
      });

    });


    describe('Delete Account', () => {

      it('It should return 200', (done) => {

        let requestedData = { id: userData.id };

        request(app)
          .delete('/api/accounts')
          .send(requestedData)
          .then(function (res) {
            assert.strictEqual(res.status, 200);
            done();
          });
      });

    });



  });

});
