var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser');
    mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
      var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
          mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
          mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
          mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
          mongoPassword = process.env[mongoServiceName + '_PASSWORD']
          mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
          mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}

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
