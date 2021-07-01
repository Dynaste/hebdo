module.exports = (server) => {
    const animalController = require('../controllers/animalController');

    /**
     * @openapi
     * /animals:
     *   get:
     *     tags: [Animals]
     *     description: Welcome to swagger-jsdoc!
     *     responses:
     *       200:
     *         description: Returns all animals.
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals')
        .get(animalController.get_all_animals);
    
    /**
     * @openapi
     * /animals/create:
     *   post:
     *     tags: [Animals]
     *     description: Create a new Animal
     *     responses:
     *       201:
     *         description: Successfully created a new Animal.
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals/create')
        .post(animalController.create_animal);

    /**
     * @openapi
     * /animals/{animalId}:
     *   get:
     *     tags: [Animals]
     *     description: Get a specific item in Animal collection
     *     responses:
     *       200:
     *         description: Returns one animal.
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals/:animalId')
        .get(animalController.get_one_animal);
    
    /**
     * @openapi
     * /animals/{animalId}/update:
     *   put:
     *     tags: [Animals]
     *     description: Update a specific item in Animal collection
     *     responses:
     *       201:
     *         description: Returns all animals.
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals/:animalId/update')
        .put(animalController.update_animal);

    /**
     * @openapi
     * /animals/{animalId}/delete:
     *   delete:
     *     tags: [Animals]
     *     description: Delete a specific item in Animal collection
     *     responses:
     *       204:
     *         description: Returns all animals.
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals/:animalId/delete')
        .delete(animalController.delete_animal);
}