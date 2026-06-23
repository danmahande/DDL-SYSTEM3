const fs = require('fs');
const crypto = require('crypto');
const s = crypto.randomBytes(48).toString('hex');
fs.writeFileSync('secret.txt', s);
console.log(s);
