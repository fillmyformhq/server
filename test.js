const CryptoJs = require("crypto-js");

const test1 = CryptoJs.AES.encrypt(
	"123456789012123456789012",
	"thisis"
).toString();

let test2 = CryptoJs.AES.decrypt(test1, "thisistestkey");
let test3 = test2.toString(CryptoJs.enc.Utf8);

console.log(test1);
console.log(test3);
