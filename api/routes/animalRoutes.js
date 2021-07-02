module.exports = (server) => {
    const animalController = require('../controllers/animalController');

    /**
     * @openapi
     * /animals:
     *   get:
     *     tags: [Animals]
     *     summary: Get all animals
     *     description: Get all animals from Animal Collection.
     *     responses:
     *       200:
     *         description: Returns animals array.
     *         content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals')
        .get(animalController.get_all_animals);

    /**
     * @openapi
     * /animals:
     *   get:
     *     tags: [Animals]
     *     summary: Get all adopted animals
     *     description: Get all adopted animals from Animal Collection.
     *     responses:
     *       200:
     *         description: Returns animals array.
     *         content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                          
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals/adopted')
        .get(animalController.get_adopted_animals);
    
    /**
     * @openapi
     * /animals/create:
     *   post:
     *     tags: [Animals]
     *     summary: Create a new Animal
     *     description: Create a new Animal
     *     responses:
     *       201:
     *         description: Return the new animal.
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
     *     summary: Get one animal
     *     description: Get a specific item in Animal collection.
     *     responses:
     *       200:
     *         description: Returns the animal.
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
     *     summary: Update one animal
     *     description: Update a specific item in Animal collection.
     *     responses:
     *       201:
     *         description: Returns the updated animal.
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals/:animalId/update')
        .put(animalController.update_animal);

    /**
     * @openapi
     * /animals/{animalId}/adopt:
     *   patch:
     *     tags: [Animals]
     *     summary: Adopt an animal
     *     description: Update a specific animal in Animal collection and set an adopter.
     *     responses:
     *       201:
     *         description: Set an adopter to an animal.
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals/:animalId/adopt')
        .patch(animalController.adopt_animal);

    /**
     * @openapi
     * /animals/{animalId}/delete:
     *   delete:
     *     tags: [Animals]
     *     summary: Delete an animal
     *     description: Delete a specific item in Animal collection.
     *     responses:
     *       204:
     *         description: Returns the deleted animal.
     *       500:
     *         description: Server internal error.
     */
    server.route('/animals/:animalId/delete')
        .delete(animalController.delete_animal);
}