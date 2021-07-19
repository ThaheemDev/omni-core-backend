const request = require('supertest'),
  app = require('../app'),
  assert = require('assert'),
  chai = require('chai');

/*
 * TODO: add following tests:
 *  - non-admin users should only be able to access sites they belong to
 *  - only admin & maintainer can create products groups
 *  - only admin & maintainer can create products
 *  - employee can only override existing products, i.e. create/edit a website-product.
 */

describe('POST /websites', () => {
  let websiteData = {
    status: 'ACTIVE',
    domainname: `http://${Date.now()}.google.com`,
    size: 'MEDIUM'
  };
  let agent;

  before((done) => {
    // Login
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  describe('Validations check', () => {
    it('Require(domainname):- It should return 422 error', (done) => {
      let requestedData = {...websiteData};
      delete requestedData.domainname;
      agent.post('/api/websites')
        .send(requestedData)
        .expect(422, done);
    });

    it('Maxlength(domainname):- It should return 422 error', (done) => {
      let requestedData = {...websiteData};
      requestedData.domainname = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

      agent.post('/api/websites')
        .send(requestedData)
        .expect(422, done);
    });

    it('Type Validation(status):- It should return 422 error', (done) => {
      let requestedData = {...websiteData};
      requestedData.status = '1000';
      agent.post('/api/websites')
        .send(requestedData)
        .expect(422, done);
    });

    it('Type Validation(size):- It should return 422 error', (done) => {
      let requestedData = {...websiteData};
      requestedData.size = "Test Data";
      agent.post('/api/websites')
        .send(requestedData)
        .expect(422, done);
    });

  });

  describe('Create new website', () => {
    it('It should return 200', (done) => {
      let requestedData = {...websiteData};
      requestedData.domainname = `http://${Date.now()}.google.com`;
      agent.post('/api/websites')
        .send(requestedData)
        .expect(200)
        .then(function (res) {
          res = res.body;
          chai.expect(res.uid).to.be.not.undefined;
          assert.strictEqual(res.status, requestedData.status);
          assert.strictEqual(res.size, requestedData.size);
          assert.strictEqual(res.domainname, requestedData.domainname);
          done();
        });
    });
  });

});

describe('PUT /websites', () => {
  let websiteData = {
    status: 'ACTIVE',
    domainname: `http://${Date.now()}.google.com`,
    size: "MEDIUM"
  };
  let agent;

  before((done) => {
    // Login
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  before((done) => {
    let requestedData = {...websiteData};

    agent.post('/api/websites')
      .send(requestedData)
      .expect(200)
      .then(function (res) {
        websiteData.uid = res.body.uid;
        done()
      }).catch(done);
  });

  describe('Validations check', () => {
    it('Maxlength(domainname):- It should return 422 error', (done) => {
      let requestedData = {...websiteData};
      requestedData.domainname = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';

      agent.put(`/api/websites/${requestedData.uid}`)
        .send(requestedData)
        .expect(422, done);
    });

    it('Type Validation(status):- It should return 422 error', (done) => {
      let requestedData = {...websiteData};
      requestedData.status = '1000';
      agent.put(`/api/websites/${requestedData.uid}`)
        .send(requestedData)
        .expect(422, done);
    });

    it('Type Validation(size):- It should return 422 error', (done) => {
      let requestedData = {...websiteData};
      requestedData.size = "Test Data";
      agent.put(`/api/websites/${requestedData.uid}`)
        .send(requestedData)
        .expect(422, done);
    });
  });

  describe('Update Website', () => {
    it('It should return 200', (done) => {
      
      let requestedData = {...websiteData};
      requestedData.size = 'LARGE';
      requestedData.status = 'BLOCKED';
      delete requestedData.domainname;

      agent.put(`/api/websites/${requestedData.uid}`)
        .send(requestedData)
        .expect(200)
        .then(function (res) {
          res = res.body;
          chai.expect(res.uid).to.be.not.undefined;
          assert.strictEqual(res.status, requestedData.status);
          assert.strictEqual(res.size, requestedData.size);
          assert.strictEqual(res.domainname, websiteData.domainname);
          done();
        });
    });
  });
});

describe('GET /websites', () => {
  let agent;
  before((done) => {
    // Login
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  before((done) => {
    let requestedData = {
      status: 'ACTIVE',
      domainname: `http://${Date.now()}.google.com`,
      size: "MEDIUM"
    };

    agent.post('/api/websites')
      .send(requestedData)
      .expect(200)
      .then(function (res) {
        done()
      }).catch(done);
  });

  describe('Website Listing', () => {
    it('It should return array on objects with 200', (done) => {
      let requestedData = {page:1,page_size:10};

      agent.get('/api/websites')
        .send(requestedData)
        .expect(200)
        .then(function (res) {
          chai.expect(res.body.results).to.be.an('array');
          chai.expect(res.body.total).to.be.an('number');
          done();
        });
    });
  });
});

describe('Delete /websites', () => {
  let agent;
  let websiteData = {
    status: 'ACTIVE',
    domainname: `http://${Date.now()}.bing.com`,
    size: "MEDIUM"
  };

  before((done) => {
    // Login
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  before((done) => {
    agent.post('/api/websites')
      .send(websiteData)
      .expect(200)
      .then(function (res) {
        websiteData.uid = res.body.uid;
        done()
      }).catch(done);
  });

  describe('Delete Website', () => {
    it('It should return 200', (done) => {
      agent.delete(`/api/websites/${websiteData.uid}`)
        .send()
        .then(function (res) {
          assert.strictEqual(res.status, 200);
          done();
        });
    });
  });

  describe('Delete non-existing website', () => {
    it('It should return 200', (done) => {
      agent.delete('/api/websites/8fa29de4-d911-11eb-a587-93dc4ed1ca81')
        .send()
        .then(function (res) {
          assert.strictEqual(res.status, 422);
          done();
        });
    });
  });
});