const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {

    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => {
        await Genre.deleteMany();
        await server.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {

            let genre = new Genre({ genre: 'genre1' });
            await genre.save();
            genre = new Genre({ genre: 'genre2' });
            await genre.save();

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.some(g => g.genre === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.genre === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return specified genres', async () => {
            let genre = new Genre({ genre: 'genre3' });
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id.toHexString());

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('genre', genre.genre);
        });

        it('should return 404 with invalid genre id', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('should return 404 with nonexist genre id', async () => {
            const id = mongoose.Types.ObjectId()
            const res = await request(server).get('/api/genres/'+id);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should return 401 if user is not logged in', async () => {
            const res = await request(server)
                .post('/api/genres')
                .send({ genre: 'genre4' });

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ genre: 'g' });

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            const token = new User().generateAuthToken();
            const name = new Array(52).join('a');
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ genre: name });

            expect(res.status).toBe(400);
        });

        it('should have saved the genre if it is valid', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ genre: 'genre4' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('genre', 'genre4');
        });
    });
});