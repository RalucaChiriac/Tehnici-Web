/**
 * Vectorul de intervale care conține codurile ASCII pentru cifre (0-9), litere mari (A-Z) și litere mici (a-z).
 * @type {Array.<Array.<number>>}
 */
const v_intervale = [[48, 57], [65, 90], [97, 122]];

/**
 * Sirul care conține toate caracterele alfanumerice generate pe baza intervalelor din v_intervale.
 * @type {string}
 */
let sirAlphaNum = "";
for (let interval of v_intervale) {
    for (let i = interval[0]; i <= interval[1]; i++) {
        sirAlphaNum += String.fromCharCode(i);
    }
}

console.log(sirAlphaNum);

/**
 * Generează un token alfanumeric de lungime specificată.
 * 
 * @param {number} n - Lungimea tokenului de generat.
 * @returns {string} Tokenul generat.
 */
function genereazaToken(n) {
    let token = "";
    for (let i = 0; i < n; i++) {
        token += sirAlphaNum[Math.floor(Math.random() * sirAlphaNum.length)];
    }
    return token;
}

module.exports.genereazaToken = genereazaToken;
