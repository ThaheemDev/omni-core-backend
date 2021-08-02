const request = require('supertest'),
    app = require('../app'),
    assert = require('assert'),
    chai = require('chai');


    var websiteData = {
        status: 'ACTIVE',
        domainname: `http://${Date.now()}.google.com`,
        size: "MEDIUM"
    };
    var productGroupData = {
        name: `Testing${new Date().getTime()}`,
    };
    var productData = {
        "name": `${Date.now()}Testing`,
        "short_description": "loem ipsum",
        "description": "loem ipsum",
        "buy_price": 50,
        "recommended_retail_price": 20,
        "product_group": "ffeb5135-7f69-45b2-8dbe-af4786072a10",
        "sku": "1212"
    };
    
    var websiteProduct = {
        name: `${Date.now()}Testing`,
        short_description: 'testing only',
        description: 'Lorem ipsum dummy text name lorem ipsum dummy text name',
        language: "english",
        price: 12.5,
        active: true,
        category: 'testing',
        sub_category: 'sun_testing',
        supplier: `${Date.now()}`,
        url: `http://${Date.now()}.google.com`,
        brand: 'Testing',
        website: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        product: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    }

describe('POST /website product', () => {
   
    let agent;
    

    before((done) => {
        agent = request.agent(app);
        agent.post('/login')
            .send('email=superadmin@local&password=supertest')
            .expect(204, done);
    });

    before((done) => {
        // agent = request.agent(app);
        let requestedData = { ...productGroupData };
        agent.post('/api/productgroups')
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                productGroupData.uid = res.body.uid;
                productData.product_group = res.body.uid;
                done()
            }).catch(done);
    });
    before((done) => {
        let requestedData = { ...websiteData };
        agent.post('/api/websites')
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                websiteData.uid = res.body.uid;
                websiteProduct.website = res.body.uid;
                done()
            }).catch(done);
    });

    before((done) => {
        let requestedData = { ...productData };
        agent.post('/api/products')
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                websiteProduct.product = res.body.uid;
                done();
            }).catch((err) => done(err));
    });

    describe('Validations check', () => {
        it('Require(website):- It should return 422 error', (done) => {
            let requestedData = { ...websiteProduct };
            delete requestedData.website;
            agent.post(`/api/websites/${websiteData.uid}/products`)
                .send(requestedData)
                .expect(422, done);
        });

        it('Require(product):- It should return 422 error', (done) => {
            let requestedData = { ...websiteProduct };
            delete requestedData.product;
            agent.post(`/api/websites/${websiteData.uid}/products`)
                .send(requestedData)
                .expect(422, done);
        });

        it('Maxlength(name):- It should return 422 error', (done) => {
            let requestedData = { ...websiteProduct };
            requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';
            agent.post(`/api/websites/${websiteData.uid}/products`)
                .send(requestedData)
                .expect(422, done);
        });
    });

    describe('Create new website product ', () => {
        it('It should return 200', (done) => {
            let requestedData = { ...websiteProduct };
            agent.post(`/api/websites/${websiteData.uid}/products`)
                .send(requestedData)
                .expect(200)
                .then(function (res) {
                    res = res.body;
                    chai.expect(res.uid).to.be.not.undefined;
                    assert.strictEqual(res.name, requestedData.name);
                    assert.strictEqual(res.short_description, requestedData.short_description);
                    assert.strictEqual(res.description, requestedData.description);
                    assert.strictEqual(res.price, requestedData.price);
                    assert.strictEqual(res.active, requestedData.active);
                    assert.strictEqual(res.category, requestedData.category);
                    assert.strictEqual(res.sub_category, requestedData.sub_category);
                    assert.strictEqual(res.languange, requestedData.languange);
                    assert.strictEqual(res.brand, requestedData.brand);
                    done();
                });
        });
    });
});


