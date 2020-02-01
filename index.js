const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();


// Application configuration comes from the environment
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(logger('tiny'));

// TODO: Capture body parser error message and make it nicer
app.use(bodyParser.json());

app.get('/swamphacks/v1/randopando', (req, res) => {
    res.send({
        "message": "beepboop it's a test",
    });
})

app.post('/swamphacks/v1/randopando', (req, res) => {
    console.log(req.body);
    res.json({
        "message": "you posted a thing",
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