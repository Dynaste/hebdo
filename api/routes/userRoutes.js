module.exports = (server) => {
    const userController = require('../controllers/userController');

    server.route('/users')
        .get(userController.get_all_users);

    server.route('/users/:userId')
        .get(userController.get_one_user);

    server.route('/users/:userId/update')
        .put(userController.update_one_user);

    server.route('/users/:userId/delete')
        .delete(userController.delete_one_user);

    server.route('/login')
        .post(userController.login)

    server.route('/users/create')
        .post(userController.signup)

    
}