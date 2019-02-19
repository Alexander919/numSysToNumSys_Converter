import numSysToNumSys from './app.js';

export const hexNums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const button = document.querySelector('#convert_btn');
const selects = document.querySelectorAll('.nsystems');
const calculationDiv = document.querySelector('.calculation');
const result = document.querySelector('.result');

calculationDiv.addEventListener('scroll', function() {
    const tooltiptext = document.querySelector('.tooltiptext');
    tooltiptext.style.marginLeft = `${calculationDiv.scrollLeft + 310}px`;
});

//Populate both 'selects' with content
document.addEventListener('DOMContentLoaded', function() {

    const populate = select => {
        let html = '';
        for (let i = 2; i <= 36; i++) {
            html += `<option value="${i}">base-${i}</option>`;
        }
        select.insertAdjacentHTML('beforeend', html);
    };
    //Fill both 'selects'
    selects.forEach(select => populate(select));
});
//Click event on the result text
calculationDiv.addEventListener('click', function(e) {
    
    if (e.target.nodeName === 'H1') {
        //Can't copy text directly from H1, need to create textarea or input;
        const textarea = document.createElement('textarea');
        textarea.value = e.target.firstChild.data;
        document.body.appendChild(textarea);
        //select text in the textarea
        textarea.select();
        //copy selection to the clipboard
        document.execCommand('copy');
        document.body.removeChild(textarea);

        document.querySelector('#myTooltip').innerHTML = 'copied!';
    }
});
//Change text in the tooltip back to original
calculationDiv.addEventListener('mouseout', function(e) {
    if (e.target.nodeName === 'H1') {
        document.querySelector('#myTooltip').innerHTML = 'copy';
    }
});
//Convert button click event
button.addEventListener('click', function() {
    //Clear previous calculation results
    clearResults(result);

    //disable button
    button.disabled = true;

    //Need 'setTimeout, 0' for animation to rerun
    setTimeout(() => {
        result.style.display = 'block';
        result.classList.add('show');
    }, 10);

    //Set loading time to 2s
    setTimeout(process, 2000);
});

//Get input values and check them
function process() {

    const values = [document.querySelector('#input'),
    document.querySelector('select[name="from"]'),
    document.querySelector('select[name="to"]')];

    if (checkValues(values)) {
        const [input, from, to] = values;
        const calculation = numSysToNumSys(input.value.toUpperCase(), Number(from.value), Number(to.value));
        displayResult(calculation, 'tooltip');
    } else {
        displayResult('Information missing!', 'red_alert');
    }
}
function checkValues(valuesArr) {
    let flag = true;
    valuesArr.forEach(el => {
        if (el.value == 0 || el.value == '') {
            flag = false;
            blinkInput(el);
        }
    });
    return flag;
}
//if input is empty add 'blink' class
function blinkInput(el) {
    el.classList.add('blink');

    setTimeout(() => {
        el.classList.remove('blink');
    }, 800);
}

export function displayResult(calculation, clss) {
    //'result', 'button' and 'calculationDiv' are defined globally
    document.querySelector('.loading').style.display = 'none';

    if (clss === 'red_alert') {
        buildAndShow(calculation, 'noTooltip');
        
        result.classList.remove('show');
        result.style.display = 'none';
        //*** alternative way to reset animation ***//
        //void result.offsetWidth;
        setTimeout(() => {
            result.classList.add('show', clss);
            result.style.display = 'block';
        }, 10);

        //Hide error message after 3s
        setTimeout(() => {
            result.classList.add('hide');
            button.disabled = false;
        }, 3000);
        
    } else {
        buildAndShow(calculation, clss);
        button.disabled = false;
    }  
}
function buildAndShow(calculation, hover) {

    const html = `
        <div class="${hover}">
            <h1>${calculation}<span class="tooltiptext" id="myTooltip">copy</span></h1>
        </div> `;

    calculationDiv.insertAdjacentHTML('afterbegin', html);
}
//Clear previous results
function clearResults(resultDiv) {
    resultDiv.className = 'container result';
    resultDiv.style.display = 'none';
    document.querySelector('.loading').style.display = 'block';
    document.querySelector('.calculation').innerHTML = '';   
}