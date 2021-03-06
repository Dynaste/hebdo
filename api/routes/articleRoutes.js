const articleController = require('../controllers/articleController');
const { verify_token } = require('../middlewares/jwtMiddleware');

module.exports = (server) => {

    /**
     * @openapi
     * /articles:
     *   get:
     *     tags: [Articles]
     *     summary: Get all articles
     *     description: Get all articles from Article collection.
     *     responses:
     *       200:
     *         description: Return all Articles.
     *       500:
     *         description: Server internal error.
     */
    server.route('/articles').get(articleController.get_all_articles);

    /**
     * @openapi
     * /articles/{articleId}:
     *   get:
     *     tags: [Articles]
     *     summary: Get one animal
     *     description: Get a specific item in Article collection
     *     responses:
     *       200:
     *         description: Return one Article.
     *       500:
     *         description: Server internal error.
     */
    server.route('/articles/:articleId').get(articleController.get_one_article);

    /**
     * @openapi
     * /articles/create:
     *   post:
     *     tags: [Articles]
     *     summary: Create a new article
     *     description: Create a new Article.
     *     responses:
     *       201:
     *         description: Return the new Article.
     *       500:
     *         description: Server internal error.
     */
    server
        // .use('/', (req, res, next) => {
        //     verify_token(req, res, true, next);
        // })
        .route('/articles/create')
        .post(articleController.create_an_article);

    /**
     * @openapi
     * /articles/{articleId}/update:
     *   put:
     *     tags: [Articles]
     *     summary: Update an article
     *     description: Update a specific item in Article collection
     *     responses:
     *       201:
     *         description: Return the updated Article.
     *       500:
     *         description: Server internal error.
     */
    server
        // .use('/', (req, res, next) => {
        //     verify_token(req, res, true, next);
        // })
        .route('/articles/:articleId/update')
        .put(articleController.update_an_article)
    
    /**
     * @openapi
     * /articles/{articleId}/delete:
     *   delete:
     *     tags: [Articles]
     *     summary: Delete an article
     *     description: Delete a specific item in Article collection
     *     responses:
     *       204:
     *         description: Return the deleted article.
     *       500:
     *         description: Server internal error.
     */
    server
        // .use('/', (req, res, next) => {
        //     verify_token(req, res, true, next);
        // })
        .route('/articles/:articleId/delete')
        .delete(articleController.delete_an_article);
};
