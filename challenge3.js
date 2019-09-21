function num_digits(n) {
    if (n % 10 == n) {
        return 1;
    } else {
        return 1 + num_digits(Math.floor(n/10));
    }
}

function romawi(n) {
    var romanMap = [["","I","II","III","IV","V","VI","VII","VIII","IX"],
                    ["","X","XX","XXX","XL","L","LX","LXX","LXXX","XC"],
                    ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM"],
                    ["","M","MM","MMM","MMMM","MMMMM","MMMMMM","MMMMMMM","MMMMMMMM","MMMMMMMMM"]];
    var numDigits = num_digits(n);
    var convertedDigits = n.toString().split("").reverse();
    var romanResult = "";
    for (var i=0;i<numDigits;i++) {
        romanResult = romanMap[i][parseInt(convertedDigits[i])] + romanResult;
    }
    return romanResult;
}

console.log("Script Testing untuk Konversi Romawi\n");
console.log("input | expected | result");
console.log("------|----------|-------");
console.log("4     |IV        | ", romawi(4));
console.log("9     |IX        | ", romawi(9));
console.log("13    |XIII      | ", romawi(13));
console.log("1453  |MCDLIII   | ", romawi(1453));
console.log("1646  |MDCXLVI   | ", romawi(1646));
