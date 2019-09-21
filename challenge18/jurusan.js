const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();

class Jurusan {

    viewJurusan(next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = "SELECT * FROM jurusan";
        this.table = new Table({
            head: ['id','nama jurusan'],
            colWidths: [50,50]
        });
        db.all(sql, [], (err,rows)=>{
            if (err) {
                console.error(err);
            }
            rows.forEach((row) => {
                this.table.push([row.id,row.nama]);
            });
            console.log(this.table.toString());
            next();
        })
        db.close();
    }

    cariJurusan(id_jurusan,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM jurusan WHERE id = ?`;
        db.get(sql, [id_jurusan], (err,row) => {
            try {
                this.table = new Table({
                    head: ['id','nama jurusan'],
                    colWidths: [50,50]
                });
                this.table.push([row.id,row.nama]);
                console.log(this.table.toString());
            } catch (e) {
                console.log(`Jurusan dengan id ` + idJurusan + ` tidak terdaftar`);
            }
            next();
        })
        db.close();
    }

    addJurusan(namaJurusan,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `INSERT INTO jurusan(nama) VALUES (?)`;
        let sql2 = `SELECT * FROM jurusan`;
        db.run(sql,[namaJurusan],(err) => {
            if (err) {
                console.error(err.message);
            }
            this.table = new Table({
                head: ['id','nama jurusan'],
                colWidths: [50,50]
            });
            db.all(sql2, [], (err,rows)=>{
                if (err) {
                    console.error(err);
                }
                rows.forEach((row) => {
                    this.table.push([row.id,row.nama]);
                });
                console.log(this.table.toString());
                next();
            })
            // console.log("A row has been successfully inserted.");
        })
        db.close();
    }

    deleteJurusan(idJurusan,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `DELETE FROM jurusan WHERE id = ?`;
        db.run(sql,idJurusan,(err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Jurusan dengan id ' + idJurusan + ' telah terhapus');
            next();
        });
        db.close();
    }
}


// var jurusan = new Jurusan();
// jurusan.addJurusan("Teknik Geofisika");
//var jurusan2 = new Jurusan();
//jurusan2.viewJurusan();

export {Jurusan};
