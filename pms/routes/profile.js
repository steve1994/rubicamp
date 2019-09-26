var express = require('express');
var router = express.Router();
var helper = require('../helper/utils');
var bcrypt = require('bcrypt');
const saltRounds = 10;

function convertToString(setColumns) {
    let stringConditional = "";
    for (let i=0;i<setColumns.length;i++) {
        stringConditional += setColumns[i];
        if ((i < setColumns.length-1) && (setColumns[i] != "")) {
            stringConditional += ",";
        }
    }
    return stringConditional;
}

function buildUpdateQuery(columnsConditional) {
    let setColumns = [];
    setColumns[0] = (columnsConditional[0] == "") ? '' : 'password = $';
    setColumns[1] = 'firstname = $';
    setColumns[2] = 'lastname = $';
    let counter = 1;
    for (let i=0;i<setColumns.length;i++) {
        if (setColumns[i] != "") {
            setColumns[i] += counter;
            counter++;
        }
    }
    setColumns[3] = 'fullname = $' + counter;
    counter++;
    return [counter,convertToString(setColumns)];
}

function buildUpdateQueryValues(columnsConditional) {
    let valueConditional = [];
    for (let i=0;i<columnsConditional.length;i++) {
        if (columnsConditional[i] != "") {
            valueConditional.push(columnsConditional[i]);
        } else {
            if (i > 0) {
                valueConditional.push("");
            }
        }
    }
    if (columnsConditional[1] != "" && columnsConditional[2] != "") {
        valueConditional.push(columnsConditional[1] + ' ' + columnsConditional[2]);
    } else {
        if (columnsConditional[1] != "") {
            valueConditional.push(columnsConditional[1]);
        }
        if (columnsConditional[2] != "") {
            valueConditional.push(columnsConditional[2]);
        }
    }
    return valueConditional;
}

module.exports = (pool) => {
    router.get('/', helper.isLoggedIn, function(req, res) {
        let email = req.session.user.email;
        let sql = `SELECT userid,firstname,lastname FROM users WHERE email=$1`;
        pool.query(sql,[email],function (err,response) {
            let userid = response.rows[0].userid;
            let firstname = response.rows[0].firstname;
            let lastname = response.rows[0].lastname;
            sql = `SELECT role,"isFullTime" FROM members WHERE userid=$1`;
            pool.query(sql,[userid],function (err,response) {
                let role = response.rows[0].role;
                let isFullTime = response.rows[0].isFullTime;
                res.render('profile/index',{userid,email,firstname,lastname,role,isFullTime});
            })
        })
    });

    router.post('/',helper.isLoggedIn, function(req, res) {
        let boolIsFullTime = (req.body.type == 'on') ? true : false;
        if ((req.body.password == "") && (req.body.firstname == "") && (req.body.lastname == "")) {
            let sql = 'UPDATE members SET role = $1, "isFullTime" = $2 WHERE userid=$3';
            pool.query(sql,[req.body.position,boolIsFullTime,req.body.userid],function (err,response) {
                res.redirect('/profile');
            })
        } else {
            let setColumnsAndCounter = buildUpdateQuery([req.body.password,req.body.firstname,req.body.lastname]);
            let setColumns = setColumnsAndCounter[1];
            let counter = setColumnsAndCounter[0];
            let sql = `UPDATE users SET ${setColumns} WHERE userid=$${counter}`;
            if (req.body.password == "") {
                let params = buildUpdateQueryValues([req.body.password,req.body.firstname,req.body.lastname]);
                params.push(req.body.userid);
                pool.query(sql,params,function (err,response) {
                    sql = 'UPDATE members SET role = $1, "isFullTime" = $2 WHERE userid=$3';
                    pool.query(sql,[req.body.position,boolIsFullTime,req.body.userid],function (err, response) {
                        res.redirect('/profile');
                    })
                })
            } else {
                bcrypt.hash(req.body.password,saltRounds,function (err,hash) {
                    let params = buildUpdateQueryValues([hash,req.body.firstname,req.body.lastname]);
                    params.push(req.body.userid);
                    pool.query(sql,params,function (err,response) {
                        sql = 'UPDATE members SET role = $1, "isFullTime" = $2 WHERE userid=$3';
                        pool.query(sql,[req.body.position,boolIsFullTime,req.body.userid],function (err, response) {
                            res.redirect('/profile');
                        })
                    })
                })
            }
        }

    })
    return router;
}
