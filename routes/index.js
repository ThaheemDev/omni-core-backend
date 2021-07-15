var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
const websiteController = require('../controllers/website');
const productController = require('../controllers/product');

async function isAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send();
  }
}

async function isAdmin(req, res, next) {
  if (req && req.user) {
    let userRole = await req.user.getRole();

    if (userRole.role == 'ADMIN') {
      next();
      return;
    }
    res.status(401).send();
  }
}

/**
 * @swagger
 * tags:
 *  name: Account
 *  description: Account management API
 */


/**
 * @swagger
 *  components:
 *   schemas:
 *      User:
 *       type: object
 *       properties:
 *          external_id:
 *           type: string
 *          name:
 *           type: string
 *          email:
 *           type: string
 *          role:
 *           type: string
 *           enum: ['ACTIVE', 'BLOCKED']
 *          websites:
 *           type: array
 *          items:
 *            type: string
 *          status:
 *           type: string
 *           enum: ['ACTIVE', 'BLOCKED']
 *      EmptyResponse:
 *       type: object
 *      Error:
 *       type: object
 *       properties:
 *          status:
 *           type: integer
 *           default: 2
 *          error:
 *           type: object
 *      Website:
 *       type: object
 *       properties:
 *          external_id:
 *           type: string
 *          domainname:
 *           type: string
 *          size:
 *           type: string
 *           enum: ['SMALL', 'MEDIUM', 'LARGE', 'XLARGE']
 *          status:
 *           type: string
 *           enum: ['ACTIVE', 'BLOCKED']
 *      ProductGroupModel:
 *       type: object
 *       properties:
 *          uid:
 *           type: string
 *          name:
 *           type: string
 *      ProductModel:
 *       type: object
 *       properties:
 *          uid:
 *           type: string
 *          name:
 *           type: string
 *          short_description:
 *           type: string
 *          description:
 *           type: string
 *          product_group:
 *           format: uuid
 *           x-faker: datatype.uuid
 *           type: string
 *          buy_price:
 *           type: number
 *          recommended_retail_price:
 *           type: number
 *          active:
 *           type: boolean
 *           default: false      
 *          category:
 *           type: string
 *          sub_category:
 *           type: string
 *          supplier:
 *           type: string  
 *          url:
 *           type: string
 *          brand:
 *           type: string
 *          images:
 *           type: array
 *           items:
 *            type: string
 *      ProductWebsiteModel:
 *       type: object
 *       properties:
 *          uid:
 *           format: uuid
 *           x-faker: datatype.uuid
 *           type: string
 *          name:
 *           type: string
 *          short_description:
 *           type: string
 *          description:
 *           type: string
 *          price:
 *           type: number
 *           format: float
 *           x-faker: commerce.price
 *          active:
 *           type: boolean
 *           default: false      
 *          category:
 *           type: string
 *          sub_category:
 *           type: string
 *          languange:
 *           type: string  
 *          brand:
 *           type: string
 *      ProductGroupViewModel:
 *       type: object
 *       properties:
 *          uid:
 *           type: string
 *          name:
 *           type: string
 */


/* POST create user. */
/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Signup
 *     description:  It Can be used to register into website.
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - name
 *                  - email
 *                  - role
 *                  - websites
 *                  - status
 *                  - password
 *              properties:
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  role:
 *                      type: string
 *                      enum: [1,2]
 *                  websites:
 *                      type: array
 *                      items:
 *                       type: string
 *                  status:
 *                      type: string
 *                      enum: ['ACTIVE', 'BLOCKED']
 *
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/accounts', isAuthenticated, isAdmin, userController.createUser);

/* GET users listing. */
/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Users Listing
 *     description:  It can be use to get the active users listing.
 *     tags: [Account]
 *     parameters:
 *      - deprecated: false
 *        name: page
 *        description: next page of results to display
 *        in: query
 *        required: true
 *        allowEmptyValue: true
 *      - deprecated: false
 *        example: '10'
 *        name: page_size
 *        description: Number of items per page
 *        in: query
 *        required: true
 *        allowEmptyValue: false
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 next:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 results:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/User'
 *       422:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/accounts', isAuthenticated, userController.getUsers);

