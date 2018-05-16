module.exports = (app) => {

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/room', (req, res) => {
        res.render('room');
    });

};