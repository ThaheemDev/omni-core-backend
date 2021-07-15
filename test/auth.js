const request = require('supertest'),
  app = require('../app');
/*
 * TODO: add following tests
 *  - blocked users should not be able to log in
 */
describe('Authentication', () => {
  describe('Validations check', () => {
    it('Require(email):- It should return 401 error', (done) => {
      request(app)
        .post('/login')
        .send('password=supertest')
        .expect(401, done);
    });

    it('Require(password):- It should return 401 error', (done) => {
      request(app)
        .post('/login')
        .send('email=superadmin@local')
        .expect(401, done);
    });
  });

  describe('Login', () => {
    it('It should logged-in successfully', (done) => {
      request(app)
        .post('/login')
        .send('email=superadmin@local&password=supertest')
        .expect(204, done);
    });

    it('It should not logged with incorrect password', (done) => {
      request(app)
        .post('/login')
        .send('email=superadmin@local&password=incorrect')
        .expect(401, done);
    });

    it('It should not logged with incorrect user', (done) => {
      request(app)
        .post('/login')
        .send('email=superadmin@example.com&password=supertest')
        .expect(401, done);
    });
  });

  describe('Blocked /login',()=>{
    let agent;
    let userData = {
      "email": `test-del.${new Date().getTime()}@yopmail.com`,
      "websites": ["https://google.com"],
      "status": "BLOCKED",
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

    describe('Blocked Account', () => {
      it('It should not loggedin with blocked user', (done) => {
        request(app)
          .post('/login')
          .send(`email=${userData.email}.com&password=111111`)
          .expect(401, done);
      });
    });
  })
});