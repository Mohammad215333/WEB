function getSortedArray(array, key) {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {
            if (typeof array[j][key] === 'string') {
                if (compareStrings(array[j][key], array[j + 1][key]) > 0) {
  
                    let temp = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = temp;
                }
            }
            else if (array[j][key] > array[j + 1][key]) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
    return array;
}

function compareStrings(str1, str2) {
    let minLength = Math.min(str1.length, str2.length);
    // Проходим по каждому символу в строках
    for (let i = 0; i < minLength; i++) {
        if (str1[i] < str2[i]) {
            return -1; // str1 меньше str2
        } else if (str1[i] > str2[i]) {
            return 1; // str1 больше str2
        }
    }
    
    if (str1.length < str2.length) {
        return -1; // str1 короче str2
    } else if (str1.length > str2.length) {
        return 1; // str1 длиннее str2
    }
    
    return 0;
}

const objectsArray = [
    { name: "иля", age: 20 },
    { name: "мохамад", age: 32 },
    { name: "юля", age: 29 }
];

const sortedArray = getSortedArray(objectsArray, 'age');
sortedArray.forEach(obj => console.log(obj));
