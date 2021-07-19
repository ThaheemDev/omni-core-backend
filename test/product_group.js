const request = require('supertest'),
  app = require('../app'),
  assert = require('assert'),
  chai = require('chai');

  var userData = {
    "email": `test-login.${new Date().getTime()}@yopmail.com`,
    "websites": ["https://google.com"],
    "status": "ACTIVE",
    "role": 'EMPLOYEE',
    "name": "test data",
    "password": "111111"
  };

  let productGroupData = {
    name: `Testing${new Date().getTime()}`,
  };
describe('POST /productgroups', () => {
 
  let agent;

  before((done) => {
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  describe('Validations check', () => {
    it('Require(name):- It should return 422 error', (done) => {
      let requestedData = {...productGroupData};
      delete requestedData.name;
      agent.post('/api/productgroups')
        .send(requestedData)
        .expect(422, done);
    });

    it('Maxlength(name):- It should return 422 error', (done) => {
      let requestedData = {...productGroupData};
      requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';
      agent.post('/api/productgroups')
        .send(requestedData)
        .expect(422, done);
    });
  });

  describe('Create new product group', () => {
    it('It should return 200', (done) => {
      let requestedData = {...productGroupData};
      requestedData.name = `Testing12364464`;
      agent.post('/api/productgroups')
        .send(requestedData)
        .expect(200)
        .then(function (res) {
          res = res.body;
          chai.expect(res.uid).to.be.not.undefined;
          assert.strictEqual(res.name, requestedData.name);
          done();
        });
    });
  });
});

// describe('AdminORMaintainer /productgroups', () => {
//     let productGroupData = {
//       name: `testingPRoductGroup`,
//     };
    
//     let agent;
    
  
//     before((done) => {
//       // Login
//       agent = request.agent(app);
//       agent.post('/login')
//         .send('email=superadmin@local&password=supertest')
//         .expect(204, done);
//     });
    
//       before((done) => {
//           // Login
//           agent = request.agent(app);
//           agent.post('/login')
//           .send(`email=${userData.email}.com&password=111111`)
//             .expect(204, done);
//         });
  
//     describe('Validations check', () => {
//       it('Admin and Maintainer (name):- It should return 401 error', (done) => {
//           let requestedData = {...productGroupData};
//           delete requestedData.name;
//           agent.post('/api/productgroups')
//             .send(requestedData)
//             .expect(401, done);
//         });
  
//     });
//   });

describe('PUT /productgroups', () => {
  let productGroupData = {
    name: `Testing123`
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
    let requestedData = {...productGroupData};
    agent.post('/api/productgroups')
      .send(requestedData)
      .expect(200)
      .then(function (res) {
        productGroupData.uid = res.body.uid;
        done()
      }).catch(done);
  });

  describe('Validations check', () => {
    it('Maxlength(name):- It should return 422 error', (done) => {
      let requestedData = {...productGroupData};
      requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';
      agent.put(`/api/productgroups/${requestedData.uid}`)
        .send(requestedData)
        .expect(422, done);
    });
  });

  describe('Update productgroups', () => {
    it('It should return 200', (done) => {
      let requestedData = {...productGroupData};
      delete requestedData.name;
      agent.put(`/api/productgroups/${requestedData.uid}`)
        .send(requestedData)
        .expect(200)
        .then(function (res) {
          res = res.body;
          chai.expect(res.uid).to.be.not.undefined;
          assert.strictEqual(res.name, productGroupData.name);
          done();
        });
    });
  });
});

describe('GET /productgropus', () => {
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
      name: `Testing123`,
      size: "MEDIUM"
    };

    agent.post('/api/productgroups')
      .send(requestedData)
      .expect(200)
      .then(function (res) {
        done()
      }).catch(done);
  });

  describe('Product Group Listing', () => {
    it('It should return array on objects with 200', (done) => {
      let requestedData = {};

      agent.get('/api/productgroups')
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

describe('Delete /productgroups', () => {
  let agent;
  let productGroupData = {
    name: `Testing123`,
  };

  before((done) => {
    agent = request.agent(app);
    agent.post('/login')
      .send('email=superadmin@local&password=supertest')
      .expect(204, done);
  });

  before((done) => {
    agent.post('/api/productgroups')
      .send(productGroupData)
      .expect(200)
      .then(function (res) {
        productGroupData.uid = res.body.uid;
        done()
      }).catch(done);
  });

  describe('Delete product group', () => {
    it('It should return 200', (done) => {
      agent.delete(`/api/productgroups/${productGroupData.uid}`)
        .send()
        .then(function (res) {
          assert.strictEqual(res.status, 200);
          done();
        });
    });
  });

  describe('Delete non-existing product group', () => {
    it('It should return 200', (done) => {
      agent.delete('/api/productgroups/8fa29de4-d911-11eb-a587-93dc4ed1ca81')
        .send()
        .then(function (res) {
          assert.strictEqual(res.status, 422);
          done();
        });
    });
  });
});
