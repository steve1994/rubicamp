var fs = require('fs');
var rl = require('readline');

function readArrayFromFile() {
    return JSON.parse(fs.readFileSync('challenge13.json','utf8'));
}

function writeArrayIntoFile(matrix2D) {
    fs.writeFileSync("challenge13.json",JSON.stringify(matrix2D));
}

function todoListApp() {
    switch (process.argv[2]) {
        case "list":
            console.log('Daftar Pekerjaan');
            var listTask = readArrayFromFile();
            if (listTask.length > 0) {
                for (let i=0;i<listTask.length;i++) {
                    var checkList = (listTask[i][0]==1) ? "x" : " ";
                    console.log((i+1) + ". [" + checkList + "] " + listTask[i][1]);
                }
            }
            break;
        case "task":
            console.log('Daftar Pekerjaan')
            var listTask = readArrayFromFile();
            var idxTask = parseInt(process.argv[3]);
            var checkList = (listTask[idxTask-1][0]==1) ? "x" : " ";
            if (listTask.length > 0) {
                console.log(idxTask + ". [" + checkList + "] " + listTask[idxTask-1][1]);
            }
            break;
        case "add":
            var sentence = "";
            for (let i=3;i<process.argv.length;i++) {
                sentence += process.argv[i];
                if (i < process.argv.length-1) {
                    sentence += " ";
                }
            }
            var listTask = readArrayFromFile();
            listTask.push([0,sentence,[]]);
            writeArrayIntoFile(listTask);
            console.log("'" + sentence + "' telah ditambahkan.");
            break;
        case "delete":
            var indexDelete = parseInt(process.argv[3]);
            var listTask = readArrayFromFile();
            var deletedSentence = listTask[indexDelete-1][1];
            listTask.splice(indexDelete-1,1);
            writeArrayIntoFile(listTask);
            console.log("'" + deletedSentence + "' telah dihapus dari daftar");
            break;
        case "complete":
            var indexComplete = parseInt(process.argv[3]);
            var listTask = readArrayFromFile();
            listTask[indexComplete-1][0] = 1;
            writeArrayIntoFile(listTask);
            console.log("'" + listTask[indexComplete-1][1] + "' telah selesai");
            break;
        case "uncomplete":
            var indexUncomplete = parseInt(process.argv[3]);
            var listTask = readArrayFromFile();
            listTask[indexUncomplete-1][0] = 0;
            writeArrayIntoFile(listTask);
            console.log("'" + listTask[indexUncomplete-1][1] + "' status selesai dibatalkan.");
            break;
        case "list:outstanding":
            var order = process.argv[3];
            console.log("Daftar Pekerjaan")
            var listTask = readArrayFromFile();
            if (order == 'asc') {
                for (let i=0;i<listTask.length;i++) {
                    var checkList = (listTask[i][0]==1) ? "x" : " ";
                    if (checkList == ' ') {
                        console.log((i+1) + ". [" + checkList + "] " + listTask[i][1]);
                    }
                }
            } else if (order == 'desc') {
                for (let i=listTask.length-1;i>=0;i--) {
                    var checkList = (listTask[i][0]==1) ? "x" : " ";
                    if (checkList == ' ') {
                        console.log((i+1) + ". [" + checkList + "] " + listTask[i][1]);
                    }
                }
            }
            break;
        case "list:completed":
            var order = process.argv[3];
            console.log("Daftar Pekerjaan")
            var listTask = readArrayFromFile();
            if (order == 'asc') {
                for (let i=0;i<listTask.length;i++) {
                    var checkList = (listTask[i][0]==1) ? "x" : " ";
                    if (checkList == 'x') {
                        console.log((i+1) + ". [" + checkList + "] " + listTask[i][1]);
                    }
                }
            } else if (order == 'desc') {
                for (let i=listTask.length-1;i>=0;i--) {
                    var checkList = (listTask[i][0]==1) ? "x" : " ";
                    if (checkList == 'x') {
                        console.log((i+1) + ". [" + checkList + "] " + listTask[i][1]);
                    }
                }
            }
            break;
        case "tag":
            var indexTagged = parseInt(process.argv[3]);
            var sentenceListTags = "";
            var listTask = readArrayFromFile();
            for (let i=4;i<process.argv.length;i++) {
                listTask[indexTagged-1][2].push(process.argv[i])
                sentenceListTags += process.argv[i];
                if (i < process.argv.length-1) {
                    sentenceListTags += ",";
                }
            }
            writeArrayIntoFile(listTask);
            var sentence = listTask[indexTagged-1][1];
            console.log("Tag '" + sentenceListTags + "' telah ditambahkan ke daftar '" + sentence + "'");
            break;
        case "help":
        default:
            if (process.argv[2].includes("filter:")) {
                console.log("Daftar Pekerjaan");
                var keyword = process.argv[2].split(":")[1];
                var listTask = readArrayFromFile();
                for (let i=0;i<listTask.length;i++) {
                    var listTagsThisTask = listTask[i][2];
                    if (listTagsThisTask.includes(keyword)) {
                        var checkList = (listTask[i][0]==1) ? "x" : " ";
                        console.log((i+1) + ". [" + checkList + "] " + listTask[i][1]);
                    }
                }
            } else {
                console.log(">>> JS TODO <<<");
                console.log("$ node todo.js <command>");
                console.log("$ node todo.js list");
                console.log("$ node todo.js task <task_id>");
                console.log("$ node todo.js add <task_content>");
                console.log("$ node todo.js delete <task_id>");
                console.log("$ node todo.js complete <task_id>");
                console.log("$ node todo.js uncomplete <task_id>");
                console.log("$ node todo.js list:outstanding asc|desc");
                console.log("$ node todo.js list:completed asc|desc");
                console.log("$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>");
                console.log("$ node todo.js filter:<tag_name>");
            }
            break;
    }
}

todoListApp();