/* update users . */
/**
 * @swagger
 * /accounts/{external_id}:
 *   put:
 *     summary: Update User
 *     description:  Update user account using {external_id}
 *     tags: [Account]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         required: true
 *         deprecated: false
 *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
 *         name: external_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - name
 *                  - email
 *                  - role
 *                  - websites
 *                  - status
 *              properties:
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  role:
 *                      type: string
 *                      enum: [1,2]
 *                  websites:
 *                      type: array
 *                      items:
 *                       type: string
 *                  status:
 *                      type: string
 *                      enum: ['ACTIVE', 'BLOCKED']
 *
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/EmptyResponse'
 *       422:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/accounts/:userId', isAuthenticated, isAdmin, userController.updateUser);

/* delete users . */
/* POST create user. */
/**
 * @swagger
 * /accounts/{external_id}:
 *   delete:
 *     summary: Account Remove
 *     description:  Remove account with {external_id}
 *     tags: [Account]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         required: true
 *         deprecated: false
 *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
 *         name: external_id
 *
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/EmptyResponse'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/accounts/:userId', isAuthenticated, isAdmin, userController.deleteUser);


/**
 * @swagger
 * tags:
 *  name: Website
 *  description: Website management API
 */

/* POST create website. */
/**
 * @swagger
 * /websites:
 *   post:
 *     summary: Create Website
 *     description:  It can be use to create website.
 *     tags: [Website]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - name
 *                  - size
 *                  - domainname
 *                  - status
 *              properties:
 *                  name:
 *                      type: string
 *                  domainname:
 *                      type: string
 *                  size:
 *                      type: string
 *                      enum: ['SMALL', 'MEDIUM', 'LARGE', 'XLARGE']
 *                  status:
 *                      type: string
 *                      enum: [1, 2, 3]
 *
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/Website'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/websites', isAuthenticated, isAdmin, websiteController.create);

/* GET website listing. */
/**
 * @swagger
 * /websites:
 *   get:
 *     summary: List Website
 *     description:  It can be use to list website.
 *     tags: [Website]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - deprecated: false
 *         name: page
 *         description: next page of results to display
 *         in: query
 *         required: true
 *         allowEmptyValue: true
 *       - deprecated: false
 *         example: '10'
 *         name: page_size
 *         description: Number of items per page
 *         in: query
 *         required: true
 *         allowEmptyValue: false
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Website'
 *                 total:
 *                   type: integer
 *                 next:
 *                   type: string
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/websites', isAuthenticated,  websiteController.getAll);

/* update website. */
/**
 * @swagger
 * /websites/{external_id}:
 *   put:
 *     summary: Website Update
 *     description:  Update existing website using {external_id}
 *     tags: [Website]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         required: true
 *         deprecated: false
 *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
 *         name: external_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - size
 *                  - domainname
 *                  - status
 *              properties:
 *                  domainname:
 *                      type: string
 *                  size:
 *                      type: string
 *                      enum: ['SMALL', 'MEDIUM', 'LARGE', 'XLARGE']
 *                  status:
 *                      type: string
 *                      enum: ['ACTIVE', 'BLOCKED']
 *
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/EmptyResponse'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/websites/:websiteId', isAuthenticated, isAdmin, websiteController.update);

/* delete website listing. */
/**
 * @swagger
 * /websites/{external_id}:
 *   delete:
 *     summary: Website Remove
 *     description:   Remove a website with `{external_id}`
 *     tags: [Website]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         required: true
 *         deprecated: false
 *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
 *         name: external_id
 *
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/EmptyResponse'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/websites/:websiteId', isAuthenticated, isAdmin, websiteController.deletes);


/**
 * @swagger
 * tags:
 *  name: Product
 *  description: Product management API
 */

