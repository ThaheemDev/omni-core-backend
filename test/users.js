const request = require('supertest'),
  app = require('../app'),
  assert = require('assert'),
  chai = require('chai');

let loginRequestedData = {
  email: "",
  password: "111111"
};

let agent;

before((done) => {
  // Login
  agent = request.agent(app);
  agent.post('/login')
    .send('email=superadmin@local&password=supertest')
    .expect(204, done);
});

describe('POST /accounts', () => {
  let userData = {
    email: `test.${new Date().getTime()}@yopmail.com`,
    password: '111111',
    websites: ['https://google.com'],
    status: 'ACTIVE',
    role: 'ADMIN',
    name: 'test data'
  };

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
  let userData = {
    "email": `test.${new Date().getTime()}@yopmail.com`,
    "websites": ["https://google.com"],
    "status": "ACTIVE",
    "role": 1,
    "name": "test data",
    "password": 111111
  };

  before(() => {
    let requestedData = {...userData};
    return agent.post('/api/accounts')
      .send(requestedData)
      .then(function (res) {
        if (res.status == 200) {
          return userData['uid'] = res.body.uid;
        }
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
      requestedData.role = 3;
      delete requestedData.password;

      agent.put(`/api/accounts/${userData.uid}`)
        .send(requestedData)
        .then(function (err, res) {
          assert.strictEqual(err.status, 422);
          done();
        });
    });
  });


  describe('Update Account', () => {
    it('It should return 200', (done) => {
      let requestedData = {...userData};

      delete requestedData.password;

      agent.put(`/api/accounts/${userData.uid}`)
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

  // TODO: add test to make sure only users with ADMIN role can create new users
});

describe('GET /accounts', () => {
  describe('Account Listing', () => {
    it('It should return array on objects with 200', (done) => {
      let requestedData = {...loginRequestedData};

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
    let requestedData = {...userData};
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
      let requestedData = {...userData};

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
      let requestedData = {id: userData.id};

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
