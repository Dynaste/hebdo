module.exports = (server) => {
    const animalController = require('../controllers/animalController');

    /**
     * @openapi
     * /animals:
     *   get:
     *     description: Welcome to swagger-jsdoc!
     *     responses:
     *       200:
     *         description: Returns all animals.
     */
    server.route('/animals')
        .get(animalController.get_all_animals);
    
    /**
     * @openapi
     * /animals/create:
     *   post:
     *     description: Welcome to swagger-jsdoc!
     *     responses:
     *       200:
     *         description: Returns all animals.
     */
    server.route('/animals/create')
        .post(animalController.create_animal);

    /**
     * @openapi
     * /animals/{animalId}:
     *   get:
     *     description: Welcome to swagger-jsdoc!
     *     responses:
     *       200:
     *         description: Returns all animals.
     */
    server.route('/animals/:animalId')
        .get(animalController.get_one_animal);
    
    /**
     * @openapi
     * /animals/{animalId}/update:
     *   put:
     *     description: Welcome to swagger-jsdoc!
     *     responses:
     *       200:
     *         description: Returns all animals.
     */
    server.route('/animals/:animalId/update')
        .put(animalController.update_animal);

    /**
     * @openapi
     * /animals/{animalId}/delete:
     *   delete:
     *     description: Welcome to swagger-jsdoc!
     *     responses:
     *       200:
     *         description: Returns all animals.
     */
    server.route('/animals/:animalId/delete')
        .delete(animalController.delete_animal);
}