/* POST create products. */
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create Product
 *     description:  It can be use to create product.
 *     tags: [Product]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - name
 *                  - buy_price
 *                  - recommended_retail_price
 *                  - product_group
 *              properties:
 *                  name:
 *                      type: string
 *                  short_description:
 *                      type: string
 *                  description:
 *                      type: string
 *                  product_group:
 *                      type: string
 *                  buy_price:
 *                      type: number
 *                  recommended_retail_price:
 *                      type: number
 *                  active:
 *                      type: boolean
 *                      default: false      
 *                  category:
 *                      type: string
 *                  sub_category:
 *                      type: string
 *                  supplier:
 *                      type: string  
 *                  url:
 *                      type: string
 *                  brand:
 *                      type: string
 *                  images:
 *                      type: array
 *                      items:
 *                       type: string         
 *
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/ProductModel'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
 router.post('/products', isAuthenticated, isAdmin, productController.create);

 /* GET products listing. */
 /**
  * @swagger
  * /products:
  *   get:
  *     summary: List Product
  *     description:  It can be use to list product.
  *     tags: [Product]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - deprecated: false
  *         name: page
  *         description: next page of results to display
  *         in: query
  *         required: true
  *         allowEmptyValue: true
  *       - deprecated: false
  *         example: '10'
  *         name: page_size
  *         description: Number of items per page
  *         in: query
  *         required: true
  *         allowEmptyValue: false
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 result:
  *                   type: array
  *                   items:
  *                      $ref: '#/components/schemas/ProductModel'
  *                 total:
  *                   type: integer
  *                 next:
  *                   type: string
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.get('/products', isAuthenticated,  productController.getAll);

  /* GET products listing. */
 /**
  * @swagger
  * /products/{external_id}:
  *   get:
  *     summary: Fetch a Product
  *     description:  It can be use to fetch the product.
  *     tags: [Product]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         required: true
  *         deprecated: false
  *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
  *         name: external_id
  * 
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   $ref: '#/components/schemas/ProductModel'
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
  router.get('/products/:productId', isAuthenticated,  productController.getDetails);
 
 /* update products */
 /**
  * @swagger
  * /products/{external_id}:
  *   put:
  *     summary: Product Update
  *     description:  Update existing product using {external_id}
  *     tags: [Product]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         required: true
  *         deprecated: false
  *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
  *         name: external_id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *              type: object
  *              required:
  *                  - name
  *                  - buy_price
  *                  - recommended_retail_price
  *                  - product_group
  *              properties:
  *                  name:
  *                      type: string
  *                  short_description:
  *                      type: string
  *                  description:
  *                      type: string
  *                  product_group:
  *                      type: string
  *                  buy_price:
  *                      type: number
  *                  recommended_retail_price:
  *                      type: number
  *                  active:
  *                      type: boolean
  *                      default: false      
  *                  category:
  *                      type: string
  *                  sub_category:
  *                      type: string
  *                  supplier:
  *                      type: string  
  *                  url:
  *                      type: string
  *                  brand:
  *                      type: string
  *                  images:
  *                      type: array
  *                      items:
  *                       type: string
  *
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   default: 1
  *                 data:
  *                   $ref: '#/components/schemas/ProductModel'
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.put('/products/:productId', isAuthenticated, isAdmin, productController.update);
 
 /* delete products. */
 /**
  * @swagger
  * /products/{external_id}:
  *   delete:
  *     summary: Product Remove
  *     description:   Remove a product with `{external_id}`
  *     tags: [Product]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         required: true
  *         deprecated: false
  *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
  *         name: external_id
  *
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   default: 1
  *                 data:
  *                   $ref: '#/components/schemas/EmptyResponse'
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.delete('/products/:productId', isAuthenticated, isAdmin, productController.deletes);


/**
 * @swagger
 * tags:
 *  name: ProductGroup
 *  description: Product group management API
 */

/* POST create product group */
/**
 * @swagger
 * /productgroups:
 *   post:
 *     summary: Create Product Group
 *     description:  It can be use to create product group.
 *     tags: [ProductGroup]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - name
 *              properties:
 *                  name:
 *                      type: string       
 *
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/ProductGroupModel'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
 router.post('/productgroups', isAuthenticated, isAdmin, productController.create);

 /* GET product groups listing. */
 /**
  * @swagger
  * /productgroups:
  *   get:
  *     summary: List Product Group
  *     description:  It can be use to list product group.
  *     tags: [ProductGroup]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - deprecated: false
  *         name: page
  *         description: next page of results to display
  *         in: query
  *         required: true
  *         allowEmptyValue: true
  *       - deprecated: false
  *         example: '10'
  *         name: page_size
  *         description: Number of items per page
  *         in: query
  *         required: true
  *         allowEmptyValue: false
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 result:
  *                   type: array
  *                   items:
  *                      $ref: '#/components/schemas/ProductGroupModel'
  *                 total:
  *                   type: integer
  *                 next:
  *                   type: string
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.get('/productgroups', isAuthenticated,  productController.getAll);
 
 /* update product group */
 /**
  * @swagger
  * /productgroups/{external_id}:
  *   put:
  *     summary: Product Group Update
  *     description:  Update existing product group using {external_id}
  *     tags: [ProductGroup]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         required: true
  *         deprecated: false
  *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
  *         name: external_id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *              type: object
  *              required:
  *                  - name
  *                  - buy_price
  *                  - recommended_retail_price
  *                  - product_group
  *              properties:
  *                  name:
  *                      type: string
  *
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   default: 1
  *                 data:
  *                   $ref: '#/components/schemas/ProductGroupViewModel'
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.put('/productgroups/:productGroupId', isAuthenticated, isAdmin, productController.update);
 
 /* delete product groups */
 /**
  * @swagger
  * /productgroups/{external_id}:
  *   delete:
  *     summary: Product Group Remove
  *     description:   Remove a product group with `{external_id}`
  *     tags: [ProductGroup]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         required: true
  *         deprecated: false
  *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
  *         name: external_id
  *
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   default: 1
  *                 data:
  *                   $ref: '#/components/schemas/EmptyResponse'
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.delete('/productgroups/:productGroupId', isAuthenticated, isAdmin, productController.deletes);

/**
 * @swagger
 * tags:
 *  name: ProductWebsite
 *  description: Product website management API
 */

