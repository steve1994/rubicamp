var fs = require('fs');
var rl = require('readline');

function convertFromFileToJson() {
    return JSON.parse(fs.readFileSync('data.json','utf8'));
}

function gameTebakKata() {
  const readlineInput = rl.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "Tebakan: "
  });

  var parseJsonData = convertFromFileToJson();
  var counterQuestion = 0;
  console.log("Selamat datang di permainan Tebak Kata, silahkan isi dengan jawaban yang benar ya!\n");
  console.log("Pertanyaan: " + parseJsonData[counterQuestion]['definition']);
  readlineInput.prompt();
  readlineInput.on("line", (input) => {
      var trueAnswer;
      if (input.trim() == parseJsonData[counterQuestion]['term']) {
          console.log("Selamat Anda Benar!\n");
          counterQuestion++;
          trueAnswer = true;
      } else {
          console.log("Wkwkwkwk, Anda kurang beruntung!\n");
          readlineInput.prompt();
          trueAnswer = false;
      }
      if (counterQuestion == parseJsonData.length) {
          console.log("\nHore Anda Menang!");
          readlineInput.close();
      } else {
          if (trueAnswer) {
              console.log("Pertanyaan: " + parseJsonData[counterQuestion]['definition']);
              readlineInput.prompt();
          }
      }
  });
}

gameTebakKata();
