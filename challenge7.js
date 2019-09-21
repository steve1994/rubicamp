function weirdMultiply(sentence) {
    var convertedSentence = sentence.toString();
    while (convertedSentence.length > 1) {
        var arrayDigits = convertedSentence.split("");
        var multiplicationResult = 1;
        for (var i=0;i<arrayDigits.length;i++) {
            multiplicationResult *= parseInt(arrayDigits[i]);
        }
        convertedSentence = multiplicationResult.toString();
    }
    return convertedSentence;
}

console.log(weirdMultiply(39));
console.log(weirdMultiply(999));
console.log(weirdMultiply(3));
