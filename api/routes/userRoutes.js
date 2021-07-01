module.exports = (server) => {
    const userController = require('../controllers/userController');

    /**
     * @openapi
     * /users:
     *   get:
     *     tags: [Users]
     *     description: Get all users in the collection
     *     responses:
     *       200:
     *         description: Successfully get all users.
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
     *     description: Get only one specific user. 
     *     responses:
     *       200:
     *         description: Successfully get the user.
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
     *     description: Update a user.
     *     responses:
     *       201:
     *         description: Successfully updated the user.
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
     *     description: Delete a user.
     *     responses:
     *       201:
     *         description: Successfully deleted a user.
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
     *     description: Log-in an user.
     *     responses:
     *       201:
     *         description: Successfully logged-in.
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