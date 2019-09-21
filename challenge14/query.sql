CREATE TABLE jurusan
    (id integer primary key autoincrement,
    nama text not null);
INSERT INTO jurusan(nama) VALUES
    ('Matematika'),('Teknik Informatika');

CREATE TABLE dosen
    (id integer primary key autoincrement,
    nama text not null);
INSERT INTO dosen(nama) VALUES
    ('Bapak Budi'),('Ibu Susi'),('Pak Sartono');

CREATE TABLE mata_kuliah
    (id integer primary key autoincrement,
    nama text not null,
    sks smallint not null);
INSERT INTO mata_kuliah(nama,sks) VALUES
    ('Kalkulus Murni',3),
    ('Statistika',3),
    ('Algoritma dan Struktur Data',4),
    ('Logika Pemrograman',3);

CREATE TABLE mahasiswa
    (nim integer primary key not null,
    nama text not null,
    alamat text not null,
    jurusan integer not null,
    FOREIGN KEY (jurusan) REFERENCES jurusan(id));
INSERT INTO mahasiswa(nim,nama,alamat,jurusan) VALUES
    ('13312045','Santi','Ancol Timur XIV',2),
    ('13512035','Ichwan','Ancol Timur III',1);

CREATE TABLE kontrak
    (id integer primary key autoincrement,
    mahasiswa integer not null,
    mata_kuliah integer not null,
    pengajar integer not null,
    nilai varchar(5),
    FOREIGN KEY (mahasiswa) REFERENCES mahasiswa(nim),
    FOREIGN KEY (mata_kuliah) REFERENCES mata_kuliah(id),
    FOREIGN KEY (pengajar) REFERENCES dosen(id));
INSERT INTO kontrak(mahasiswa,mata_kuliah,pengajar,nilai) VALUES
    (13312045,3,3,'A'),(13312045,4,3,'B'),(13512035,1,2,'C'),(13512035,2,1,'A');
