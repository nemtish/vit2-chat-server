function randomString(length) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let str = '';

    for (let i = 0; i < length; i += 1) {
        str += letters[Math.floor(Math.random() * 26)];
    }
    return str;
};

module.exports = {
    randomString
};
