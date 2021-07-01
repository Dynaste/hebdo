module.exports = (server) => {
    const donationController = require('../controllers/donationController');

    server.route('/donations')
        .get(donationController.get_all_donations);

    server.route('/donations/give')
        .post(donationController.create_donation);
}