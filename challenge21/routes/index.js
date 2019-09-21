var express = require('express');
var router = express.Router();
const pg = require('pg');
const pool = new pg.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'admin1234',
    port:'5432'
})

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
    resultConditional[0] = (arrayConditional[0] == 'on') ? `id = $` : ``;
    resultConditional[1] = (arrayConditional[1] == 'on') ? `stringdata = $` : ``;
    resultConditional[2] = (arrayConditional[2] == 'on') ? `integerdata = $` : ``;
    resultConditional[3] = (arrayConditional[3] == 'on') ? `floatdata = $` : ``;
    resultConditional[4] = '';
    resultConditional[5] = (arrayConditional[5] == 'on') ? `booleandata = $` : ``;
    let counter = 1;
    for (let i=0;i<resultConditional.length;i++) {
        if (arrayConditional[i] == 'on') {
            if (i == 4) {
                resultConditional[i] = `(TO_DATE(datedata,'YYYY-MM-DD') >= TO_DATE($${counter},'YYYY-MM-DD')
                                        AND TO_DATE(datedata,'YYYY-MM-DD') <= TO_DATE($${counter+1},'YYYY-MM-DD'))`;
                counter = counter + 2;
            } else {
                resultConditional[i] += counter;
                counter++;
            }
        }
    }
    return [counter,convertResultConditionalToString(resultConditional)];
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

router.get('/', function (req,res) {
    const columnNameParams = [req.query.ID_checkbox,req.query.String_checkbox,req.query.Integer_checkbox,req.query.Float_checkbox,req.query.Date_checkbox,req.query.Boolean_checkbox];
    const columnValueParams = [req.query.id,req.query.String,req.query.Integer,req.query.Float,[req.query.StartDate,req.query.EndDate],req.query.Boolean];

    let conditionalAndCounter = stringConditional(columnNameParams);
    let sql = `SELECT count(*) as total FROM data WHERE ${conditionalAndCounter[1]}`;
    if (conditionalAndCounter[1] == "") {
        sql = `SELECT count(*) as total FROM data`;
    }
    let counter = conditionalAndCounter[0];
    let conditionalValue = valueConditional(columnNameParams,columnValueParams);

    pool.query(sql,conditionalValue,(err,response) => {
        if (err) {
            return console.error(err);
        }

        let url = req.url == '/' ? '/?page=1' : req.url;
        let total = response['rows'][0]['total'];
        let page = req.query.page || 1;
        let limit = 3;
        let totalPage = Math.ceil(total / limit);
        let offSet = limit * (page - 1);

        sql = `SELECT * FROM data WHERE ${conditionalAndCounter[1]} ORDER BY id LIMIT $${counter} OFFSET $${counter+1}`;
        if (conditionalAndCounter[1] == "") {
            sql = `SELECT * FROM data ORDER BY id LIMIT $${counter} OFFSET $${counter+1}`;
        }
        conditionalValue.push(limit);
        conditionalValue.push(offSet);

        pool.query(sql, conditionalValue, (err,response)=>{
            if (err) {
                return console.error(err);
            }
            let rows = [];
            for (let i=0;i<response['rows'].length;i++) {
                rows.push({
                    id : response['rows'][i]['id'],
                    String : response['rows'][i]['stringdata'],
                    Integer : response['rows'][i]['integerdata'],
                    Float : response['rows'][i]['floatdata'],
                    Date : response['rows'][i]['datedata'],
                    Boolean : response['rows'][i]['booleandata']
                });
            }
            res.render("index",{rows,totalPage,page,url});
        })
    })
});

router.get('/add',function(req,res) {
    res.render('add.ejs');
});

router.post('/add',function(req,res) {
    let sql = `INSERT INTO data(stringdata,integerdata,floatdata,datedata,booleandata) values ($1,$2,$3,$4,$5)`;
    pool.query(sql,[req.body.String,req.body.Integer,req.body.Float,req.body.Date,req.body.Boolean],(err,response) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

router.get('/edit/:id',function(req,res) {
    let idData = req.params.id;
    let sql = `SELECT * FROM data WHERE id = $1`;
    pool.query(sql,[idData],(err,response) => {
        if (err) {
            console.error(err);
        }
        row = {};
        row['id'] = response['rows'][0]['id'];
        row['String'] = response['rows'][0]['stringdata'];
        row['Integer'] = response['rows'][0]['integerdata'];
        row['Float'] = response['rows'][0]['floatdata'];
        row['Date'] = response['rows'][0]['datedata'];
        row['Boolean'] = response['rows'][0]['booleandata'];
        res.render("edit",{row});
    });
});

router.post('/edit/:id',function(req,res) {
    let idData = req.params.id;
    let sql = `UPDATE data SET stringdata = $1,integerdata = $2,floatdata = $3,booleandata = $4,datedata = $5 WHERE id = $6`;
    pool.query(sql,[req.body.String,req.body.Integer,req.body.Float,req.body.Boolean,req.body.Date,idData],(err,response) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

router.get('/delete/:id',function(req,res) {
    let idData = req.params.id;
    let sql = `DELETE FROM data WHERE id = $1`;
    pool.query(sql,[idData],(err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

module.exports = router;
