var http = require('http')
    , fs   = require('fs')
    , url  = require('url')
    , port = 8080;
var { parse } = require('querystring');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');

db.run('CREATE TABLE IF NOT EXISTS scores(name text, score int)');

var scores = [];


var server = http.createServer (function (req, res) {
    var uri = url.parse(req.url)

    switch( uri.pathname ) {
        case '/':
            sendFile(res, 'index.html')
            break
        case '/index.html':
            sendFile(res, 'index.html')
            break
        case '/style.css':
            sendCSS(res, 'style.css')
            break
        case '/FindKevin.js':
            sendFile(res, 'FindKevin.js')
            break
        case '/scoreboard.html':
            sendFile(res,'scoreboard.html')
            break
        case '/AddScore':
            collectRequestData(req, result => {
                scores.push(result);
                console.log("putting results in database");
                db.serialize(function(){
                    var stmt = db.prepare("INSERT INTO langs VALUES(?,?)")
                    stmt.run(result.playerName, result.finalScore);
                    stmt.finalize();
                    db.each("SELECT name, score FROM langs", function(err,row){
                    })
                })
            });
            break
        case '/GetScores':
            ConvertScores((retVal)=>{
                res.writeHead(200, {'Content-type': 'text/html'});
                res.end(retVal, 'utf-8')})
            break

        default:
            res.end('404 not found')
    }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

// subroutines

function sendFile(res, filename) {
    fs.readFile(filename, function(error, content) {
        res.writeHead(200, {'Content-type': 'text/html'})
        res.end(content, 'utf-8')
    })
}

function sendCSS(res, filename) {
    fs.readFile(filename, function(error, content) {
        res.writeHead(200, {'Content-type': 'text/css'});
        res.end(content, 'utf-8')
    })
}


function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}


function ConvertScores(callback){
    var retVal="";
    db.serialize(function(){
        db.all('SELECT * FROM langs ORDER BY score LIMIT 10', function(err, rows){
            rows.forEach(function (row){
                retVal= retVal + row.name + "    " + row.score + "<br>";
            })
            callback(retVal);
        })
    })
}


