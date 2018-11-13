const spawn = require('child_process').spawn;
const path = require('path');

function runNWGYP(cwd, cmd) {
    return new Promise((resolve, reject) => {

        const outputLog = spawn(/^win/.test(process.platform) ? "nw-gyp.cmd" : "nw-gyp", cmd, {
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

function rebuildNW() {
    return new Promise(async (resolve, reject) => {
        try{
            const levelDownPath = path.join(process.cwd(),'node_modules','leveldown');
            await runNWGYP(levelDownPath,['configure','--target=0.30.1']);
            await runNWGYP(levelDownPath,['rebuild','--target=0.30.1','--arch=x64']);
            return resolve();
        }catch (e) {
           return reject(e);
        }
    });
}

exports.rebuildNW = rebuildNW;