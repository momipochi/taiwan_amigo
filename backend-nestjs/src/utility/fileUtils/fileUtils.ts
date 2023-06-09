import * as fs from 'fs';
import * as path from 'path';

export const readFileContent = (dir: string): string => {
  const data = fs.readFileSync(dir, 'utf-8');
  return data;
};

export const getRootPath = (): string => {
  const splitDir = __dirname.split(path.sep);
  let count = 0;
  for (let i = 0; i < splitDir.length; i++) {
    if (splitDir[i] !== 'backend-nestjs') {
      count++;
    } else {
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
