const request = require('supertest'),
  app = require('../app');

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
});
