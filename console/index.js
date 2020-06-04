import {asyncMethods} from '../src/methods';

asyncMethods.sort();

console.log(JSON.stringify(asyncMethods, (k, v) => v, 2));