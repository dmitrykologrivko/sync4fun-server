module.exports = (app) => {

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/app', (req, res) => {
        res.render('app');
    });

};