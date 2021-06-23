var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const websiteController = require('../controllers/website');

const jwtauth = require('../jwtauth.js');


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
 *          id:
 *           type: integer
 *          name:
 *           type: string
 *          email:
 *           type: string
 *          role:
 *           type: string
 *           enum: [1,2]
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
 *          id:
 *           type: integer
 *          name:
 *           type: string
 *          domainname:
 *           type: string
 *          size:
 *           type: string
 *           enum: ['SMALL', 'MEDIUM', 'LARGE', 'XLARGE']
 *          status:
 *           type: string
 *           enum: [1, 2, 3]
*/




/* POST create user. */
/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Signup
 *     description:  It Can be used to register into website.
 *     tags: [Account]
 *     parameters:
 *        - in: body
 *          name: accounts
 *          description: Create user/account
 *          schema:
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
 *     parameters:
 *        - in: body
 *          name: accounts
 *          description: Login
 *          schema:
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
router.post('/login', authController.login);

/* GET users listing. */
/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Users Listing
 *     description:  It can be use to get the active users listing.
 *     tags: [Account]          
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
router.get('/accounts', jwtauth.jwtCheck, userController.getUsers);

/* update users . */
/**
 * @swagger
 * /accounts:
 *   put:
 *     summary: Update User
 *     description:  It Can be used to update user/account.
 *     tags: [Account]
 *     parameters:
 *        - in: body
 *          name: accounts
 *          description: Update user/account
 *          schema:
 *              type: object
 *              required:
 *                  - id
 *                  - name
 *                  - email
 *                  - role
 *                  - websites
 *                  - status
 *              properties:
 *                  id:
 *                      type: integer
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
router.put('/accounts', jwtauth.jwtCheck, userController.updateUser);

/* delete users . */
/* POST create user. */
/**
 * @swagger
 * /accounts:
 *   delete:
 *     summary: Account Delete
 *     description:  It Can be used to delete the user
 *     tags: [Account]
 *     parameters:
 *        - in: body
 *          name: accounts
 *          description: Delete Account
 *          schema:
 *              type: object
 *              required:
 *                  - id
 *              properties:
 *                  id:
 *                      type: integer
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
router.delete('/accounts', jwtauth.jwtCheck, userController.deleteUser);



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
 *     parameters:
 *        - in: body
 *          name: websites
 *          description: Create website
 *          schema:
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
router.post('/websites', jwtauth.jwtCheck, websiteController.create);

/* GET website listing. */
/**
 * @swagger
 * /websites:
 *   get:
 *     summary: List Website
 *     description:  It can be use to list website.
 *     tags: [Website]             
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
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Website'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
*/
router.get('/websites', jwtauth.jwtCheck, websiteController.getAll);

/* update website. */
/**
 * @swagger
 * /websites:
 *   put:
 *     summary: Website Update
 *     description:  It can be use to update website.
 *     tags: [Website]
 *     parameters:
 *        - in: body
 *          name: websites
 *          description: Update website
 *          schema:
 *              type: object
 *              required:
 *                  - id
 *                  - name
 *                  - size
 *                  - domainname
 *                  - status
 *              properties:
 *                  id:
 *                      type: integer
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
 *                   $ref: '#/components/schemas/EmptyResponse'
 *       422:
 *         description: Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
*/
router.put('/websites', jwtauth.jwtCheck, websiteController.update);

/* delete website listing. */
/**
 * @swagger
 * /websites:
 *   delete:
 *     summary: Website Delete
 *     description:  It can be use to delete website.
 *     tags: [Website]
 *     parameters:
 *        - in: body
 *          name: websites
 *          description: Delete website
 *          schema:
 *              type: object
 *              required:
 *                  - id
 *              properties:
 *                  id:
 *                   type: integer
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
router.delete('/websites', jwtauth.jwtCheck, websiteController.deletes);


module.exports = router;