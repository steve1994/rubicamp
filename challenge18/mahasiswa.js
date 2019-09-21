const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();

class Mahasiswa {

    viewMahasiswa(next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM mahasiswa`;
        this.table = new Table({
            head: ['nim','nama','alamat','jurusan','birthdate'],
            colWidths: [10,10,20,10,20]
        });
        db.all(sql, [], (err,rows)=>{
            if (err) {
                console.error(err);
            }
            for (let i=0;i<rows.length;i++) {
                this.table.push([rows[i].nim,rows[i].nama,rows[i].alamat,rows[i].jurusan,rows[i].birthdate]);
            }
            console.log(this.table.toString());
            next();
        })
        db.close();
    }

    cariMahasiswa(nim,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `SELECT * FROM mahasiswa WHERE nim = ?`;
        db.get(sql, [nim], (err,row) => {
            try {
                this.table = new Table({
                    head: ['nim','nama','alamat','jurusan','birthdate'],
                    colWidths: [10,10,20,10,20]
                });
                this.table.push([row.nim,row.nama,row.alamat,row.jurusan,row.birthdate]);
                console.log(this.table.toString());
            } catch (e) {
                console.log(`Mahasiswa dengan nim ` + nim + ` tidak terdaftar`);
            }
            next();
        })
        db.close();
    }

    addMahasiswa(nim,nama,alamat,jurusan,birthdate,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `INSERT INTO mahasiswa(nim,nama,alamat,jurusan,birthdate) VALUES (?,?,?,?,?)`;
        let sql2 = `SELECT * FROM mahasiswa`;
        db.run(sql,[nim,nama,alamat,jurusan,birthdate],(err) => {
            if (err) {
                console.error(err.message);
            }
            // console.log("A row has been successfully inserted.");
            this.table = new Table({
                head: ['nim','nama','alamat','jurusan','birthdate'],
                colWidths: [10,10,20,10,20]
            });
            db.all(sql2, [], (err,rows)=>{
                if (err) {
                    console.error(err);
                }
                for (let i=0;i<rows.length;i++) {
                    this.table.push([rows[i].nim,rows[i].nama,rows[i].alamat,rows[i].jurusan,rows[i].birthdate]);
                }
                console.log(this.table.toString());
                next();
            })
        })
        db.close();
    }

    deleteMahasiswa(nim,next) {
        let db = new sqlite3.Database('../challenge14/university.db');
        let sql = `DELETE FROM mahasiswa WHERE nim = ?`;
        db.run(sql,nim,(err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Mahasiswa dengan nim ' + nim + ' telah terhapus');
            next();
        });
        db.close();
    }
}

// var mahasiswa = new Mahasiswa();
// mahasiswa.viewMahasiswa();
// mahasiswa.addMahasiswa('13912911','Ghozali','Riung Bandung',2,'2019-01-01');
// mahasiswa.deleteMahasiswa('13912911');
//mahasiswa.deleteMahasiswa('13512911');
// mahasiswa.cariMahasiswa('13312999');

export {Mahasiswa};
