let display = document.getElementById('display');
let currentInput = '0';
let longPressTimer;

function appendToDisplay(value) {
    let displayValue = value === '*' ? '×' : value === '/' ? '÷' : value;
    // 如果上一個字符係運算符，替代而唔係追加
    const operators = ['+', '-', '×', '÷'];
    if (operators.includes(currentInput.slice(-1)) && operators.includes(displayValue)) {
        currentInput = currentInput.slice(0, -1) + displayValue;
    } else if (currentInput === '0' && displayValue !== '.') {
        currentInput = displayValue;
    } else {
        currentInput += displayValue;
    }
    display.value = currentInput;
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    display.value = currentInput;
}

function clearAll() {
    currentInput = '0';
    display.value = currentInput;
}

function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-') 
            ? currentInput.slice(1) 
            : '-' + currentInput;
        display.value = currentInput;
    }
}

function percent() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    display.value = currentInput;
}

function calculate() {
    try {
        let expression = currentInput.replace('×', '*').replace('÷', '/');
        currentInput = eval(expression).toString();
        display.value = currentInput;
    } catch (error) {
        display.value = 'Error';
        setTimeout(clearAll, 1000);
    }
}

// 綁定刪除按鈕嘅滑鼠事件
const deleteBtn = document.getElementById('delete-btn');
deleteBtn.addEventListener('click', deleteLast);
deleteBtn.addEventListener('mousedown', () => {
    longPressTimer = setTimeout(() => {
        clearAll();
    }, 500);
});
deleteBtn.addEventListener('mouseup', () => {
    clearTimeout(longPressTimer);
});
deleteBtn.addEventListener('mouseleave', () => {
    clearTimeout(longPressTimer);
});

// 鍵盤控制
document.addEventListener('keydown', (event) => {
    const key = event.key;

    // 數字鍵 (0-9)
    if (/^[0-9]$/.test(key)) {
        appendToDisplay(key);
    }
    // 小數點
    else if (key === '.') {
        appendToDisplay('.');
    }
    // 運算符
    else if (key === '+') {
        appendToDisplay('+');
    }
    else if (key === '-') {
        appendToDisplay('-');
    }
    else if (key === '*' || key === 'x' || key === 'X') { // 加 x/X 映射到 *
        appendToDisplay('*');
    }
    else if (key === '/') {
        appendToDisplay('/');
    }
    // Enter 或 = 鍵計算
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Backspace 刪除最後一個字符
    else if (key === 'Backspace') {
        deleteLast();
    }
    // Esc 清空
    else if (key === 'Escape') {
        clearAll();
    }
    // ± (用 Shift + - 模擬)
    else if (key === '_' || (event.shiftKey && key === '-')) {
        toggleSign();
    }
    // % (用 Shift + 5 模擬)
    else if (key === '%' || (event.shiftKey && key === '5')) {
        percent();
    }

    // 防止瀏覽器預設行為
    if (['Backspace', 'Enter', '='].includes(key)) {
        event.preventDefault();
    }
});