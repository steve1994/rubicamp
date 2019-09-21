# ADD DATE COLUMN
ALTER TABLE mahasiswa ADD birthdate datetime;
UPDATE mahasiswa SET birthdate = '2000-01-01 00:00:00' WHERE nim = '13312045';
UPDATE mahasiswa SET birthdate = '1998-01-01 00:00:00' WHERE nim = '13512035';

# QUESTION 1
SELECT nim,mahasiswa.nama,alamat,jurusan.nama FROM mahasiswa INNER JOIN jurusan ON mahasiswa.jurusan = jurusan.id;
# QUESTION 2
SELECT * FROM mahasiswa WHERE (date('now')-birthdate < 20);
# QUESTION 3
SELECT nim, mahasiswa.nama, alamat FROM mahasiswa INNER JOIN kontrak ON mahasiswa.nim = kontrak.mahasiswa WHERE nilai = 'A' OR nilai = 'B';
# QUESTION 4
SELECT nim, mahasiswa.nama, alamat, sum(sks) as total_sks FROM ((mahasiswa INNER JOIN kontrak ON mahasiswa.nim = kontrak.mahasiswa) INNER JOIN mata_kuliah ON mata_kuliah.id = kontrak.mata_kuliah) GROUP BY nim HAVING total_sks > 10;
# QUESTION 5
SELECT nim, mahasiswa.nama, alamat FROM ((mahasiswa INNER JOIN kontrak ON mahasiswa.nim = kontrak.mahasiswa) INNER JOIN mata_kuliah ON mata_kuliah.id = kontrak.mata_kuliah) WHERE mata_kuliah.nama = 'Data Mining';
# QUESTION 6
SELECT dosen.nama,count(distinct mahasiswa.nim) as jumlah_mahasiswa FROM ((dosen INNER JOIN kontrak ON dosen.id = kontrak.pengajar) INNER JOIN mahasiswa ON mahasiswa.nim = kontrak.mahasiswa) GROUP BY dosen.id;
# QUESTION 7
SELECT nim, nama, alamat, (date('now')-birthdate) as umur FROM mahasiswa ORDER BY umur;
# QUESTION 8
SELECT mahasiswa.nim,mahasiswa.nama as nama_mahasiswa,mahasiswa.alamat,mahasiswa.birthdate,jurusan.nama as nama_jurusan,
        dosen.nama as nama_dosen,mata_kuliah.nama as nama_mata_kuliah,mata_kuliah.sks,kontrak.nilai
  FROM ((((mahasiswa INNER JOIN jurusan ON mahasiswa.jurusan = jurusan.id)
          INNER JOIN kontrak ON mahasiswa.nim = kontrak.mahasiswa)
            INNER JOIN dosen ON dosen.id = kontrak.pengajar)
              INNER JOIN mata_kuliah ON mata_kuliah.id = kontrak.mata_kuliah)
  WHERE kontrak.nilai = 'D' or kontrak.nilai = 'E';
