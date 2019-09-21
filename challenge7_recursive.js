function weirdMultiply(sentence) {
    var convertedSentence = sentence.toString();
    if (convertedSentence.length == 1) {
        return convertedSentence;
    } else {
        var arrayDigits = convertedSentence.split("");
        var multiplicationResult = 1;
        for (var i=0;i<arrayDigits.length;i++) {
            multiplicationResult *= parseInt(arrayDigits[i]);
        }
        return weirdMultiply(multiplicationResult);
    }
}

console.log(weirdMultiply(39));
console.log(weirdMultiply(999));
console.log(weirdMultiply(3));
