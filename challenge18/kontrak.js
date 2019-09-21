const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();

class Kontrak {

    viewKontrak(next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM kontrak`;
        this.table = new Table({
            head: ['id','mahasiswa','mata_kuliah','pengajar','nilai'],
            colWidths: [10,15,15,15,5]
        });
        db.all(sql, [], (err,rows)=>{
            if (err) {
                console.error(err);
            }
            for (let i=0;i<rows.length;i++) {
                this.table.push([rows[i].id,rows[i].mahasiswa,rows[i].mata_kuliah,rows[i].pengajar,rows[i].nilai]);
            }
            console.log(this.table.toString());
            next();
        })
        db.close();
    }

    cariKontrak(idKontrak,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM kontrak WHERE id = ?`;
        db.get(sql, [idKontrak], (err,row) => {
            try {
                this.table = new Table({
                    head: ['id','mahasiswa','mata_kuliah','pengajar','nilai'],
                    colWidths: [10,15,15,15,5]
                });
                this.table.push([row.id,row.mahasiswa,row.mata_kuliah,row.pengajar,row.nilai]);
                console.log(this.table.toString());
            } catch (e) {
                console.log(`Kontrak dengan id ` + idKontrak + ` tidak terdaftar`);
            }
            next();
        })
        db.close();
    }

    addKontrak(mahasiswa,mata_kuliah,pengajar,nilai,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `INSERT INTO kontrak(mahasiswa,mata_kuliah,pengajar,nilai) VALUES (?,?,?,?)`;
        let sql2 = `SELECT * FROM kontrak`;
        db.run(sql,[mahasiswa,mata_kuliah,pengajar,nilai],(err) => {
            if (err) {
                console.error(err.message);
            }
            // console.log("A row has been successfully inserted.");
            this.table = new Table({
                head: ['id','mahasiswa','mata_kuliah','pengajar','nilai'],
                colWidths: [10,15,15,15,5]
            });
            db.all(sql2, [], (err,rows)=>{
                if (err) {
                    console.error(err);
                }
                for (let i=0;i<rows.length;i++) {
                    this.table.push([rows[i].id,rows[i].mahasiswa,rows[i].mata_kuliah,rows[i].pengajar,rows[i].nilai]);
                }
                console.log(this.table.toString());
                next();
            })
        })
        db.close();
    }

    deleteKontrak(idKontrak,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `DELETE FROM kontrak WHERE id = ?`;
        db.run(sql,idKontrak,(err) => {
            if (err) {
                console.log(err);
            }
            console.log('Kontrak dengan id ' + idKontrak + ' telah dihapus');
            next();
        });
        db.close();
    }
}

// var kontrak = new Kontrak();
// kontrak.deleteKontrak('1000');

export {Kontrak};
