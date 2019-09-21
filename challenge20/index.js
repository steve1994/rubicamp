const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

function convertResultConditionalToString(resultConditional) {
    let stringResultConditional = "";
    for (let i=0;i<resultConditional.length;i++) {
        if (resultConditional[i] != "") {
            stringResultConditional += resultConditional[i] + " AND ";
        }
    }
    if (stringResultConditional != "") {
        stringResultConditional = stringResultConditional.substring(0,stringResultConditional.length-5);
    }
    return stringResultConditional;
}

function stringConditional(arrayConditional) {
    let resultConditional = [];
    resultConditional[0] = (arrayConditional[0] == 'on') ? `id = ?` : ``;
    resultConditional[1] = (arrayConditional[1] == 'on') ? `String = ?` : ``;
    resultConditional[2] = (arrayConditional[2] == 'on') ? `Integer = ?` : ``;
    resultConditional[3] = (arrayConditional[3] == 'on') ? `Float = ?` : ``;
    resultConditional[4] = (arrayConditional[4] == 'on') ? `(Date >= ? AND Date <= ?)` : ``;
    resultConditional[5] = (arrayConditional[5] == 'on') ? `Boolean = ?` : ``;
    return convertResultConditionalToString(resultConditional);
}

function valueConditional(columnNameParams,columnValueParams) {
    let resultConditionalValue = [];
    for (let i=0;i<columnNameParams.length;i++) {
        if (columnNameParams[i] == 'on') {
            if (i==4) {
                resultConditionalValue.push(columnValueParams[i][0]);
                resultConditionalValue.push(columnValueParams[i][1]);
            } else {
                resultConditionalValue.push(columnValueParams[i]);
            }
        }
    }
    return resultConditionalValue;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/', function (req,res) {
    const columnNameParams = [req.query.ID_checkbox,req.query.String_checkbox,req.query.Integer_checkbox,req.query.Float_checkbox,req.query.Date_checkbox,req.query.Boolean_checkbox];
    const columnValueParams = [req.query.id,req.query.String,req.query.Integer,req.query.Float,[req.query.StartDate,req.query.EndDate],req.query.Boolean];

    console.log(req.url);
    let conditional = stringConditional(columnNameParams);
    let sql = `SELECT count(*) as total FROM data WHERE ${conditional}`;
    if (conditional == "") {
        sql = `SELECT count(*) as total FROM data`;
    }
    let conditionalValue = valueConditional(columnNameParams,columnValueParams);

    db.all(sql,conditionalValue,(err,rows) => {
        let url = req.url == '/' ? '/?page=1' : req.url;
        let total = rows[0].total;
        let page = req.query.page || 1;
        let limit = 3;
        let totalPage = Math.ceil(total / limit);
        let offSet = limit * (page - 1);

        sql = `SELECT * FROM data WHERE ${conditional} LIMIT ? OFFSET ?`;
        if (conditional == "") {
            sql = `SELECT * FROM data LIMIT ? OFFSET ?`;
        }
        conditionalValue.push(limit);
        conditionalValue.push(offSet);

        db.all(sql, conditionalValue, (err,rows)=>{
            if (err) {
                return console.error(err);
            }
            res.render("index",{rows,totalPage,page,url});
        })
    })
});

app.get('/add',function(req,res) {
    res.render('add.ejs');
});

app.post('/add',function(req,res) {
    let sql = `INSERT INTO data(String,Integer,Float,Date,Boolean) values (?,?,?,?,?)`;
    db.run(sql,[req.body.String,req.body.Integer,req.body.Float,req.body.Date,req.body.Boolean],(err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

app.get('/edit/:id',function(req,res) {
    let idData = req.params.id;
    let sql = `SELECT * FROM data WHERE id = ?`;
    db.get(sql,[idData],(err,row) => {
        if (err) {
            console.error(err);
        }
        res.render("edit",{row});
    });
});

app.post('/edit/:id',function(req,res) {
    let idData = req.params.id;
    let sql = `UPDATE data SET String = ?,Integer = ?,Float = ?,Boolean = ?,Date = ? WHERE id = ?`;
    db.run(sql,[req.body.String,req.body.Integer,req.body.Float,req.body.Boolean,req.body.Date,idData],(err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

app.get('/delete/:id',function(req,res) {
    let idData = req.params.id;
    let sql = `DELETE FROM data WHERE id = ?`;
    db.run(sql,[idData],(err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

app.listen(port,()=>console.log(`Example app listening on port ${port}!`));
