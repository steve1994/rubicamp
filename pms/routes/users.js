var express = require('express');
var router = express.Router();
var helper = require('../helper/utils');
var bcrypt = require('bcrypt');
const saltRounds = 10;

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

function stringConditionalUsers(searchFilter) {
    let resultConditional = [];
    resultConditional[0] = (searchFilter[0] == 'on') ? `userid = $` : ``;
    resultConditional[1] = (searchFilter[1] == 'on') ? `fullname = $` : ``;
    resultConditional[2] = (searchFilter[2] == 'on') ? `role = $` : ``;
    resultConditional[3] = (searchFilter[3] == 'on') ? `isfulltime = $` : ``;
    let counter = 1
    for (let i=0;i<resultConditional.length;i++) {
        if (searchFilter[i] == 'on') {
            resultConditional[i] += counter;
            counter++;
        }
    }
    return [counter,convertResultConditionalToString(resultConditional)];
}

function valueConditional(searchFilter,searchFilterValue) {
    let resultFilterValue = [];
    for (let i=0;i<searchFilterValue.length;i++) {
        if (searchFilter[i] == 'on') {
            if (i == 3) {
                resultFilterValue.push((searchFilterValue[i] == 'fulltime') ? true : false);
            } else {
                resultFilterValue.push(searchFilterValue[i]);
            }
        }
    }
    return resultFilterValue;
}

module.exports = (pool) => {

    router.get('/', helper.isLoggedIn, function(req, res) {
        const searchFilter = [req.query.user_id_checkbox,req.query.full_name_checkbox,req.query.position_checkbox,req.query.status_checkbox];
        const searchFilterValue = [req.query.user_id,req.query.full_name,req.query.position,req.query.status];

        let stringConditionAndCounter = stringConditionalUsers(searchFilter);
        let stringCondition = stringConditionAndCounter[1];
        let counter = stringConditionAndCounter[0];
        let valueCondition = valueConditional(searchFilter,searchFilterValue);

        let sql = `SELECT count(*) as total FROM users WHERE ${stringCondition}`;
        if (stringCondition == "") {
            sql = `SELECT count(*) as total FROM users`;
        }
        pool.query(sql, valueCondition, function (err,response) {
            if (err) throw err;

            let url = req.url == '/' ? '/users/?page=1' : '/users' + req.url;
            let total = response.rows[0].total;
            let page = req.query.page || 1;
            let limit = 3;
            let totalPage = Math.ceil(total / limit);
            let offSet = limit * (page - 1);

            sql = `SELECT * FROM users WHERE ${stringCondition} ORDER BY userid LIMIT $${counter} OFFSET $${counter+1}`;
            if (stringCondition == "") {
                sql = `SELECT * FROM users ORDER BY userid LIMIT $${counter} OFFSET $${counter+1}`;
            }
            valueCondition.push(limit);
            valueCondition.push(offSet);

            pool.query(sql, valueCondition, function (err,response) {
                if (err) throw err;

                let usersData = response.rows;
                res.render('users/index',{usersData,totalPage,page,url});
            })
        })
    });

    return router;
}
