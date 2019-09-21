function stringManipulation(word) {
    var vocalLetters = ["a","i","u","e","o"]
    if (vocalLetters.includes(word.toLowerCase().charAt(0))) {
        return word;
    } else {
        var firstLetter = word.toLowerCase().charAt(0);
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
    console.log(newSentence);
}

sentencesManipulation('ibu pergi ke pasar bersama aku');
