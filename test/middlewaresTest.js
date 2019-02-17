const {assert} = require('chai');

const express = require('express');
const request = require('supertest');

const middlewares = require('../middlewares');

describe('Rev manifest middleware test', () => {
    let app;
    let server;

    beforeEach(done => {
        app = express();

        app.use(middlewares.revManifest('test/fixtures/manifest.json'));

        app.get('/getAsset', (req, res) => {
            res.status(200).json({
                asset: res.locals.assetPath(req.query.asset)
            });
        });

        server = app.listen(() => {
            done();
        });
    });

    afterEach(done => {
        server.close(() => {
            done();
        });
    });

    it('when asset exists in manifest', done => {
        const successfulResponse = {
            asset: 'app.231d06d29d8554d36153.bundle.js'
        };

        request(app)
            .get('/getAsset?asset=app.js')
            .expect(200)
            .end((error, response) => {
                if (error) throw error;

                assert.deepEqual(response.body, successfulResponse);

                done();
            });
    });

    it('when asset does not exist in manifest', done => {
        const successfulResponse = {
            asset: 'cat.jpg'
        };

        request(app)
            .get('/getAsset?asset=cat.jpg')
            .expect(200)
            .end((error, response) => {
                if (error) throw error;

                assert.deepEqual(response.body, successfulResponse);

                done();
            });
    });

});