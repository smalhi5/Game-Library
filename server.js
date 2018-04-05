const igdb = require('igdb-api-node');
var express = require('express');
var bodyParser = require('body-parser');
var unirest = require('unirest');
var app = express();

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.set('port', (process.env.PORT || 5000));
app.get('*', function(req, res) {
    res.sendfile('/public/index.html');
});

app.post('/getgames', function(req, res) {
    if(req.body.searchTerm === undefined || "") {
        console.log('Empty String received');
        var errorResponse = "Not Found";
        res.send(errorResponse);
    } else {
        unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/?fields=name,summary,cover&limit=20&offset=0&search=" + req.body.searchTerm)
            .header("X-Mashape-Key", "c2604f4341df19f02c8b176b621d9e2e")
            .header("Accept", "application/json")
            .end(function (result) {
                console.log(result.status, result.body);
                if (result.body.length === 0) {
                    result.body = "Not Found";
                    res.send(result.body);
                } else {
                    res.send(result.body);
                }
            });
    }
});
app.post('/singlegame', function(req, res) {
    console.log(req.body.id);
    unirest.get("https://igdbcom-internet-game-database-v1.p.mashape.com/games/" + req.body.id + "?fields=*")
        .header("X-Mashape-Key", "c2604f4341df19f02c8b176b621d9e2e")
        .header("Accept", "application/json")
        .end(function (result) {
            console.log(result.status, result.body);
            res.send(result.body);
        });
});