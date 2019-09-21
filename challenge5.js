function stringManipulation(word) {
    var vocalLetters = ["a","i","u","e","o"]
    if (vocalLetters.includes(word.toLowerCase().charAt(0))) {
        console.log(word);
    } else {
        var firstLetter = word.toLowerCase().charAt(0);
        console.log(word.substring(1,word.length).concat(firstLetter).concat("nyo"));
    }
}

stringManipulation('ayam');
stringManipulation('bebek');
