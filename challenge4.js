function indexPrime(param1) {
    var counter = 1;
    var result = 2;
    var i = 2;

    while ((counter <= param1) && (i <= Number.MAX_VALUE)) {
        var isPrime = true;
        for (var j=2;j<=i;j++) {
            if ((j < i) && (i % j == 0)) {
                isPrime = false;
            }
        }
        if (isPrime) {
            counter++;
            result = i;
        }
        i++;
    }
    return result;
}

console.log(indexPrime(4));
console.log(indexPrime(500));
console.log(indexPrime(37786));
