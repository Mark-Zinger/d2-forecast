var shell = require('shelljs');

function clearParcer() {
    shell.exec('pm2 unstartup systemd');
    shell.exec('shutdown -h now');
}

module.exports = clearParcer;

