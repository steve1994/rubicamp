const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();

class MataKuliah {

    viewMataKuliah(next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM mata_kuliah`;
        this.table = new Table({
            head: ['id','nama','sks'],
            colWidths: [20,30,20]
        });
        db.all(sql, [], (err,rows)=>{
            if (err) {
                console.error(err);
            }
            for (let i=0;i<rows.length;i++) {
                this.table.push([rows[i].id,rows[i].nama,rows[i].sks]);
            }
            console.log(this.table.toString());
            next();
        })
        db.close();
    }

    cariMataKuliah(idMataKuliah,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM mata_kuliah WHERE id = ?`;
        db.get(sql, [idMataKuliah], (err,row) => {
            try {
                this.table = new Table({
                    head: ['id','nama','sks'],
                    colWidths: [20,30,20]
                });
                this.table.push([row.id,row.nama,row.sks]);
                console.log(this.table.toString());
            } catch (e) {
                console.log(`Mata kuliah dengan id ` + idMataKuliah + ` tidak terdaftar`);
            }
            next();
        })
        db.close();
    }

    addMataKuliah(nama,sks,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `INSERT INTO mata_kuliah(nama,sks) VALUES (?,?)`;
        let sql2 = 'SELECT * FROM mata_kuliah';
        db.run(sql,[nama,sks],(err) => {
            if (err) {
                console.error(err.message);
            }
            // console.log("A row has been successfully inserted.");
            this.table = new Table({
                head: ['id','nama','sks'],
                colWidths: [20,30,20]
            });
            db.all(sql2, [], (err,rows)=>{
                if (err) {
                    console.error(err);
                }
                for (let i=0;i<rows.length;i++) {
                    this.table.push([rows[i].id,rows[i].nama,rows[i].sks]);
                }
                console.log(this.table.toString());
                next();
            })
        })
        db.close();
    }

    deleteMataKuliah(idMataKuliah,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `DELETE FROM mata_kuliah WHERE id = ?`;
        db.run(sql,idMataKuliah,(err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Mata Kuliah dengan id ' + idMataKuliah + ' telah dihapus');
            next();
        });
        db.close();
    }
}

// var mataKuliah = new MataKuliah();
// mataKuliah.deleteMataKuliah(5);
export {MataKuliah};
