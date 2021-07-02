module.exports = (server) => {
    const userController = require('../controllers/userController');

    /**
     * @openapi
     * /users:
     *   get:
     *     tags: [Users]
     *     summary: Get all users
     *     description: Get all users in the collection
     *     responses:
     *       200:
     *         description: Return all users.
     *       500:
     *         description: Server internal error.
     */
    server.route('/users')
        .get(userController.get_all_users);

    /**
     * @openapi
     * /users/{userId}:
     *   get:
     *     tags: [Users]
     *     summary: Get one user
     *     description: Get only one specific user. 
     *     responses:
     *       200:
     *         description: Return the user.
     *       500:
     *         description: Server internal error.
     */
    server.route('/users/:userId')
        .get(userController.get_one_user);

    /**
     * @openapi
     * /users/{userId}/update:
     *   put:
     *     tags: [Users]
     *     summary: Update an user
     *     description: Update an user.
     *     responses:
     *       201:
     *         description: Return the updated user.
     *       500:
     *         description: Server internal error.
     */
    server.route('/users/:userId/update')
        .put(userController.update_one_user);

    /**
     * @openapi
     * /users/{userId}/delete:
     *   delete:
     *     tags: [Users]
     *     summary: Delete an user
     *     description: Delete an user.
     *     responses:
     *       201:
     *         description: Return the deleted user.
     *       500:
     *         description: Server internal error.
     */
    server.route('/users/:userId/delete')
        .delete(userController.delete_one_user);

    /**
     * @openapi
     * /login:
     *   post:
     *     tags: [Users]
     *     summary: Login user
     *     description: Log-in an user.
     *     responses:
     *       201:
     *         description: Return the token` and the user role. 
     *       500:
     *         description: Server internal error.
     */
    server.route('/login')
        .post(userController.login)

    /**
     * @openapi
     * /users/create:
     *   post:
     *     tags: [Users]
     *     summary: Subscribe an user
     *     description: Subscription for a new user. 
     *     responses:
     *       201:
     *         description: Successfully created a new user.
     *       500:
     *         description: Server internal error.
     */
    server.route('/users/create')
        .post(userController.signup)

    
}