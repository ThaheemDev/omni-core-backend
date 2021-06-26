var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const websiteController = require('../controllers/website');
const passport = require('passport');

/**
 * @swagger
 * tags:
 *  name: Account
 *  description: Account management API
*/





/**
 * @swagger
 *  components:
 *   securitySchemes:
 *    BearerAuth:
 *     type: http
 *     scheme: bearer
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
 *           items:
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
router.post('/accounts', userController.signUp);


/* GET login user. */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login
 *     description:  It Can be used to login into website.
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                  - email
 *                  - password
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
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
 *                   type: object
 *                   properties:
 *                      id:
 *                          type: integer
 *                      name:
 *                          type: string
 *                      email:
 *                          type: string
 *                      role:
 *                          type: string
 *                          enum: [1,2]
 *                      websites:
 *                          type: array
 *                          items:
 *                           type: string
 *                      status:
 *                          type: string
 *                          enum: ['ACTIVE', 'BLOCKED']
 *                      token:
 *                          type: string
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
*/
router.post('/login',authController.login);

/* GET users listing. */
/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Users Listing
 *     description:  It can be use to get the active users listing.
 *     tags: [Account]   
 *     security:
 *       - BearerAuth: []
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
router.get('/accounts', passport.authenticate('jwt', {session: false}), userController.getUsers);

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
router.put('/accounts/:userId', passport.authenticate('jwt', {session: false}), userController.updateUser);

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
router.delete('/accounts/:userId', passport.authenticate('jwt', {session: false}), userController.deleteUser);



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
router.post('/websites', passport.authenticate('jwt', {session: false}), websiteController.create);

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
router.get('/websites', passport.authenticate('jwt', {session: false}), websiteController.getAll);

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
router.put('/websites/:websiteId', passport.authenticate('jwt', {session: false}), websiteController.update);

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
router.delete('/websites/:websiteId', passport.authenticate('jwt', {session: false}), websiteController.deletes);


module.exports = router;