const articleController = require('../controllers/articleController');
const { verify_token } = require('../middlewares/jwtMiddleware');

module.exports = (server) => {
    server.route('/articles').get(articleController.get_all_articles);

    server.route('/articles/:articleId').get(articleController.get_one_article);

    server
        .route('/articles', verify_token)
        .post(articleController.create_an_article);

    server
        .route('/articles/:articleId', verify_token)
        .put(articleController.update_an_article)
        .delete(articleController.delete_an_article);
};
