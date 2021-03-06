const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const MongoClient = require('mongodb').MongoClient;

const app = express();


// Application configuration comes from the environment
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'swamphacks';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(logger('tiny'));

// Try to connect to Mongo
const client = new MongoClient(MONGO_URI, {useNewUrlParser: true});

var db;

client.connect()
    .then(() => {
        db = client.db(MONGO_DB);
    })
    .catch((err) => {
        console.log("Could not connect to mongo");
        console.log(err);
        client.close();
        process.exit(1)
    });

// TODO: Capture body parser error message and make it nicer
app.use(bodyParser.json());

app.get('/swamphacks/v1/randopando', (req, res) => {
    db.collection('randopando').find({}).toArray()
        .then((data) => {
            console.log("data is:");
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.json({"message": "merp retrieval error"});
        });
})

app.post('/swamphacks/v1/randopando', (req, res) => {
    console.log(req.body);

    db.collection('randopando').insertOne(req.body)
        .then(() => {
            res.json({
                "message": "you posted a thing",
            });
        })
        .catch((err) => {
            console.log("oops there was an error");
            res.status(500);
            res.json({"message": "merp insertion error"});
        });

    
});

// Set the content type of the response
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Route not found handler
app.use((req, res, next) => {
    const err = new Error(`Method ${req.method} for route ${req.url} Not Found`);
    err.status = 404;
    next(err)
});

// General catchall error response handler
app.use((err, req, res, next) => {
    console.log(err)
    res
        .status(err.status || 500)
        .json({
            message: err.message,
        });
});

const expressServer = app.listen(PORT, () => {
    console.log(`Server api started on port ${PORT}`);
});

function gracefulShutdown(server) {
    console.log("App was killed.");
    console.log("Generally do your graceful shutdown things here");
    // Notice we close the connection!
    client.close();
    server.close(() => {
        console.log("beepboop")
    });
}

process.on("SIGINT", () => {
    gracefulShutdown(expressServer)
});

process.on("SIGTERM", () => {
    gracefulShutdown(expressServer)
});