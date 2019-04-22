const { Rental } = require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let userAuthToken;
    let movie;

    beforeEach(async () => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        userAuthToken = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'test movie',
            genre: { genre: 'test genre' },
            numberInStock: 9,
            dailyRentalRate: 2
        });
        await movie.save();

        rental = new Rental({
            customer: {
                name: 'customer',
                phone: '1234567890',
                _id: customerId
            },
            movie: {
                _id: movieId,
                title: 'test movie',
                genre: 'test genre',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    })
    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', userAuthToken)
            .send({
                customerId: customerId,
                movieId: movieId
            });
    }

    // Return 401 if client is not logged in
    it('should return 401 if client is not logged in', async () => {
        userAuthToken = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    // Return 400 if customerId is not provided
    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    // Return 400 if movieId is not provided
    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    // Return 404 if not rental found with customerId+movieId
    it('should return 404 if rental is not found with customerId+movieId', async () => {
        customerId = mongoose.Types.ObjectId();
        const res = await exec();
        expect(res.status).toBe(404);
    });
    // Return 400 if rental has already been processed
    it('should return 400 if rental has already been processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });
    // Return 200 if valid request
    it('should return 200 if rental is processed', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    // Set the returned date
    it('should set the return date if input is valid', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
    // Calculate the rental fee
    it('should set the rental fee if input is valid', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(2);
    });
    // Increase the stock
    it('should return increase movie stock if input is valid', async () => {
        const res = await exec();
        const movie = await Movie.findById(movieId);
        expect(movie.numberInStock).toBe(10);
    });
    // Return the rental with all information
    it('should return all details about rental in response', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(res.body).toHaveProperty('dateOut');
        expect(res.body).toHaveProperty('dateReturned');
        expect(res.body).toHaveProperty('customer');
        expect(res.body).toHaveProperty('movie');
        expect(res.body).toHaveProperty('rentalFee');
    });
});
