const fsExtra = require('fs-extra');
const path = require('path');

const childProcessRunNPM = require('./childProcessUtil').childProcessRunNPM;

const nwClientName = /^win/.test(process.platform) ? 'nw.exe' : 'nwjs.app';
const nwClientFolderName = 'nwjs-v0.30.1-osx-x64';

function copyNWClientToDistFolder(nwCilentPath, distPath) {

    fsExtra.emptyDirSync(distPath);
    fsExtra.copySync(path.dirname(nwCilentPath), distPath);
}

function deleteDevDependency(dest) {
    console.log('Deleting development dependency');

    childProcessRunNPM(['prune', '--production'], dest).then((code)=>{
        console.log(`Deleting development dependency finished,
        Build finished!
        Code: ${code}`);
    }).catch(e => {
        console.log(`ERROR: ${e}`);
    });
}

function packageSourceToNWClient(distPath) {

    const rootPath = process.cwd();
    const folders = ['src', 'assets', 'node_modules'],
        files = ['LOMS.png','index.html', 'loms.game.js', 'package.json'];

    let dest = null;

    if (/^win/.test(process.platform)) {
        dest = distPath;
    } else {
        dest = path.join(distPath, nwClientName, 'Contents', 'Resources', 'app.nw');
        fsExtra.ensureDirSync(dest);
    }

    folders.forEach((name) => {
        const srcPath = path.join(rootPath, name);
        const destPath = path.join(dest, name);
        fsExtra.ensureDirSync(destPath);
        fsExtra.copySync(srcPath, destPath);
    });

    files.forEach((name) => {
        const srcPath = path.join(rootPath, name);
        const destPath = path.join(dest, name);
        fsExtra.copySync(srcPath, destPath);
    });

    deleteDevDependency(dest);
}

function distUtil() {
    console.log('Building...');

    const distPath = path.join(process.cwd(), 'dist', 'loms');
    const nwCilentPath = path.join(process.cwd(), nwClientFolderName, nwClientName);

    if (!fsExtra.pathExistsSync(nwCilentPath)) {
        console.log('ERROR: nw.js client not exists, using loms init to download client first!');
        return;
    }

    copyNWClientToDistFolder(nwCilentPath, distPath);
    packageSourceToNWClient(distPath);
}

exports.dist = distUtil;