var readline = require('readline');

function stringManipulation(word) {
    var vocalLetters = ["a","i","u","e","o"]
    if (vocalLetters.includes(word.toLowerCase().charAt(0))) {
        return word;
    } else {
        var firstLetter = word.toLowerCase().charAt(0);[{"definition": "siapa presiden indonesia?"
        return word.substring(1,word.length).concat(firstLetter).concat("nyo");
    }
}

function sentencesManipulation(sentence) {
    var arrayWords = sentence.split(" ");
    var newSentence = "";
    for (var i=0;i<arrayWords.length;i++) {
        newSentence += stringManipulation(arrayWords[i]);
        if (i < arrayWords.length-1) {
            newSentence += " ";
        }
    }
    return newSentence;
}

function sentencesManipulationReadline() {
    const sentenceInput = readline.createInterface ({
        input: process.stdin,
        output: process.stdout
    });
    var recursiveAsyncReadline = function() {
      sentenceInput.question("tulis kalimatmu disini > ", (answer) => {
          if (answer == "Good bye!") {
              sentenceInput.close();
          } else {
              console.log("hasil konversi: " + sentencesManipulation(answer));
              recursiveAsyncReadline();
          }
      })
    }
    recursiveAsyncReadline();
}

sentencesManipulationReadline();
