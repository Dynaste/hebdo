module.exports = (server) => {
    const animalController = require('../controllers/animalController');

    server.route('/animals')
        .get(animalController.get_all_animals);

    server.route('/animals/:animalId')
        .get(animalController.get_one_animal);
}