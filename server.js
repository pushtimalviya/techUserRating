const express = require("express");
const app = express();
// const bodyParser = require("body-parser")
const PORT = 3000;
const dbCon = require("./dbCon/db");

// app.use(bodyParser);
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', false);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Cache-Control, Content-Type');
    if ('OPTIONS' == req.method) return res.status(200).send();
    next();
});

app.get('/users', function(req, res){

    let orderBy = req.query.orderBy || "asc"

    dbCon.query('SELECT * from users ORDER BY rating '+ orderBy, (err, rows) => {
        if(err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.status(200).send(rows);
        }
    })
})

app.post('/users', function(req, res){
    
    let error = false;

    if(! req.body.name) {
        throw new Error("user name required");
        error = true;
    }

    if(!req.body.rating) {
        req.body.rating = 0;
    }


    if(!error) {

        let userData = {
            "name": req.body.name,
            "rating": req.body.rating
        }

        dbCon.query('INSERT INTO users SET ?', userData, (err, rows) => {
            if(err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                dbCon.query('SELECT * from users ORDER BY rating asc', (err, rows) => {
                    if(err) {
                        console.log(err);
                        res.status(500).send(err);
                    }
                    else {
                        res.status(200).send({data:rows});
                    }
                })
            }
        })
    }
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status( res.status || 500);
    res.send(err)
})

app.listen(PORT,() => {
    console.log("server started on port", PORT);
});