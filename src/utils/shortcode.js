const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export function generateShortcode(length = 6) {
let code = '';
for (let i = 0; i < length; i++) code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
// append timestamp to reduce collision probability
code += Math.random().toString(36).slice(2, 5);
return code.slice(0, 10);
}


export function isValidShortcode(s) {
return /^[a-zA-Z0-9_-]{3,20}$/.test(s);
}