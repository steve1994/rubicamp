const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();

class Dosen {

    viewDosen(next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM dosen`;
        this.table = new Table({
            head: ['id','nama'],
            colWidths: [50,100]
        });
        db.all(sql, [], (err,rows)=>{
            if (err) {
                console.error(err);
            }
            for (let i=0;i<rows.length;i++) {
                this.table.push([rows[i].id,rows[i].nama]);
            }
            console.log(this.table.toString());
            next();
        })
        db.close();
    }

    cariDosen(id,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM dosen WHERE id = ?`;
        db.get(sql, [id], (err,row) => {
            try {
                this.table = new Table({
                    head: ['id','nama'],
                    colWidths: [50,100]
                });
                this.table.push([row.id,row.nama]);
                console.log(this.table.toString());
            } catch (e) {
                console.log(`Dosen dengan id ` + id + ` tidak terdaftar`);
            }
            next();
        })
        db.close();
    }

    addDosen(nama,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `INSERT INTO dosen(nama) VALUES (?)`;
        let sql2 = `SELECT * FROM dosen`;
        db.run(sql,[nama],(err) => {
            if (err) {
                console.error(err.message);
            }
            // console.log("A row has been successfully inserted.");
            this.table = new Table({
                head: ['id','nama'],
                colWidths: [50,100]
            });
            db.all(sql2, [], (err,rows)=>{
                if (err) {
                    console.error(err);
                }
                for (let i=0;i<rows.length;i++) {
                    this.table.push([rows[i].id,rows[i].nama]);
                }
                console.log(this.table.toString());
                next();
            })
        })
        db.close();
    }

    deleteDosen(idDosen,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `DELETE FROM dosen WHERE id = ?`;
        db.run(sql,idDosen,(err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Dosen dengan id ' + idDosen + ' telah dihapus');
            next();
        });
        db.close();
    }
}

// var dosen = new Dosen();
//dosen.viewDosen();
// dosen.cariDosen(4);

export {Dosen};
