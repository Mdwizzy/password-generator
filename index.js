// // DOM Elements
// const passwordEl = document.getElementById('password');
// const lengthEl = document.getElementById('length');
// const uppercaseEl = document.getElementById('uppercase');
// const lowercaseEl = document.getElementById('lowercase');
// const numbersEl = document.getElementById('numbers');
// const symbolsEl = document.getElementById('symbols');
// const generateBtn = document.getElementById('generate');
// const copyBtn = document.getElementById('copy-btn');
//
// // Character generator functions
// function getRandomLower() {
//     return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
// }
//
// function getRandomUpper() {
//     return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
// }
//
// function getRandomNumber() {
//     return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
// }
//
// function getRandomSymbol() {
//     const symbols = '!@#$%^&*(){}[]=<>/,.';
//     return symbols[Math.floor(Math.random() * symbols.length)];
// }
//
// // Generate password event listener
// generateBtn.addEventListener('click', () => {
//     const length = +lengthEl.value;
//     const hasLower = lowercaseEl.checked;
//     const hasUpper = uppercaseEl.checked;
//     const hasNumber = numbersEl.checked;
//     const hasSymbol = symbolsEl.checked;
//
//     passwordEl.value = generatePassword(
//         hasLower,
//         hasUpper,
//         hasNumber,
//         hasSymbol,
//         length
//     );
// });
//
// // Copy password to clipboard
// // Copy password to clipboard - PROPERLY HANDLED VERSION
// copyBtn.addEventListener('click', async () => {
//     const password = passwordEl.value;
//
//     if (!password) {
//         alert('Please generate a password first!');
//         return;
//     }
//
//     try {
//         await navigator.clipboard.writeText(password);
//         alert('Password copied to clipboard!');
//     } catch (err) {
//         console.error('Failed to copy password: ', err);
//         alert('Failed to copy password. Please try again.');
//     }
// });
//
// // Generate password function - FIXED VERSION
// function generatePassword(lower, upper, number, symbol, length) {
//     let generatedPassword = '';
//     const typesArr = [];
//
//     if (lower) typesArr.push('lower');
//     if (upper) typesArr.push('upper');
//     if (number) typesArr.push('number');
//     if (symbol) typesArr.push('symbol');
//
//     // If no types selected, return empty string
//     if (typesArr.length === 0) {
//         return '';
//     }
//
//     // Create password by randomly selecting from available types
//     for (let i = 0; i < length; i++) {
//         const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
//
//         switch (randomType) {
//             case 'lower':
//                 generatedPassword += getRandomLower();
//                 break;
//             case 'upper':
//                 generatedPassword += getRandomUpper();
//                 break;
//             case 'number':
//                 generatedPassword += getRandomNumber();
//                 break;
//             case 'symbol':
//                 generatedPassword += getRandomSymbol();
//                 break;
//         }
//     }
//
//     return generatedPassword;
// }
//


// DOM Elements
const passwordEl = document.getElementById('password');
const lengthEl = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy-btn');
const refreshBtn = document.getElementById('refresh-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const toast = document.getElementById('toast');

// Character sets
const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Initialize
updateLengthValue();
generatePasswordOnLoad();

// Event Listeners
generateBtn.addEventListener('click', generatePassword);
refreshBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);
lengthEl.addEventListener('input', updateLengthValue);

// Generate password on page load
function generatePasswordOnLoad() {
    generatePassword();
}

// Update length value display
function updateLengthValue() {
    lengthValue.textContent = lengthEl.value;
}

// Generate password function
function generatePassword() {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    passwordEl.value = createPassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    updateStrengthIndicator(passwordEl.value);
}

// Create password
function createPassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        return '';
    }

    for (let i = 0; i < length; i++) {
        const typeIndex = Math.floor(Math.random() * typesArr.length);
        const funcName = Object.keys(typesArr[typeIndex])[0];
        generatedPassword += randomFunc[funcName]();
    }

    return generatedPassword;
}

// Copy to clipboard
async function copyToClipboard() {
    const password = passwordEl.value;

    if (!password) {
        showToast('Generate a password first!');
        return;
    }

    try {
        await navigator.clipboard.writeText(password);
        showToast('Password copied!');
    } catch (err) {
        showToast('Failed to copy');
        console.error('Failed to copy: ', err);
    }
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update strength indicator
// Update strength indicator
function updateStrengthIndicator(password) {
    if (!password) {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Strength: ';
        return;
    }

    // Calculate strength (simple version)
    let strength = 0;
    const length = password.length;

    // Length contributes up to 50% of strength
    strength += Math.min(50, (length / 32) * 50);

    // Character variety contributes the rest
    const types = [
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^a-zA-Z0-9]/.test(password)
    ].filter(Boolean).length;

    strength += types * 12.5; // Each type adds 12.5% (max 50%)

    // Update UI
    strengthBar.style.width = `${strength}%`;

    // Color and text based on strength
    if (strength < 30) {
        strengthBar.style.backgroundColor = '#f94144'; // Using hex code instead of var(--danger)
        strengthText.textContent = 'Strength: Weak';
    } else if (strength < 70) {
        strengthBar.style.backgroundColor = '#f8961e'; // Using hex code instead of var(--warning)
        strengthText.textContent = 'Strength: Medium';
    } else {
        strengthBar.style.backgroundColor = '#4cc9f0'; // Using hex code instead of var(--success)
        strengthText.textContent = 'Strength: Strong';
    }
}
// Generator functions
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}