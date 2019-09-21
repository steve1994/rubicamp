function spiral(param1) {
    var matrix2D = [];
    var counter = 0;
    for (var i=0;i<param1;i++) {
        matrix2D[i] = [];
        for (var j=0;j<param1;j++) {
            matrix2D[i][j] = counter;
            counter++;
        }
    }
    var idxRowStart = 0;
    var idxColStart = 0;
    var spiralResult = [];
    var numElement = 0;
    var limitColumn = param1;
    var limitRow = param1;
    while (numElement < param1 ** 2) {
        var firstIdxRowStart = idxRowStart;
        var firstIdxColStart = idxColStart;
        while ((idxColStart < limitColumn) && (numElement < param1 ** 2)) {
            spiralResult.push(matrix2D[idxRowStart][idxColStart]);
            idxColStart++;
            numElement++;
        }
        idxColStart--;
        idxRowStart++;
        while ((idxRowStart < limitRow) && (numElement < param1 ** 2)) {
            spiralResult.push(matrix2D[idxRowStart][idxColStart]);
            idxRowStart++;
            numElement++;
        }
        idxRowStart--;
        idxColStart--;
        while ((idxColStart >= firstIdxColStart) && (numElement < param1 ** 2)) {
            spiralResult.push(matrix2D[idxRowStart][idxColStart]);
            idxColStart--;
            numElement++;
        }
        idxColStart++;
        idxRowStart--;
        while ((idxRowStart > firstIdxRowStart) && (numElement < param1 ** 2)) {
            spiralResult.push(matrix2D[idxRowStart][idxColStart]);
            idxRowStart--;
            numElement++;
        }
        idxColStart++;
        idxRowStart++;
        limitColumn--;
        limitRow--;
    }
    console.log(spiralResult);
}

spiral(5);
spiral(6);
spiral(7);
