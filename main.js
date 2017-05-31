var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser');
    mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var mongoUser =  process.env.MONGODB_USER;
    mongoDatabase = process.env.MONGODB_DATABASE;
    mongoPassword = process.env.MONGODB_PASSWORD;
    mongoHost = process.env.TAXCALCDB_SERVICE_HOST;
    mongoPort = process.env.TAXCALCDB_SERVICE_PORT;
    mongoURL = 'mongodb://';

mongoURL += mongoUser + ':' + mongoPassword + '@';
mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

mongoose.connect(mongoURL);

var Transaction = require('./models/transaction');

var route = express.Router();

route.route('/calculate')
     .post(function(req, res) {

        var tx = new Transaction();
        tx.id = req.body.id;
        tx.amount = req.body.amount;
        var finalAmount = tx.amount + (tx.amount * .3);

        tx.save(function(e) {
            if (e)
                res.send(e);

            res.json({ finalAmount: finalAmount });
        });

    });

// All our services are under the /api context
app.use('/api', route);

// Start defining routes for our app/microservice

route.get('/', function(req, res) {
    res.json({
      status: 'up'
    });
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
