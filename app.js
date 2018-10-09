/*
 * @Author: Hobai Riku 
 * @Date: 2017-11-20 15:22:47 
 * @Last Modified by: HobaiRiku
 * @Last Modified time: 2018-10-09 14:13:01
 */

var express = require('express');
var app = express();
var fs = require('fs');
var gm = require('gm');

const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('./key/img.key');
const certificate = fs.readFileSync('./key/img.pem');
const credentials = {
    key: privateKey,
    cert: certificate
};

const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);
let SSLPORT = 4450;
let PORT = 4451;

//load picture
app.get('*', function (req, res, next) {
    try {
        let fileName = req.path.split('/')[req.path.split('/').length - 1];
        let fileType = fileName.split('.')[1];
        let fileMIME = '';
        let MIME_arr = require('./MIME');
        //not a file path ,turn to next matched middleware
        if (!fileName) return next();
        //not a file path ,turn to next matched middleware
        if (!fileType) return next();
        for (let i = 0; i < MIME_arr.length; i++) {
            if (MIME_arr[i].type == fileType.toLowerCase()) {
                fileMIME = MIME_arr[i];
                break;
            }
            //no a usual imgae type ,turn to next
            if (i == MIME_arr.length - 1) return next();
        }
        try {
            let file = fs.readFileSync('./picture' + req.path);
        } catch (error) {
            //file no exit , turn to next
            return next();
        }
        let heigth = req.query.h;
        let width = req.query.w;
        let option = req.query.o;
        let stream = gm('./picture/' + req.path)
            .resize(width, heigth, option)
            .stream(fileType);
        res.set('content-type', fileMIME);
        let responseData = [];
        if (stream) {
            stream.on('data', function (chunk) {
                responseData.push(chunk);
            });
            stream.on('end', function () {
                var finalData = Buffer.concat(responseData);
                res.write(finalData);
                res.end();
            });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//other app
app.use('/', function (req, res, next) {
    // todo
    next();
});

//404 capture
app.use((req, res, next) => {
    var err = new Error('Not Found:' + req.method + ':/' + req.path);
    err.status = 404;
    next(err);
});

//error handle
app.use((err, req, res, next) => {
    res.status(err.status || 209);

    let err_send = {
        message: err.message,
        status: err.status,
        stack: err.stack,
        code: err.code ? err.code : 0,
    };

    res.send(err_send);
});
httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});
httpServer.listen(PORT, function () {
    console.log('HTTP Server is running on: https://localhost:%s', PORT);
});