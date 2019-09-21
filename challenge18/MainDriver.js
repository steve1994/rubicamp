import {Jurusan} from "./jurusan.js"
import {Mahasiswa} from "./mahasiswa.js"
import {Dosen} from "./dosen.js"
import {MataKuliah} from "./mata_kuliah.js"
import {Kontrak} from "./kontrak.js"

var readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function printDashedLine() {
    console.log("=================================================================");
}

printDashedLine();
console.log("Welcome to Universitas Pendidikan Indonesia");
console.log("Jl Setiabudhi No.255");
printDashedLine();
rl.question("username:",(answer) => {
    if (answer == 'Steve') {
        printDashedLine();
        rl.question("password:",(answer) => {
            if (answer == 'Steve') {
                console.log('Welcome, Steve. Your access level is: ADMIN')
                function menuUtama() {
                    printDashedLine();
                    console.log("silahkan pilih opsi di bawah ini");
                    console.log("[1] Mahasiswa");
                    console.log("[2] Jurusan");
                    console.log("[3] Dosen");
                    console.log("[4] Mata Kuliah");
                    console.log("[5] Kontrak")
                    console.log("[6] Keluar");
                    printDashedLine();
                    rl.question("masukkan salah satu no. dari opsi diatas:",(answer) => {
                        switch (answer) {
                            case '1':
                                function menuMahasiswa() {
                                    printDashedLine();
                                    console.log("silahkan pilih opsi di bawah ini")
                                    console.log("[1] Daftar Mahasiswa");
                                    console.log("[2] Cari Mahasiswa");
                                    console.log("[3] Tambah Mahasiswa");
                                    console.log("[4] Hapus Mahasiswa");
                                    console.log("[5] Kembali");
                                    printDashedLine();
                                    rl.question("masukkan salah satu no. dari opsi diatas:",(answer) => {
                                        let mahasiswa = new Mahasiswa();
                                        switch(answer) {
                                            case '1':
                                                printDashedLine();
                                                mahasiswa.viewMahasiswa(() => {
                                                    printDashedLine();
                                                    menuMahasiswa();
                                                });
                                                break;
                                            case '2':
                                                printDashedLine();
                                                console.log("student details");
                                                printDashedLine();
                                                rl.question('Masukkan NIM: ',(answer) => {
                                                    let nimMahasiswa = answer;
                                                    mahasiswa.cariMahasiswa(nimMahasiswa,() => {
                                                        printDashedLine();
                                                        menuMahasiswa();
                                                    });
                                                });
                                                break;
                                            case '3':
                                                printDashedLine();
                                                console.log("Lengkapi data di bawah ini:");
                                                rl.question('NIM: ',(answer1) => {
                                                    let nimMahasiswa = answer1;
                                                    rl.question('nama: ',(answer2) => {
                                                        let namaMahasiswa = answer2;
                                                        rl.question('jurusan: ',(answer3) => {
                                                            let jurusanMahasiswa = answer3;
                                                            rl.question('alamat: ',(answer4) => {
                                                                let alamatMahasiswa = answer4;
                                                                rl.question('birthdate: ',(answer5) => {
                                                                    printDashedLine();
                                                                    let birthdateMahasiswa = answer5;
                                                                    mahasiswa.addMahasiswa(nimMahasiswa,namaMahasiswa,alamatMahasiswa,jurusanMahasiswa,birthdateMahasiswa,()=>{
                                                                        printDashedLine();
                                                                        menuMahasiswa();
                                                                    });
                                                                })
                                                            })
                                                        })
                                                    })
                                                });
                                                break;
                                            case '4':
                                                printDashedLine();
                                                rl.question('Masukkan NIM mahasiswa yang akan dihapus:',(answer) => {
                                                    let nimMahasiswa = answer;
                                                    mahasiswa.deleteMahasiswa(nimMahasiswa,()=>{
                                                        printDashedLine();
                                                        menuMahasiswa();
                                                    });
                                                });
                                                break;
                                            default:
                                                menuUtama();
                                                break;
                                        }
                                    });
                                }
                                menuMahasiswa();
                                break;
                            case '2':
                                function menuJurusan() {
                                    printDashedLine();
                                    console.log("silahkan pilih opsi di bawah ini")
                                    console.log("[1] Daftar Jurusan");
                                    console.log("[2] Cari Jurusan");
                                    console.log("[3] Tambah Jurusan");
                                    console.log("[4] Hapus Jurusan");
                                    console.log("[5] Kembali");
                                    printDashedLine();
                                    rl.question("masukkan salah satu no. dari opsi diatas:",(answer) => {
                                        let jurusan = new Jurusan();
                                        switch(answer) {
                                            case '1':
                                                printDashedLine();
                                                jurusan.viewJurusan(()=>{
                                                    printDashedLine();
                                                    menuJurusan();
                                                });
                                                break;
                                            case '2':
                                                printDashedLine();
                                                console.log("Major details");
                                                printDashedLine();
                                                rl.question('Masukkan ID Jurusan:',(answer) => {
                                                    let idJurusan = answer;
                                                    jurusan.cariJurusan(idJurusan,() => {
                                                        printDashedLine();
                                                        menuJurusan();
                                                    });
                                                });
                                                break;
                                            case '3':
                                                printDashedLine();
                                                console.log("Lengkapi data di bawah ini:");
                                                rl.question('Nama Jurusan: ',(answer) => {
                                                    printDashedLine();
                                                    let namaJurusan = answer;
                                                    jurusan.addJurusan(namaJurusan,()=>{
                                                        printDashedLine();
                                                        menuJurusan();
                                                    });
                                                });
                                                break;
                                            case '4':
                                                printDashedLine();
                                                rl.question('Masukkan ID jurusan yang akan dihapus:',(answer) => {
                                                    let idJurusan = answer;
                                                    jurusan.deleteJurusan(idJurusan,()=>{
                                                        printDashedLine();
                                                        menuJurusan();
                                                    });
                                                });
                                                break;
                                            default:
                                                menuUtama();
                                                break;
                                        }
                                    });
                                }
                                menuJurusan();
                                break;
                            case '3':
                                function menuDosen() {
                                    printDashedLine();
                                    console.log("silahkan pilih opsi di bawah ini")
                                    console.log("[1] Daftar Dosen");
                                    console.log("[2] Cari Dosen");
                                    console.log("[3] Tambah Dosen");
                                    console.log("[4] Hapus Dosen");
                                    console.log("[5] Kembali");
                                    printDashedLine();
                                    rl.question("masukkan salah satu no. dari opsi diatas:",(answer)=>{
                                        let dosen = new Dosen();
                                        switch (answer) {
                                            case '1':
                                                printDashedLine();
                                                dosen.viewDosen(() => {
                                                    printDashedLine();
                                                    menuDosen();
                                                });
                                                break;
                                            case '2':
                                                printDashedLine();
                                                console.log("Lecturer details");
                                                printDashedLine();
                                                rl.question('Masukkan ID Dosen:',(answer) => {
                                                    let idDosen = answer;
                                                    dosen.cariDosen(idDosen,() => {
                                                        printDashedLine();
                                                        menuDosen();
                                                    });
                                                });
                                                break;
                                            case '3':
                                                printDashedLine();
                                                console.log("Lengkapi data di bawah ini:");
                                                rl.question('Nama Dosen: ',(answer) => {
                                                    printDashedLine();
                                                    let namaDosen = answer;
                                                    dosen.addDosen(namaDosen,() => {
                                                        printDashedLine();
                                                        menuDosen();
                                                    });
                                                });
                                                break;
                                            case '4':
                                                printDashedLine();
                                                rl.question('Masukkan ID dosen yang akan dihapus:',(answer) => {
                                                    let idDosen = answer;
                                                    dosen.deleteDosen(idDosen,() => {
                                                        printDashedLine();
                                                        menuDosen();
                                                    });
                                                });
                                                break;
                                            default:
                                                menuUtama();
                                                break;
                                        }
                                    });
                                }
                                menuDosen();
                                break;
                            case '4':
                                function menuMataKuliah() {
                                    printDashedLine();
                                    console.log("silahkan pilih opsi di bawah ini")
                                    console.log("[1] Daftar Mata Kuliah");
                                    console.log("[2] Cari Mata Kuliah");
                                    console.log("[3] Tambah Mata Kuliah");
                                    console.log("[4] Hapus Mata Kuliah");
                                    console.log("[5] Kembali");
                                    printDashedLine();
                                    rl.question("masukkan salah satu no. dari opsi diatas:",(answer)=>{
                                        let mataKuliah = new MataKuliah();
                                        switch (answer) {
                                            case '1':
                                                printDashedLine();
                                                mataKuliah.viewMataKuliah(() => {
                                                    printDashedLine();
                                                    menuMataKuliah();
                                                });
                                                break;
                                            case '2':
                                                printDashedLine();
                                                console.log("Course details");
                                                printDashedLine();
                                                rl.question('Masukkan ID Mata Kuliah:',(answer) => {
                                                    let idMataKuliah = answer;
                                                    mataKuliah.cariMataKuliah(idMataKuliah,() => {
                                                        printDashedLine();
                                                        menuMataKuliah();
                                                    });
                                                });
                                                break;
                                            case '3':
                                                printDashedLine();
                                                console.log("Lengkapi data di bawah ini:");
                                                rl.question('Nama Mata Kuliah: ',(answer1) => {
                                                    let namaMataKuliah = answer1;
                                                    rl.question('Jumlah SKS: ',(answer2) => {
                                                        printDashedLine();
                                                        let jumlahSKS = answer2;
                                                        mataKuliah.addMataKuliah(namaMataKuliah,jumlahSKS,() => {
                                                            printDashedLine();
                                                            menuMataKuliah();
                                                        });
                                                    })
                                                });
                                                break;
                                            case '4':
                                                printDashedLine();
                                                rl.question('Masukkan ID mata kuliah yang akan dihapus:',(answer) => {
                                                    let idMataKuliah = answer;
                                                    mataKuliah.deleteMataKuliah(idMataKuliah,() => {
                                                        printDashedLine();
                                                        menuMataKuliah();
                                                    });
                                                });
                                                break;
                                            default:
                                                menuUtama();
                                                break;
                                        }
                                    });
                                }
                                menuMataKuliah();
                                break;
                            case '5':
                                function menuKontrak() {
                                    printDashedLine();
                                    console.log("silahkan pilih opsi di bawah ini")
                                    console.log("[1] Daftar Kontrak");
                                    console.log("[2] Cari Kontrak");
                                    console.log("[3] Tambah Kontrak");
                                    console.log("[4] Hapus Kontrak");
                                    console.log("[5] Kembali");
                                    printDashedLine();
                                    rl.question("masukkan salah satu no. dari opsi diatas:",(answer)=>{
                                        let kontrak = new Kontrak();
                                        switch (answer) {
                                            case '1':
                                                printDashedLine();
                                                kontrak.viewKontrak(() => {
                                                    printDashedLine();
                                                    menuKontrak();
                                                });
                                                break;
                                            case '2':
                                                printDashedLine();
                                                console.log("Contract details");
                                                printDashedLine();
                                                rl.question('Masukkan ID Kontrak:',(answer) => {
                                                    let idKontrak = answer;
                                                    kontrak.cariKontrak(idKontrak,()=>{
                                                        printDashedLine();
                                                        menuKontrak();
                                                    });
                                                });
                                                break;
                                            case '3':
                                                printDashedLine();
                                                console.log("Lengkapi data di bawah ini:");
                                                rl.question('NIM mahasiswa: ',(answer1) => {
                                                    let nimMahasiswa = answer1;
                                                    rl.question('ID mata kuliah: ',(answer2) => {
                                                        let idMataKuliah = answer2;
                                                        rl.question('ID pengajar: ',(answer3) => {
                                                            let idPengajar = answer3;
                                                            rl.question('Nilai: ',(answer4) => {
                                                                let nilai = answer4;
                                                                printDashedLine();
                                                                kontrak.addKontrak(nimMahasiswa,idMataKuliah,idPengajar,nilai,()=>{
                                                                    printDashedLine();
                                                                    menuKontrak();
                                                                });
                                                            })
                                                        })
                                                    })
                                                });
                                                break;
                                            case '4':
                                                printDashedLine();
                                                rl.question('Masukkan ID kontrak yang akan dihapus:',(answer) => {
                                                    let idKontrak = answer;
                                                    kontrak.deleteKontrak(idKontrak,()=>{
                                                        printDashedLine();
                                                        menuKontrak();
                                                    });
                                                });
                                                break;
                                            default:
                                                menuUtama();
                                                break;
                                        }
                                    });
                                }
                                menuKontrak();
                                break;
                            default:
                                printDashedLine();
                                console.log("kamu telah keluar.");
                                printDashedLine();
                                console.log("Welcome to Universitas Pendidikan Indonesia")
                                console.log("Jl Setiabudhi No.255")
                                printDashedLine();
                                rl.close();
                                break;
                        }
                    })
                }
                menuUtama();
            } else {
                printDashedLine();
                console.log("Maaf, password yang Anda masukkan salah!");
                rl.close();
            }
        })
    } else {
        printDashedLine();
        console.log("Maaf, username yang Anda masukkan salah!");
        rl.close();
    }
});
