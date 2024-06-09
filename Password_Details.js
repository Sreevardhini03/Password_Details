const resultElement = document.getElementById('result');
const lengthElement = document.getElementById('length');
const uppercaseElement = document.getElementById('uppercase');
const lowercaseElement = document.getElementById('lowercase');
const numbersElement = document.getElementById('numbers');
const symbolsElement = document.getElementById('symbols');
const excludeSimilarElement = document.getElementById('exclude-similar');
const excludeAmbiguousElement = document.getElementById('exclude-ambiguous');
const generateButton = document.getElementById('generate');
const clipboardButton = document.getElementById('clipboard');
const strengthMeter = document.getElementById('strength-meter');
const historyList = document.getElementById('history-list');

const similarCharacters = 'il1Lo0O';
const ambiguousCharacters = '{}[]()/\\\'"`~,;:.<>';

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol
};

generateButton.addEventListener('click', () => {
  const length = +lengthElement.value;
  const hasUpper = uppercaseElement.checked;
  const hasLower = lowercaseElement.checked;
  const hasNumber = numbersElement.checked;
  const hasSymbol = symbolsElement.checked;
  const excludeSimilar = excludeSimilarElement.checked;
  const excludeAmbiguous = excludeAmbiguousElement.checked;

  const password = generatePassword(
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    length,
    excludeSimilar,
    excludeAmbiguous
  );

  resultElement.innerText = password;
  addPasswordToHistory(password);
  updateStrengthMeter(password);
});

clipboardButton.addEventListener('click', () => {
  const textarea = document.createElement('textarea');
  const password = resultElement.innerText;

  if (!password) {
    return;
  }

  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  alert('Password copied to clipboard');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    generateButton.click();
  }
});

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

function generatePassword(lower, upper, number, symbol, length, excludeSimilar, excludeAmbiguous) {
  let generatedPassword = '';
  const typesCount = lower + upper + number + symbol;
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    item => Object.values(item)[0]
  );

  if (typesCount === 0) {
    return '';
  }

  while (generatedPassword.length < length) {
    typesArr.forEach(type => {
      const funcName = Object.keys(type)[0];
      let char = randomFunc[funcName]();

      if (excludeSimilar && similarCharacters.includes(char)) {
        return;
      }

      if (excludeAmbiguous && ambiguousCharacters.includes(char)) {
        return;
      }

      generatedPassword += char;
    });
  }

  const finalPassword = generatedPassword.slice(0, length);
  return finalPassword;
}

function updateStrengthMeter(password) {
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = hasLower + hasUpper + hasNumber + hasSymbol;

  strengthMeter.classList.remove('weak', 'medium', 'strong', 'very-strong');

  if (length >= 12 && strength === 4) {
    strengthMeter.classList.add('very-strong');
  } else if (length >= 10 && strength >= 3) {
    strengthMeter.classList.add('strong');
  } else if (length >= 8 && strength >= 2) {
    strengthMeter.classList.add('medium');
  } else {
    strengthMeter.classList.add('weak');
  }
}

function addPasswordToHistory(password) {
  const listItem = document.createElement('li');
  listItem.textContent = password;
  historyList.appendChild(listItem);
}