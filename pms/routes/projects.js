var express = require('express');
var router = express.Router();
var helper = require('../helper/utils');

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

function stringConditional(searchFilter) {
    let resultConditional = [];
    resultConditional[0] = (searchFilter[0] == 'on') ? `projectid = $` : ``;
    resultConditional[1] = (searchFilter[1] == 'on') ? `name = $` : ``;
    resultConditional[2] = (searchFilter[2] == 'on') ? `projectid IN (SELECT projectid FROM members WHERE userid=$)` : ``;
    let counter = 1
    for (let i=0;i<resultConditional.length;i++) {
        if (searchFilter[i] == 'on') {
            if (i == 2) {
                let stringReplace = 'userid=$' + counter;
                resultConditional[i] = resultConditional[i].replace('userid=$',stringReplace);
            } else {
                resultConditional[i] += counter;
            }
            counter++;
        }
    }
    return [counter,convertResultConditionalToString(resultConditional)];
}

function stringConditionalMember(searchFilter) {
    let resultConditional = [];
    // "SELECT count(*) as total FROM (members INNER JOIN users ON members.userid = users.userid) WHERE userid=$1 AND role=$2 AND fullname=$3 AND projectid=$4"
    resultConditional[0] = (searchFilter[0]) ? `users.userid = $` : ``;
    resultConditional[1] = (searchFilter[1]) ? `users.fullname = $` : ``;
    resultConditional[2] = (searchFilter[2]) ? `members.role = $` : ``;
    let counter = 1
    for (let i=0;i<resultConditional.length;i++) {
        if (searchFilter[i]) {
            resultConditional[i] += counter;
            counter++;
        }
    }
    resultConditional.push('projectid = $' + counter);
    counter++;
    return [counter,convertResultConditionalToString(resultConditional)];
}

function valueConditional(searchFilter,searchFilterValue) {
    let resultFilterValue = [];
    for (let i=0;i<searchFilterValue.length;i++) {
        if (searchFilter[i] == 'on') {
            resultFilterValue.push(searchFilterValue[i]);
        }
    }
    return resultFilterValue;
}

