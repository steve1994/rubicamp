const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs');

function convertFromFileToJson(input) {
    return JSON.parse(fs.readFileSync(input,'utf8'));
}

function writeArrayIntoFile(object,input) {
    fs.writeFileSync(input,JSON.stringify(object));
}

function convertDateIntoString(date) {
    let month = date.split('-')[1];
    let day = date.split('-')[2];
    let year = date.split('-')[0];
    let monthName = '';
    switch (month) {
        case '01': monthName = 'Januari'; break;
        case '02': monthName = 'Februari'; break;
        case '03': monthName = 'Maret'; break;
        case '04': monthName = 'April'; break;
        case '05': monthName = 'Mei'; break;
        case '06': monthName = 'Juni'; break;
        case '07': monthName = 'Juli'; break;
        case '08': monthName = 'Agustus'; break;
        case '09': monthName = 'September'; break;
        case '10': monthName = 'Oktober'; break;
        case '11': monthName = 'November'; break;
        case '12': monthName = 'Desember'; break;
    }
    return parseInt(day) + " " + monthName + " " + parseInt(year);
}

function convertStringIntoDate(dateString) {
    let month = dateString.split(" ")[1];
    let year = dateString.split(" ")[2];
    let day = dateString.split(" ")[0];
    let monthDigit = "";
    let dayDigit = "";
    switch (month) {
        case "Januari" : monthDigit = '01'; break;
        case "Februari" : monthDigit = '02'; break;
        case "Maret" : monthDigit = '03'; break;
        case "April" : monthDigit = '04'; break;
        case "Mei" : monthDigit = '05'; break;
        case "Juni" : monthDigit = '06'; break;
        case "Juli" : monthDigit = '07'; break;
        case "Agustus" : monthDigit = '08'; break;
        case "September" : monthDigit = '09'; break;
        case "Oktober" : monthDigit = '10'; break;
        case "November" : monthDigit = '11'; break;
        case "Desember" : monthDigit = '12'; break;
    }
    if (day.length == 1) {
        dayDigit = "0" + day;
    } else {
        dayDigit = day;
    }
    return year + "-" + monthDigit + "-" + dayDigit;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/', function (req,res) {
    let data = convertFromFileToJson('data.json');
    res.render('index.ejs',{data});
});

app.get('/add',function(req,res) {
    res.render('add.ejs');
});

app.post('/add',function(req,res) {
    let arrayData = convertFromFileToJson("data.json");
    let idMax = 0;
    for (let i=0;i<arrayData.length;i++) {
        if (arrayData[i].id > idMax) {
            idMax = arrayData[i].id;
        }
    }
    let id = idMax + 1;
    let string = req.body.String;
    let integer = req.body.Integer;
    let float = req.body.Float;
    let boolean = req.body.Boolean;
    let date = req.body.Date;
    arrayData.push({
        "id": id,
        "String":string,
        "Integer":parseInt(integer),
        "Float":parseFloat(float),
        "Date":convertDateIntoString(date),
        "Boolean":boolean
    });
    writeArrayIntoFile(arrayData,"data.json");
    res.redirect('/');
});

app.get('/edit/:id',function(req,res) {
    let id = req.params.id;
    let arrayData = convertFromFileToJson("data.json");
    dataEdit = {};
    for (let i=0;i<arrayData.length;i++) {
        if (arrayData[i].id == id) {
            dataEdit['id'] = arrayData[i].id;
            dataEdit['String'] = arrayData[i].String;
            dataEdit['Integer'] = arrayData[i].Integer;
            dataEdit['Float'] = arrayData[i].Float;
            dataEdit['Boolean'] = arrayData[i].Boolean;
            dataEdit['Date'] = convertStringIntoDate(arrayData[i].Date);
        }
    }
    res.render('edit.ejs',{dataEdit});
});

app.post('/edit/:id',function(req,res) {
    let id = req.params.id;
    let arrayData = convertFromFileToJson("data.json");
    for (let i=0;i<arrayData.length;i++) {
        if (arrayData[i].id == id) {
            arrayData[i].String = req.body.String;
            arrayData[i].Integer = req.body.Integer;
            arrayData[i].Float = req.body.Float;
            arrayData[i].Boolean = req.body.Boolean;
            arrayData[i].Date = convertDateIntoString(req.body.Date);
        }
    }
    writeArrayIntoFile(arrayData,"data.json");
    res.redirect('/');
});

app.get('/delete/:id',function(req,res) {
    let id = req.params.id;
    let arrayData = convertFromFileToJson("data.json");
    let idxDelete = '';
    for (let i=0;i<arrayData.length;i++) {
        if (arrayData[i].id == id) {
            idxDelete = i;
        }
    }
    arrayData.splice(idxDelete,1);
    writeArrayIntoFile(arrayData,"data.json");
    res.redirect('/');
});

app.listen(port,()=>console.log(`Example app listening on port ${port}!`));
