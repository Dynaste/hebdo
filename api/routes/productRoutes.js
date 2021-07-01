module.exports = (server) => {
    const productController = require('../controllers/productController');

    /**
     * @openapi
     * /products:
     *   get:
     *     tags: [Products]
     *     description: Welcome to swagger-jsdoc!
     *     responses:
     *       200:
     *         description: Returns all products.
     *       500:
     *         description: Server internal error.
     */
    server.route('/products')
        .get(productController.get_all_products);
    
    /**
     * @openapi
     * /products/create:
     *   post:
     *     tags: [Products]
     *     description: Create a new Product
     *     responses:
     *       201:
     *         description: Successfully created a new Product.
     *       500:
     *         description: Server internal error.
     */
    server.route('/products/create')
        .post(productController.create_product);

    /**
     * @openapi
     * /products/{productId}:
     *   get:
     *     tags: [Products]
     *     description: Get a specific item in Product collection
     *     responses:
     *       200:
     *         description: Returns one product.
     *       500:
     *         description: Server internal error.
     */
    server.route('/products/:productId')
        .get(productController.get_one_product);
    
    /**
     * @openapi
     * /products/{productId}/update:
     *   put:
     *     tags: [Products]
     *     description: Update a specific item in Product collection
     *     responses:
     *       201:
     *         description: Updated product.
     *       500:
     *         description: Server internal error.
     */
    server.route('/products/:productId/update')
        .put(productController.update_products);

    /**
     * @openapi
     * /products/{productId}/delete:
     *   delete:
     *     tags: [Products]
     *     description: Delete a specific item in Product collection
     *     responses:
     *       204:
     *         description: Deleted product.
     *       500:
     *         description: Server internal error.
     */
    server.route('/products/:productId/delete')
        .delete(productController.delete_product);
}