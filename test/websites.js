const request = require('supertest'),
  app = require('../app'),
  assert = require('assert');
chai = require('chai');


describe('POST /websites', () => {

  let websiteData = {
    "name": `Site ${new Date().getTime()}`,
    "status": 1,
    "domainname": "http://google.com",
    "size": "MEDIUM"
  };


  describe('Validations check', () => {


    it('Require(name):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      delete requestedData.name;

      request(app)
        .post('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });


    it('Require(domainname):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      delete requestedData.domainname;

      request(app)
        .post('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });


    it('Maxlength(name):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

      request(app)
        .post('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });


    it('Maxlength(domainname):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      requestedData.domainname = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

      request(app)
        .post('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });


    it('Type Validation(status):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      requestedData.status = '1000';

      request(app)
        .post('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

    it('Type Validation(size):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      requestedData.size = "Test Data";

      request(app)
        .post('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

  });


  describe('Create new website', () => {

    it('It should return 200', (done) => {

      let requestedData = { ...websiteData };
      request(app)
        .post('/api/websites')
        .send(requestedData)
        .then(function (res) {
          assert.strictEqual(res.status, 200);
          done();
        });
    });
  });

});

describe('PUT /websites', () => {

  let websiteData = {
    "name": `Site ${new Date().getTime()}`,
    "status": 1,
    "domainname": "http://google.com",
    "size": "MEDIUM"
  };


  before(() => {
    let requestedData = { ...websiteData };
    return request(app)
      .post('/api/websites')
      .send(requestedData)
      .then(function (res) {
        if (res.status == 200) {
          return websiteData['id'] = res.body.data.id;
        }

      });
  });


  describe('Validations check', () => {


    it('Require(id):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      delete requestedData.id;

      request(app)
        .put('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });


    it('Maxlength(name):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

      request(app)
        .put('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });


    it('Maxlength(domainname):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      requestedData.domainname = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

      request(app)
        .put('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });


    it('Type Validation(status):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      requestedData.status = '1000';

      request(app)
        .put('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

    it('Type Validation(size):- It should return 422 error', (done) => {

      let requestedData = { ...websiteData };
      requestedData.size = "Test Data";

      request(app)
        .put('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

  });


  describe('Update Website', () => {

    it('It should return 200', (done) => {

      let requestedData = { ...websiteData };
      request(app)
        .put('/api/websites')
        .send(requestedData)
        .then(function (res) {
          assert.strictEqual(res.status, 200);
          done();
        });
    });
  });

});



describe('GET /websites', () => {

  describe('Website Listing', () => {
    it('It should return array on objects with 200', (done) => {

      let requestedData = {};
      request(app)
        .get('/api/websites')
        .send(requestedData)
        .then(function (res) {
          chai.expect(res.body.data).to.be.an('array');
          assert.strictEqual(res.status, 200);
          done();
        });
    });

  });

});


describe('Delete /websites', () => {

  let websiteData = {
    "name": `Site ${new Date().getTime()}`,
    "status": 1,
    "domainname": "http://google.com",
    "size": "MEDIUM"
  };


  before(() => {
    let requestedData = { ...websiteData };
    return request(app)
      .post('/api/websites')
      .send(requestedData)
      .then(function (res) {
        if (res.status == 200) {
          return websiteData['id'] = res.body.data.id;
        }

      });
  });


  describe('Validations check', () => {


    it('Require(id):- It should return 422 error', (done) => {

      let requestedData = {};

      request(app)
        .delete('/api/websites')
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });


  });


  describe('Delete Website', () => {

    it('It should return 200', (done) => {

      let requestedData = { id: websiteData.id };
      request(app)
        .delete('/api/websites')
        .send(requestedData)
        .then(function (res) {
          assert.strictEqual(res.status, 200);
          done();
        });
    });
  });

});
