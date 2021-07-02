module.exports = (server) => {
    const donationController = require('../controllers/donationController');


    /**
     * @openapi
     * /donations:
     *   get:
     *     tags: [Donations]
     *     summary: Get all donations
     *     description: Get all donations informations.
     *     responses:
     *       200:
     *         description: Returns all donations.
     *       500:
     *         description: Server internal error.
     */
    server.route('/donations')
        .get(donationController.get_all_donations);

    /**
     * @openapi
     * /donations/give:
     *   post:
     *     tags: [Donations]
     *     summary: Send a donation
     *     description: Make a donation for our work
     *     responses:
     *       201:
     *         description: Successfully made a donation.
     *       500:
     *         description: Server internal error.
     */
    server.route('/donations/give')
        .post(donationController.create_donation);
}