/* POST create products website. */
/**
 * @swagger
 * /websites/{websiteId}/products:
 *   post:
 *     summary: Create Product
 *     description:  It can be use to create product website.
 *     tags: [ProductWebsite]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - website
 *                  - product
 *              properties:
 *                  website:
 *                      type: string
 *                      format: uuid
 *                      x-faker: datatype.uuid
 *                  product:
 *                      type: string
 *                      format: uuid
 *                      x-faker: datatype.uuid
 *                  name:
 *                      type: string
 *                  short_description:
 *                      type: string
 *                  description:
 *                      type: string
 *                  price:
 *                      type: number
 *                  active:
 *                      type: boolean
 *                      default: false      
 *                  category:
 *                      type: string
 *                  sub_category:
 *                      type: string
 *                  languange:
 *                      type: string  
 *                  brand:
 *                      type: string      
 *
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   default: 1
 *                 data:
 *                   $ref: '#/components/schemas/ProductWebsiteModel'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
 router.post('/products', isAuthenticated, isAdmin, productController.create);

 /* GET products website listing. */
 /**
  * @swagger
  * /websites/{websiteId}/products:
  *   get:
  *     summary: List Product
  *     description:  It can be use to list product website.
  *     tags: [ProductWebsite]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - deprecated: false
  *         name: page
  *         description: next page of results to display
  *         in: query
  *         required: true
  *         allowEmptyValue: true
  *       - deprecated: false
  *         example: '10'
  *         name: page_size
  *         description: Number of items per page
  *         in: query
  *         required: true
  *         allowEmptyValue: false
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 result:
  *                   type: array
  *                   items:
  *                      $ref: '#/components/schemas/ProductWebsiteModel'
  *                 total:
  *                   type: integer
  *                 next:
  *                   type: string
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.get('/products', isAuthenticated,  productController.getAll);

  /* GET products website by external_id. */
 /**
  * @swagger
  * /websites/{websiteId}/products/{productId}:
  *   get:
  *     summary: Fetch a Product
  *     description:  It can be use to fetch the product website.
  *     tags: [ProductWebsite]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         required: true
  *         deprecated: false
  *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
  *         name: productId
  * 
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   $ref: '#/components/schemas/ProductWebsiteModel'
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
  router.get('/products/:productId', isAuthenticated,  productController.getDetails);
 
 /* update products */
 /**
  * @swagger
  * /websites/{websiteId}/products/{productId}:
  *   put:
  *     summary: Product Update
  *     description:  Update existing product website using {external_id}
  *     tags: [ProductWebsite]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         required: true
  *         deprecated: false
  *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
  *         name: productId
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *              type: object
  *              required:
  *                  - website
  *                  - product
  *              properties:
  *                  website:
  *                      type: string
  *                      format: uuid
  *                      x-faker: datatype.uuid
  *                  product:
  *                      type: string
  *                      format: uuid
  *                      x-faker: datatype.uuid
  *                  name:
  *                      type: string
  *                  short_description:
  *                      type: string
  *                  description:
  *                      type: string
  *                  price:
  *                      type: number
  *                  active:
  *                      type: boolean
  *                      default: false      
  *                  category:
  *                      type: string
  *                  sub_category:
  *                      type: string
  *                  language:
  *                      type: string  
  *                  brand:
  *                      type: string
  *
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   default: 1
  *                 data:
  *                   $ref: '#/components/schemas/ProductWebsiteModel'
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.put('/products/:productId', isAuthenticated, isAdmin, productController.update);
 
 /* Delete products website */
 /**
  * @swagger
  * /websites/{websiteId}/products/{productId}:
  *   delete:
  *     summary: Product website Remove
  *     description:   Remove a product website with `{external_id}`
  *     tags: [ProductWebsite]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         required: true
  *         deprecated: false
  *         example: '"9c153c6e-c631-11eb-9ea4-6beea7caa795"'
  *         name: productId
  *
  *     responses:
  *       200:
  *         description: Success.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   default: 1
  *                 data:
  *                   $ref: '#/components/schemas/EmptyResponse'
  *       422:
  *         description: Error.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Error'
  */
 router.delete('/products/:productId', isAuthenticated, isAdmin, productController.deletes);

module.exports = router;