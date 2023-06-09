"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRootPath = exports.readFileContent = void 0;
const fs = require("fs");
const path = require("path");
const readFileContent = (dir) => {
    const data = fs.readFileSync(dir, 'utf-8');
    return data;
};
exports.readFileContent = readFileContent;
const getRootPath = () => {
    const splitDir = __dirname.split(path.sep);
    let count = 0;
    for (let i = 0; i < splitDir.length; i++) {
        if (splitDir[i] !== 'backend-nestjs') {
            count++;
        }
        else {
            count++;
            break;
        }
    }
    const rootPathArr = splitDir.slice(0, count);
    let res = '';
    for (let i = 0; i < rootPathArr.length; i++) {
        res += `${rootPathArr[i]}/`;
    }
    return res;
};
exports.getRootPath = getRootPath;
//# sourceMappingURL=fileUtils.js.map