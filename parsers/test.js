const fs = require('fs');
const path = require('path');

const obj = JSON.parse(
    fs.readFileSync('../result/heroes.json','utf-8')
)
console.log(obj.length);

for(let i = 0; i <= 118; i++) {
    const result = obj.filter(el => el.id == i)[0]
    console.log(i, result);
}