module.exports = (pool) => {

    router.get('/', helper.isLoggedIn, function(req, res) {
        let searchFilter = [req.query.id_checkbox,req.query.name_checkbox,req.query.member_checkbox];
        let searchFilterValue = [req.query.id,req.query.name,req.query.member];

        let stringCondition = stringConditional(searchFilter)[1];
        let stringConditionValue = valueConditional(searchFilter,searchFilterValue);
        let counterStringCondition = stringConditional(searchFilter)[0];

        let sql = `SELECT count(*) as total FROM projects WHERE ${stringCondition}`;
        if (stringCondition == "") {
            sql = `SELECT count(*) as total FROM projects`;
        }
        pool.query(sql,stringConditionValue,function (err,response) {
            if (err) throw err;

            console.log(req.url);
            let url = req.url == '/' ? '/projects/?page=1' : '/projects' + req.url;
            let total = response.rows[0].total;
            let page = req.query.page || 1;
            let limit = 3;
            let totalPage = Math.ceil(total / limit);
            let offSet = limit * (page - 1);

            sql = 'SELECT projectoptions FROM users WHERE userid=$1';
            pool.query(sql,[req.session.user.userid],function (err,response) {
                let options = response.rows[0].projectoptions == null ? '{}' : response.rows[0].projectoptions;
                options = JSON.parse(options);

                sql = `SELECT * FROM projects WHERE ${stringCondition} ORDER by projectid LIMIT $${counterStringCondition} OFFSET $${counterStringCondition+1}`;
                if (stringCondition == "") {
                    sql = `SELECT * FROM projects ORDER by projectid LIMIT $${counterStringCondition} OFFSET $${counterStringCondition+1}`;
                }
                stringConditionValue.push(limit);
                stringConditionValue.push(offSet);
                pool.query(sql, stringConditionValue, function (err,response) {
                    if (err) throw err;
                    let arrayProjects = []
                    let arrayIDProjects = []
                    let arrayIndexIDProjects = [];
                    for (let i=0;i<response.rows.length;i++) {
                        let project = {};
                        if (options.id_column) project['id'] = response.rows[i].projectid;
                        if (options.name_column) project['name'] = response.rows[i].name;
                        if (options.members_column) project['members'] = [];
                        arrayProjects.push(project);
                        arrayIDProjects.push(response.rows[i].projectid);
                        arrayIndexIDProjects[response.rows[i].projectid] = i;
                    }

                    sql = `SELECT * FROM users`;
                    pool.query(sql, function (err,response) {
                        let users = response.rows;
                        if (options.members_column) {
                            sql = `SELECT * FROM ((members INNER JOIN projects ON members.projectid = projects.projectid) INNER JOIN users ON members.userid = users.userid) WHERE projects.projectid IN (${arrayIDProjects})`;
                            pool.query(sql, function(err,response) {
                                if (response) {
                                    for (let j=0;j<response.rows.length;j++) {
                                        let projectID = response.rows[j].projectid;
                                        let fullName = response.rows[j].fullname;
                                        arrayProjects[arrayIndexIDProjects[projectID]].members.push(fullName);
                                    }
                                }
                                res.render('projects/index',{arrayProjects,options,users,totalPage,page,url});
                            })
                        } else {
                            res.render('projects/index',{arrayProjects,options,users,totalPage,page,url})
                        }
                    })
                })
            })
        })
    });

    router.post('/option', helper.isLoggedIn, function (req,res) {
        let sql = "UPDATE users SET projectoptions=$1 WHERE userid = $2";
        pool.query(sql, [JSON.stringify(req.body),req.session.user.userid], function (err,response) {
            if (err) console.log(err);
            res.redirect('/projects');
        })
    })

    router.get('/add', helper.isLoggedIn, function (req,res) {
        let sql = "SELECT * FROM users";
        pool.query(sql, function (err,response) {
            let users = response.rows;
            res.render('projects/add',{users});
        })
    });

    router.post('/add',helper.isLoggedIn, function (req,res) {
        let sql = "INSERT INTO projects(name) VALUES ($1)";
        pool.query(sql,[req.body.name],function (err,response) {
            if (err) throw err;
            sql = "SELECT * FROM projects WHERE name=$1";
            pool.query(sql,[req.body.name],function (err,response) {
                let idProject = response.rows[0].projectid;
                let arrayKeys = [];
                for (key in req.body) {
                    if (key != 'name') {
                        if (req.body[key] == 'on') {
                            arrayKeys.push(key);
                        }
                    }
                }
                if (arrayKeys.length == 0) {
                    res.redirect('/projects');
                } else {
                    sql = "INSERT INTO members(projectid,userid) VALUES ($1,$2)";
                    for (let i=0;i<arrayKeys.length;i++) {
                        pool.query(sql,[idProject,arrayKeys[i]],function(err,response) {
                            res.redirect('/projects');
                        });
                    }
                }
            })
        })
    })

    router.get('/delete/:id',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.id;
        let sql = `DELETE FROM members WHERE projectid = $1`;
        pool.query(sql,[idProject],function (err,response) {
            if (err) throw err;
            sql = `DELETE FROM projects WHERE projectid = $1`;
            pool.query(sql,[idProject],function (err,response) {
                if (err) throw err;
                res.redirect('/projects');
            })
        })
    })

    router.get('/edit/:id',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.id;
        let sql = `SELECT * FROM projects WHERE projectid=$1`;
        pool.query(sql,[idProject],function (err,response) {
            if (err) throw err;
            let nameProject = response.rows[0].name;
            sql = `SELECT * FROM members WHERE projectid=$1`;
            pool.query(sql,[idProject],function (req,response) {
                let arrayMembersId = [];
                for (let i=0;i<response.rows.length;i++) {
                    arrayMembersId.push(response.rows[i].userid);
                }
                sql = `SELECT * FROM users`;
                pool.query(sql,function (req,response) {
                    let users = response.rows;
                    res.render('projects/edit',{users,arrayMembersId,nameProject,idProject});
                })
            })
        })
    })

    router.post('/edit',helper.isLoggedIn,function (req,res) {
        let idProject = req.body.id;
        let nameProject = req.body.name;
        let sql = "UPDATE projects SET name=$1 WHERE projectid=$2";
        pool.query(sql,[nameProject,idProject],function (err,response) {
            if (err) throw err;
            sql = `DELETE FROM members WHERE projectid=$1`;
            pool.query(sql,[idProject],function (err,response) {
                if (err) throw err;
                let arrayKeys = [];
                for (key in req.body) {
                    if ((key != 'name') && (key != 'id')) {
                        if (req.body[key] == 'on') {
                            arrayKeys.push(key);
                        }
                    }
                }
                if (arrayKeys.length == 0) {
                    res.redirect('/projects');
                } else {
                    sql = "INSERT INTO members(projectid,userid) VALUES ($1,$2)";
                    for (let i=0;i<arrayKeys.length;i++) {
                        pool.query(sql,[idProject,arrayKeys[i]],function(err,response) {
                            res.redirect('/projects');
                        });
                    }
                }
            })
        })
    })

    router.get('/overview/:projectid',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        res.render('projects/overview/index',{idProject});
    })

    router.get('/activity/:projectid',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        res.render('projects/activity/index',{idProject});
    })

    router.get('/issue/:projectid',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        res.render('projects/issue/index',{idProject});
    })

    router.get('/member/:projectid',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        let searchFilter = [req.query.id_checkbox,req.query.name_checkbox,req.query.position_checkbox];
        let searchFilterValue = [req.query.id,req.query.name,req.query.position];

        let stringConditionAndCounter = stringConditionalMember(searchFilter);
        let stringCondition = stringConditionAndCounter[1];
        let counter = stringConditionAndCounter[0];
        let stringConditionValue = valueConditional(searchFilter,searchFilterValue);
        stringConditionValue.push(idProject);
        let sql = `SELECT count(*) as total FROM (members INNER JOIN users ON members.userid = users.userid) WHERE ${stringCondition}`;

        pool.query(sql, stringConditionValue, function (err,response) {
            if (err) throw err;

            let url = req.url == '/' ? '/projects/member/' + idProject + '/?page=1' : '/projects' + req.url;
            let total = response.rows[0].total;
            let page = req.query.page || 1;
            let limit = 3;
            let totalPage = Math.ceil(total / limit);
            let offSet = limit * (page - 1);

            let sql = `SELECT * FROM (members INNER JOIN users ON members.userid = users.userid) WHERE ${stringCondition} ORDER BY users.userid LIMIT $${counter} OFFSET $${counter+1}`;
            stringConditionValue.push(limit);
            stringConditionValue.push(offSet);
            pool.query(sql, stringConditionValue, function (err,response) {
                if (err) throw err;
                let arrayMembers = response.rows;

                sql = `SELECT projectoptions FROM projects WHERE projectid = $1`;
                pool.query(sql, [idProject], function (err,response) {
                    if (err) throw err;
                    let options = response.rows[0].projectoptions == null ? '{}' : response.rows[0].projectoptions;
                    options = JSON.parse(options);
                    res.render('projects/member/index',{idProject,arrayMembers,options,totalPage,page,url});
                })
            })
        })
    })

    router.post('/member/:projectid/option',helper.isLoggedIn,function (req,res) {
        let sql = "UPDATE projects SET projectoptions=$1 WHERE projectid = $2";
        pool.query(sql, [JSON.stringify(req.body),req.params.projectid], function (err,response) {
            if (err) console.log(err);
            res.redirect('/projects/member/' + req.params.projectid);
        })
    })

    router.get('/member/:projectid/edit/:userid',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        let idUser = req.params.userid;
        let sql = `SELECT fullname FROM users WHERE userid=$1`;
        pool.query(sql,[idUser],function (err,response) {
            if (err) throw err;
            let fullname = response.rows[0].fullname;
            sql = `SELECT role FROM members WHERE projectid=$1 AND userid=$2`;
            pool.query(sql,[idProject,idUser],function (err,response) {
                if (err) throw err;
                let role = response.rows[0].role;
                res.render('projects/member/edit',{idProject,idUser,fullname,role});
            })
        })
    })

    router.post('/member/:projectid/edit/:userid',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        let idUser = req.params.userid;
        let sql = 'UPDATE members SET role=$1 WHERE projectid=$2 AND userid=$3';
        pool.query(sql,[req.body.position,idProject,idUser],function (err,response) {
            if (err) throw err;
            res.redirect('/projects/member/' + idProject);
        })
    })

    router.get('/member/:projectid/add',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        let sql = `SELECT userid,fullname FROM users;`
        pool.query(sql, function (err,response) {
            if (err) throw err;
            let usersData = response.rows;
            res.render('projects/member/add',{idProject,usersData});
        })
    })

    router.post('/member/:projectid/add',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        let sql = `SELECT count(*) as total FROM members WHERE projectid=$1 AND userid=$2`;
        pool.query(sql,[idProject,req.body.name],function (err,response) {
            if (err) throw err;
            if (response.rows[0].total > 0) {
                res.redirect('/projects/member/'+idProject);
            } else {
                sql = `INSERT INTO members(userid,projectid,role,"isFullTime") VALUES ($1,$2,$3,$4)`;
                pool.query(sql,[req.body.name,idProject,req.body.position,(req.body.isfulltime ? true : false)],function (err,response) {
                    if (err) throw err;
                    res.redirect('/projects/member/'+idProject);
                })
            }
        })
    })

    router.get('/member/:projectid/delete/:userid',helper.isLoggedIn,function (req,res) {
        let idProject = req.params.projectid;
        let idUser = req.params.userid;
        let sql = 'DELETE FROM members WHERE userid=$1 and projectid=$2';
        pool.query(sql,[idUser,idProject],function (err,response) {
            if (err) throw err;
            res.redirect('/projects/member/' + idProject);
        })
    })

    return router;
}
