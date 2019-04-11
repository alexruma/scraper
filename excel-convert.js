const excelToJson = require('convert-excel-to-json');

const exportTest="exported"
const result = excelToJson({
    sourceFile: 'book2.xlsx'
});

let test =result.Sheet1[5].F;
let space =/ /gi;
test=test.replace(space,'');



exports.result=result;
exports.exportTest=exportTest
