function cesar(str, shift, action) {
    const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const alphabetLength = alphabet.length;

    if (action === 'decode') {
        shift = -shift;
    }

    return str.split('').map(char => {
        const lowerChar = char.toLowerCase();
        const isUpperCase = char !== lowerChar;
        const index = alphabet.indexOf(lowerChar);

        // Если символ не найден в алфавите
        if (index === -1) return char;

        let newIndex = (index + shift) % alphabetLength;
        if (newIndex < 0) newIndex += alphabetLength;

    
        const newChar = alphabet[newIndex];
        return isUpperCase ? newChar.toUpperCase() : newChar;
    }).join('');
}

const message = "эзтыхз фзъзъз";
const shift = 8;
const action = "decode";

const decryptedMessage = cesar(message, shift, action);
console.log(decryptedMessage);  


