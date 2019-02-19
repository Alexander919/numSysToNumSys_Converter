import { hexNums, displayResult } from './ndata.js';

const replaceHex = (hex, ns) => {
    try {
        const nsNums = hexNums.slice(0, ns);

        const replaced = nsNums.findIndex(el => el === hex);
        if (replaced === -1) {
            throw new RangeError('Ooopsie, error!');
        }
        return replaced;
    } catch (e) {
        displayResult(e.message, 'red_alert');
        //Haven't found a better solution to stop the script
        //'export' doesn't work inside a function block or try...catch block
        throw 'Error';
    }
};
const numSysToDec = (num, ns) => {
    let dec = 0;
    for (let i = 0; i < num.length; i++) {
        let d = num[num.length - (i + 1)];
        dec += replaceHex(d, ns) * (ns ** i);
    }
    return dec;
}
const replaceNum = num => {
    let hexArr = [];
    for (let n of num) {
        hexArr.push(hexNums.find(el => el === hexNums[n]));
    }
    return hexArr;
};

export default function numSysToNumSys(num, from, to) {
    num = numSysToDec(num, from);

    let maxPower = 0;
    const nsNumber = [];

    for (let i = 0; to ** i <= num; i++) {
        maxPower = i;
    }

    do {
        nsNumber.push(Math.floor(num / (to ** maxPower)));
        num = num % (to ** maxPower);
        maxPower--;

    } while (maxPower >= 0);

    return replaceNum(nsNumber).join('');
}