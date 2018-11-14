const fsExtra = require('fs-extra');
const path = require('path');

const plist = require('plist');
const rcedit = require('rcedit');

const enLprojPlistString = require('./en.lproj.infoPlistString').content;

const childProcessRunNPM = require('./childProcessUtil').childProcessRunNPM;

const nwClientName = /^win/.test(process.platform) ? 'nw.exe' : 'nwjs.app';
const lomsClientName = /^win/.test(process.platform) ? 'LOMS.exe' : 'LOMS.app';
const nwClientFolderName = /^win/.test(process.platform) ?  'nwjs-v0.30.1-win-x64' : 'nwjs-v0.30.1-osx-x64';

function copyNWClientToDistFolder(nwCilentPath, distPath) {

    fsExtra.emptyDirSync(distPath);
    fsExtra.copySync(path.dirname(nwCilentPath), distPath);
}

function deleteDevDependency(dest) {
    return new Promise((resolve, reject) => {
        console.log('Deleting development dependency');

        childProcessRunNPM(['prune', '--production'], dest).then((code)=>{
            console.log(`Deleting development dependency finished, Code: ${code}`);
            return resolve();
        }).catch(e => {
            return reject(e);
        });
    });
}

async function packageSourceToNWClient(distPath) {

    const rootPath = process.cwd();
    const folders = ['src', 'assets', 'nwSystem' , 'node_modules'],
        files = ['index.html', 'loms.game.js', 'package.json'];

    let dest = null;

    if (/^win/.test(process.platform)) {
        dest = path.join(distPath, 'package.nw');
        fsExtra.ensureDirSync(dest);
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

    await deleteDevDependency(dest);
}

async function readPlist(path) {

    return new Promise((resolve, reject) => {
        fsExtra.readFile(path, {
            encoding: 'utf-8',
        }).then((data)=>{
            return resolve(plist.parse(data));
        }).catch(e => {
            return reject(e);
        });
    });
}

async function writePlist(path, content) {
    return await fsExtra.writeFile(path, plist.build(content));
}

async function writeResourceInfo(path, resources) {
    return new Promise((resolve, reject) => {
        rcedit(path, resources, (err) => {
            if(err){
                return reject(`Could not change the resource info, warring:${err}`);
            }

            return resolve();
        });
    });
}

async function addGameInfoInNWClient(distPath){

    const rootPath = process.cwd();
    const version = fsExtra.readJsonSync(path.join(rootPath,'package.json')).version;

    let dest = null;

    if (/^win/.test(process.platform)) {
        const resources = {
            'product-version': version,
            'file-version': version,
            'version-string': {
                ProductName: 'LegendOfMountainSea',
                CompanyName: 'SkyHarp',
                FileDescription: 'LOMS Client Bootstrapper',
                LegalCopyright: 'GPL-2.0',
            },
            'icon': path.join(distPath, 'package.nw', 'assets', 'LOMS.ico'),
        };

        await writeResourceInfo(path.join(distPath, nwClientName), resources);
    } else {
        dest = path.join(distPath, nwClientName, 'Contents');
        const plistPath = path.join(dest,'info.plist');

        const plistContent = await readPlist(plistPath);
        plistContent.CFBundleIdentifier = 'io.skyharp.loms';
        plistContent.CFBundleName = 'LegendOfMountainSea';
        plistContent.CFBundleDisplayName = 'LegendOfMountainSea';
        plistContent.CFBundleIconFile = 'app.nw/assets/LOMS.icns';
        plistContent.CFBundleShortVersionString = version;

        await writePlist(plistPath, plistContent);
        await fsExtra.writeFile(path.join(dest,'Resources','en.lproj','InfoPlist.strings'),enLprojPlistString);
    }

    fsExtra.rename(path.join(distPath,nwClientName),path.join(distPath,lomsClientName));

    console.log('Building release version finished!');
}

async function distUtil() {
    console.log('Building release version begin ...');

    const distPath = path.join(process.cwd(), 'dist', 'loms');
    const nwCilentPath = path.join(process.cwd(), nwClientFolderName, nwClientName);

    if (!fsExtra.pathExistsSync(nwCilentPath)) {
        console.log('ERROR: nw.js client not exists, using loms init to download client first!');
        return;
    }

    copyNWClientToDistFolder(nwCilentPath, distPath);

    try{
        await packageSourceToNWClient(distPath);
        await addGameInfoInNWClient(distPath);
    } catch (e) {
        console.log(`Package source failed: ${e}`);
    }

}

exports.dist = distUtil;