describe('PUT / websiteProduct', () => {
    let agent;
    // let websiteProduct = {
    //     name: `${Date.now()}Testing`,
    //     short_description: 'testing only',
    //     description: 'Lorem ipsum dummy text name lorem ipsum dummy text name',
    //     language: "english",
    //     price: 12.5,
    //     active: true,
    //     category: 'testing',
    //     sub_category: 'sun_testing',
    //     supplier: `${Date.now()}`,
    //     url: `http://${Date.now()}.google.com`,
    //     brand: 'Testing',
    //     website: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     product: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    // }
    before((done) => {
        agent = request.agent(app);
        agent.post('/login')
            .send('email=superadmin@local&password=supertest')
            .expect(204, done);
    });

   

    before((done) => {
        let requestedData = { ...productData };
        requestedData.name=`${Date.now()}Testing`
        agent.post('/api/products')
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                websiteProduct.product = res.body.uid;
                done();
            }).catch((err) => done(err));
    });

    before((done) => {
        let requestedData = { ...websiteProduct };
        agent.post(`/api/websites/${websiteData.uid}/products`)
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                websiteProduct.uid = res.body.uid;
                done()
            }).catch(done);
    });

    describe('Validations check', () => {
        it('Website Required:- It should return 422 error', (done) => {
            let requestedData = { ...websiteProduct };
            delete requestedData.website;
            agent.put(`/api/websites/${websiteData.uid}/products/${requestedData.uid}`)
                .send(requestedData)
                .expect(422, done);
        });
        it('Product Required:- It should return 422 error', (done) => {
            let requestedData = { ...websiteProduct };
            delete requestedData.product;
            agent.put(`/api/websites/${websiteData.uid}/products/${requestedData.uid}`)
                .send(requestedData)
                .expect(422, done);
        });
        it('Maxlength(name):- It should return 422 error', (done) => {
            let requestedData = { ...websiteProduct };
            requestedData.name = 'Lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name lorem ipsum dummy text name';
            agent.put(`/api/websites/${websiteData.uid}/products/${requestedData.uid}`)
                .send(requestedData)
                .expect(422, done);
        });
    });

    describe('Update productWebsite', () => {
        it('It should return 200', (done) => {
            let requestedData = { ...websiteProduct };
            delete requestedData.name;
            agent.put(`/api/websites/${websiteData.uid}/products/${requestedData.uid}`)
                .send(requestedData)
                .expect(200)
                .then(function (res) {                  
                    done();
                });
        });
    });
});

describe('GET / All websiteProduct ', () => {
    let agent;
   
    // let websiteProduct = {
    //     name: `${Date.now()}Testing`,
    //     short_description: 'testing only',
    //     description: 'Lorem ipsum dummy text name lorem ipsum dummy text name',
    //     language: "english",
    //     price: 12.5,
    //     active: true,
    //     category: 'testing',
    //     sub_category: 'sun_testing',
    //     supplier: `${Date.now()}`,
    //     url: `http://${Date.now()}.google.com`,
    //     brand: 'Testing',
    //     website: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     product: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    // }

    before((done) => {
        agent = request.agent(app);
        agent.post('/login')
            .send('email=superadmin@local&password=supertest')
            .expect(204, done);
    });

    // before((done) => {
    //     // agent = request.agent(app);
    //     let requestedData = { ...productGroupData };
    //     agent.post('/api/productgroups')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             productGroupData.uid = res.body.uid;
    //             productData.product_group = res.body.uid;
    //             done()
    //         }).catch(done);
    // });
    // before((done) => {
    //     let requestedData = { ...websiteData };
    //     agent.post('/api/websites')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             websiteData.uid = res.body.uid;
    //             websiteProduct.website = res.body.uid;
    //             done()
    //         }).catch(done);
    // });

    // before((done) => {
    //     let requestedData = { ...productData };
    //     agent.post('/api/products')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             websiteProduct.product = res.body.uid;
    //             done();
    //         }).catch((err) => done(err));
    // });

    before((done) => {
        let requestedData = { ...websiteProduct };
        requestedData.name=`${Date.now()}Testing`
        agent.post(`/api/websites/${websiteData.uid}/products`)
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                websiteProduct.uid = res.body.uid;
                done()
            }).catch(done);
    });

    describe('Website Product  Listing', () => {
        it('It should return array on objects with 200', (done) => {
            let requestedData = {};

            agent.get(`/api/websites/${websiteData.uid}/products`)
                .send(requestedData)
                .expect(200)
                .then(function (res) {
                    done();
                });
        });
    });
});

