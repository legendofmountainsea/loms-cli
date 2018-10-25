const spawn = require('child_process').spawn;
async function childProcessRunNPM(cmd, cwd){
    return new Promise((resolve, reject) => {

        const outputLog = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", cmd, {
            cwd: cwd,
            stdio: 'inherit',
        });

        outputLog.on('message',  (data) => {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(data);
        });

        outputLog.on('error',  (err) => {
            reject(err)
        });
        outputLog.on('close',  (code) =>{
            resolve(code);
        });
    });
}

exports.childProcessRunNPM = childProcessRunNPM;