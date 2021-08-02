const request = require('supertest'),
    app = require('../app'),
    assert = require('assert'),
    chai = require('chai');

describe('AdminORMaintainer /productgroups', () => {
    let productData = {
        "name": "p4",
        "short_description": "loem ipsum",
        "description": "loem ipsum",
        "buy_price": 50,
        "recommended_retail_price": 20,
        "product_group": "ffeb5135-7f69-45b2-8dbe-af4786072a10",
        "sku": "1212"
    };
    let agent;
    let userData = {
        "email": `test-post.${new Date().getTime()}@yopmail.com`,
        "password": 111111,
        "status": "ACTIVE",
        "role": "EMPLOYEE",
        "name": "xxew",
        "websites": ["7cf23817-f507-4b7b-aa87-ce764ba0cf5d", "918b07e0-ea16-49dc-93a4-8bd34e6af449"]
    }
    before((done) => {
        // Login
        agent = request.agent(app);
        agent.post('/login')
            .send('email=superadmin@local&password=supertest')
            .expect(204, done);
    });

    before((done) => {
        let requestedData = { ...userData };
        agent.post('/api/accounts')
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                done();
            }).catch((err) => done(err));
    });

    before((done) => {
        // Login
        agent = request.agent(app);
        agent.post('/login')
            .send(`email=${userData.email}&password=111111`)
            .expect(204, done);
    });

    describe('Validations check', () => {
        it('Admin and Maintainer (name):- It should return 401 error', (done) => {
            let requestedData = { ...productData };
            agent.post('/api/products')
                .send(requestedData)
                .expect(401, done);
        });
    });
});