function indexBlankNumberDigit(arrayDigits) {
    for (var i=0;i<arrayDigits.length;i++) {
        if (arrayDigits[i] == "#") {
            return i;
        }
    }
    return null;
}

function convertArrayDigitsToNumber(arrayDigits) {
    var numberConverted = "";
    for (var j=0;j<arrayDigits.length;j++) {
        numberConverted += arrayDigits[j];
    }
    return parseInt(numberConverted);
}

function pola(str) {
    var resultStr = str.split("=")[1].trim();
    var operand1Str = str.split("=")[0].split("*")[0].trim();
    var operand2Str = str.split("=")[0].split("*")[1].trim();
    var resultStrArr = resultStr.split("");
    var operand1StrArr = operand1Str.split("");
    var operand2StrArr = operand2Str.split("");
    var idxBlankDigitOperand1 = indexBlankNumberDigit(operand1StrArr);
    var idxBlankDigitResult = indexBlankNumberDigit(resultStrArr);
    for (var i=0;i<=9;i++) {
        for (var j=0;j<=9;j++) {
            operand1StrArr[idxBlankDigitOperand1] = i;
            resultStrArr[idxBlankDigitResult] = j;
            operand1Number = convertArrayDigitsToNumber(operand1StrArr);
            operand2Number = convertArrayDigitsToNumber(operand2StrArr);
            resultNumber = convertArrayDigitsToNumber(resultStrArr);
            if (operand1Number * operand2Number == resultNumber) {
                return new Array(i,j);
            }
        }
    }
    return undefined;
}

console.log(pola("42#3 * 188 = 80#204"));
console.log(pola("8#61 * 895 = 78410#5"));