describe('GET /websiteProduct', () => {
    let agent;
   
    // let websiteProduct = {
    //     name: `${Date.now()}Testing`,
    //     short_description: 'testing only',
    //     description: 'Lorem ipsum dummy text name lorem ipsum dummy text name',
    //     language: "english",
    //     price: 12.5,
    //     active: true,
    //     category: 'testing',
    //     sub_category: 'sun_testing',
    //     supplier: `${Date.now()}`,
    //     url: `http://${Date.now()}.google.com`,
    //     brand: 'Testing',
    //     website: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     product: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    // }

    before((done) => {
        agent = request.agent(app);
        agent.post('/login')
            .send('email=superadmin@local&password=supertest')
            .expect(204, done);
    });

    // before((done) => {
    //     // agent = request.agent(app);
    //     let requestedData = { ...productGroupData };
    //     agent.post('/api/productgroups')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             productGroupData.uid = res.body.uid;
    //             productData.product_group = res.body.uid;
    //             done()
    //         }).catch(done);
    // });
    // before((done) => {
    //     let requestedData = { ...websiteData };
    //     agent.post('/api/websites')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             websiteData.uid = res.body.uid;
    //             websiteProduct.website = res.body.uid;
    //             done()
    //         }).catch(done);
    // });

    // before((done) => {
    //     let requestedData = { ...productData };
    //     agent.post('/api/products')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             websiteProduct.product = res.body.uid;
    //             done();
    //         }).catch((err) => done(err));
    // });

    before((done) => {
        let requestedData = { ...websiteProduct };
        requestedData.name=`${Date.now()}Testing`
        agent.post(`/api/websites/${websiteData.uid}/products`)
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                websiteProduct.uid = res.body.uid;
                done()
            }).catch(done);
    });

    describe('Product details', () => {
        it('It should return array on objects with 200', (done) => {
            let requestedData = {};

            agent.get(`/api/websites/${websiteData.uid}/products/${websiteProduct.uid}`)
                .send(requestedData)
                .expect(200)
                .then(function (res) {
                    done();
                });
        });
    });
});

describe('Delete /WebSite Products', () => {
    let agent;
   
    // let websiteProduct = {
    //     name: `${Date.now()}Testing`,
    //     short_description: 'testing only',
    //     description: 'Lorem ipsum dummy text name lorem ipsum dummy text name',
    //     language: "english",
    //     price: 12.5,
    //     active: true,
    //     category: 'testing',
    //     sub_category: 'sun_testing',
    //     supplier: `${Date.now()}`,
    //     url: `http://${Date.now()}.google.com`,
    //     brand: 'Testing',
    //     website: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     product: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    // }

    before((done) => {
        agent = request.agent(app);
        agent.post('/login')
            .send('email=superadmin@local&password=supertest')
            .expect(204, done);
    });
    // before((done) => {
    //     // agent = request.agent(app);
    //     let requestedData = { ...productGroupData };
    //     agent.post('/api/productgroups')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             productGroupData.uid = res.body.uid;
    //             productData.product_group = res.body.uid;
    //             done()
    //         }).catch(done);
    // });
    // before((done) => {
    //     let requestedData = { ...websiteData };
    //     agent.post('/api/websites')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             websiteData.uid = res.body.uid;
    //             websiteProduct.website = res.body.uid;
    //             done()
    //         }).catch(done);
    // });

    // before((done) => {
    //     let requestedData = { ...productData };
    //     agent.post('/api/products')
    //         .send(requestedData)
    //         .expect(200)
    //         .then(function (res) {
    //             websiteProduct.product = res.body.uid;
    //             done();
    //         }).catch((err) => done(err));
    // });

    before((done) => {
        let requestedData = { ...websiteProduct };
        requestedData.name=`${Date.now()}Testing`
        agent.post(`/api/websites/${websiteData.uid}/products`)
            .send(requestedData)
            .expect(200)
            .then(function (res) {
                websiteProduct.uid = res.body.uid;
                done()
            }).catch(done);
    });
    describe('Delete website product ', () => {
        it('It should return 200', (done) => {
            agent.delete(`/api/websites/${websiteData.uid}/products/${websiteProduct.uid}`)
                .send()
                .then(function (res) {
                    assert.strictEqual(res.status, 200);
                    done();
                });
        });
    });

    describe('Delete non-existing website product ', () => {
        it('It should return 200', (done) => {
            agent.delete(`/api/websites/${websiteData.uid}/products/8fa29de4-d911-11eb-a587-93dc4ed1ca81`)
                .send()
                .then(function (res) {
                    assert.strictEqual(res.status, 422);
                    done();
                });
        });
    });
});
