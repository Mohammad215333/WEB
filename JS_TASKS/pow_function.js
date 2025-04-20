function pow(x, n) {
    if (n === 0) {
        return 1;
    }
    
    let result = 1;
    
    for (let i = 0; i < n; i++) {
        result *= x;
    }
    
    return result;
}

console.log(pow(5, 3));
console.log(pow(19, 0));
console.log(pow(6, 4));