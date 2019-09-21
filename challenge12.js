var fs = require('fs');
var rl = require('readline');

function convertFromFileToJson(input) {
    return JSON.parse(fs.readFileSync(input,'utf8'));
}

function gameTebakKata() {
    if (process.argv[2] == undefined) {
        console.log("Tolong sertakan nama file sebagai inputan soalnya");
        console.log("Misalnya 'node solution.js data.json'");
    } else {
        var parseJsonData = convertFromFileToJson(process.argv[2]);
        const readlineInput = rl.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "Jawaban: "
        });
        console.log("Selamat datang di permainan Tebak-tebakan. kamu akan diberikan pertanyaan dari file ini " + process.argv[2]);
        console.log("Untuk bermain, jawablah dengan jawaban yang sesuai.");
        console.log("Gunakan 'skip' untuk menangguhkan pertanyaannya, dan di akhir pertanyaan akan ditanyakan lagi.\n");
        console.log("Pertanyaan: " + parseJsonData[0]['definition']);
        var numFailedAttempt = 0;
        readlineInput.prompt();
        readlineInput.on("line", (input) => {
            if (parseJsonData.length > 0) {
                if (input.trim() == parseJsonData[0]['term']) {
                    parseJsonData.shift();
                    if (parseJsonData.length == 0) {
                        console.log("\nAnda Berhasil!");
                        readlineInput.close();
                    } else {
                        numFailedAttempt = 0;
                        console.log("\nAnda Beruntung!\n");
                        console.log("Pertanyaan: " + parseJsonData[0]['definition']);
                        readlineInput.prompt();
                    }
                } else {
                    if (input.trim() == 'skip') {
                        numFailedAttempt = 0;
                        var recentJsonData = parseJsonData.shift();
                        parseJsonData.push(recentJsonData);
                        console.log("\nPertanyaan: " + parseJsonData[0]['definition']);
                        readlineInput.prompt();
                    } else {
                        numFailedAttempt++;
                        console.log("\nAnda Kurang Beruntung! anda telah salah " + numFailedAttempt + " kali, silahkan coba lagi.");
                        readlineInput.prompt();
                    }

                }
            } else {
                console.log("\nAnda Berhasil!");
                readlineInput.close();
            }
        });
    }
}

gameTebakKata();
