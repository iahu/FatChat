var crypto = require('crypto')
    ,fs = require('fs');

//加密
function cipher(algorithm, key, buf){
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, key);
    encrypted += cip.update(buf, 'binary', 'hex');
    encrypted += cip.final('hex');

    return encrypted;
}

//解密
function decipher(algorithm, key, encrypted){
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'binary');
    decrypted += decipher.final('binary');

    return decrypted;
}

module.exports = {
    cipher: cipher,
    decipher: decipher
};