module.exports = (server) => {
    const animalController = require('../controllers/animalController');

    server.route('/animals')
        .get(animalController.get_all_animals);
    
    server.route('/animals/create')
        .post(animalController.create_animal);

    server.route('/animals/:animalId')
        .get(animalController.get_one_animal);
    
    server.route('/animals/:animalId/update')
        .put(animalController.update_animal);

    server.route('/animals/:animalId/delete')
        .put(animalController.delete_animal);

    server.route('/animals/:animalType')
        .get(animalController.get_all_animals_from_type);

    server.route('/animals/:animalType/:animalId')
        .get(animalController.get_one_animal_from_type);

    server.route('/animals/:animalType/:animalRace')
        .get(animalController.get_all_animals_from_type_by_race);

    server.route('/animals/:animalType/:animalRace/:animalId')
        .get(animalController.get_one_animal_from_type_by_race);
}