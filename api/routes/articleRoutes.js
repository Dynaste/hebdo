const articleController = require('../controllers/articleController');
const { verify_token } = require('../middlewares/jwtMiddleware');

module.exports = (server) => {
    server.route('/articles').get(articleController.get_all_articles);

    server.route('/articles/:articleId').get(articleController.get_one_article);

    server
        .use('/', verify_token)
        .route('/articles')
        .post(articleController.create_an_article);

    server
        .use('/', verify_token)
        .route('/articles/:articleId')
        .put(articleController.update_an_article)
        .delete(articleController.delete_an_article);
};
