function pluralizeRecords(n) {
    let lastTwoDigits = n % 100;
    let lastDigit = n % 10;

    let word;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        word = 'записей';
    } else if (lastDigit === 1) {
        word = 'запись';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        word = 'записи';
    } else {
        word = 'записей';
    }

    return `В результате выполнения запроса было найдено ${n} ${word}.`;
}

console.log(pluralizeRecords(1));
console.log(pluralizeRecords(2));
console.log(pluralizeRecords(5));
console.log(pluralizeRecords(11));
console.log(pluralizeRecords(21));
console.log(pluralizeRecords(104));