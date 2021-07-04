const request = require('supertest'),
  app = require('../app'),
  assert = require('assert'),
  chai = require('chai');

let loginRequestedData = {
  email: "",
  password: "111111"
};

describe('POST /accounts', () => {
  let agent;
  let userData = {
    email: `test-post.${new Date().getTime()}@yopmail.com`,
    password: '111111',
    websites: ['https://google.com'],
    status: 'ACTIVE',
    role: 'ADMIN',
    name: 'test data'
  };

  before((done) => {
    // Login
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  describe('Validations check', () => {
    it('Require(name):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      delete requestedData.name;
      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Require(email):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      delete requestedData.email;

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Require(websites):- It should return 422 error', (done) => {
      let requestedData = {...userData};
      requestedData.email="test@email.com"
      delete requestedData.websites;

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Optional(status):- It should return 200 ok', (done) => {
      let requestedData = {...userData};
      delete requestedData.status;

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(200, done);
    });

    it('Require(password):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      delete requestedData.password;

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Maxlength(name):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Maxlength(email):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.email = 'loremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytext@yopmail.com';

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Maxlength(websites):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.websites = ['Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name'];

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Email validate(email):- It should return 422 error', (done) => {
      let requestedData = {...userData};
      requestedData.email = 'testmail.com';

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Type Validation(status):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.status = 'ACTIVE1';

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

    it('Type Validation(role):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.role = 3;

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(422, done);
    });

  });

  describe('Create new account', () => {
    it('It should return 200', (done) => {
      let requestedData = {...userData};

      requestedData.email = `test.${new Date().getTime()}@yopmail.com`;

      agent.post('/api/accounts')
        .send(requestedData)
        .expect(200)
        .then(function (res) {
          res = res.body;
          assert.strictEqual(res.email, requestedData.email)
          assert.strictEqual(res.role, requestedData.role)
          assert.strictEqual(res.status, requestedData.status)
          assert.strictEqual(res.name, requestedData.name)
          chai.expect(res.uid).to.be.not.undefined;
          assert.strictEqual(res.websites.length, requestedData.websites.length);
          for (const site of res.websites) {
            chai.expect(site.uid).to.be.not.undefined;
            // TODO: enable once website is properly implemented
            // assert.ok(requestedData.websites.includes(site.domainname));
          }
          done();
        })
        .catch((err) => {
          done(err)
        });
    });
  });
  // TODO: add test to make sure only users with ADMIN role can create new users
});

describe('PUT /accounts', () => {
  let agent;
  let userData = {
    "email": `test-put.${new Date().getTime()}@yopmail.com`,
    "websites": ["https://google.com"],
    "status": "ACTIVE",
    "role": 'EMPLOYEE',
    "name": "test data",
    "password": 111111
  };

  before((done) => {
    // Login
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  before((done) => {
    let requestedData = {...userData};
    agent.post('/api/accounts')
      .send(requestedData)
      .expect(200)
      .then(function (res) {
        userData.uid = res.body.uid;
        done();
      }).catch((err) => done(err));
  });

  afterEach(function (done) {
    if (this.currentTest.state == 'failed') {
      return done();
    }
    agent.delete(`/api/accounts${userData.uid}`)
      .send()
      .then((res) => {
        done()
      })
      .catch((err) => {
        done()
      });
  });

  describe('Validations check', () => {
    it('Maxlength(name):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      delete requestedData.password;
      requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

      agent.put(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

    it('Maxlength(email):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.email = 'loremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytextloremipsumdummytext@yopmail.com';
      delete requestedData.password;

      agent.put(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

    it('Maxlength(websites):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.websites = ['Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name'];
      delete requestedData.password;

      agent.put(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

    it('Email validate(email):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.email = 'testmail.com';
      delete requestedData.password;

      agent.put(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

    it('Type Validation(status):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.status = 'ACTIVE1';
      delete requestedData.password;

      agent.put(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });

    it('Type Validation(role):- It should return 422 error', (done) => {
      let requestedData = {...userData};

      requestedData.role = 'not-a-real-role';
      delete requestedData.password;

      agent.put(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .expect(422, done);
    });
  });


  describe('Update Account', () => {
    it('It should return 200', (done) => {
      let requestedData = {...userData};

      delete requestedData.password;
      requestedData.role = 'MAINTAINER';
      requestedData.name = 'new name';
      requestedData.status = 'BLOCKED';

      agent.put(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .expect(200)
        .then(function (res) {
          res = res.body;
          // assert.strictEqual(res.email, userData.email)
          assert.strictEqual(res.role, requestedData.role)
          assert.strictEqual(res.status, requestedData.status)
          assert.strictEqual(res.name, requestedData.name)
          chai.expect(res.uid).to.be.not.undefined;
          assert.strictEqual(res.websites.length, userData.websites.length);
          for (const site of res.websites) {
            chai.expect(site.uid).to.be.not.undefined;
            // TODO: enable once website is properly implemented
            // assert.ok(userData.websites.includes(site.domainname));
          }
          done()
        });
    });
  });

  // TODO: add test to make sure only users with ADMIN role can create new users
});

describe('GET /accounts', () => {
  let agent;
  before((done) => {
    // Login
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  describe('Account Listing', () => {
    it('It should return array on objects with 200', (done) => {
      let requestedData = {...loginRequestedData};

      agent.get('/api/accounts?page=1&page_size=10')
        .send()
        .expect(200)
        .then(function (res) {
          chai.expect(res.body.results).to.be.an('array');
          chai.expect(res.body.total).to.be.an('number');
          done();
        });
    });

  });

});

describe('DELETE /accounts', () => {
  let agent;
  let userData = {
    "email": `test-del.${new Date().getTime()}@yopmail.com`,
    "websites": ["https://google.com"],
    "status": "ACTIVE",
    "role": 'EMPLOYEE',
    "name": "test data",
    "password": 111111
  };

  before((done) => {
    // Login
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  before((done) => {
    let requestedData = {...userData};
    agent.post('/api/accounts')
      .send(requestedData)
      .expect(200)
      .then(function (res) {
        userData.uid = res.body.uid;
        done();
      }).catch((err) => done(err));
  });

  describe('Delete Account', () => {
    it('It should return 200', (done) => {
      let requestedData = {id: userData.id};

      agent.delete(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .expect(204)
        .end(done);
    });
  });

  describe('Delete non-existing account', () => {
    it('It should return 422 error', (done) => {
      let requestedData = {...userData};

      delete requestedData.id;
      delete requestedData.password;

      agent.delete(`/api/accounts/2c60f40c-d8f2-11eb-864d-0b6e9170bbdf`)
        .send(requestedData)
        .expect(404)
        .end(done);
    });

  });
});