module.exports = (server) => {
    const articleController = require('../controllers/articleController');

    server.route('/articles')
        .get(articleController.get_all_articles);
    
    server.route('/articles')
        .post(articleController.create_an_article);


    server.route('/articles/:articleId')
        .get(articleController.get_one_article)
        .put(articleController.update_an_article)
        .delete(articleController.delete_an_article)

}