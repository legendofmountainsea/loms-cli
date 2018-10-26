const download = require('download');
const path = require('path');

function downloadClientAndSDK(){

    return new Promise((resolve, reject) => {
        const downloadPlatform = /^win/.test(process.platform) ? 'win' : 'osx';

        const clientName = `nwjs-v0.30.1-${downloadPlatform}-x64`,
            sdkName = `nwjs-sdk-v0.30.1-${downloadPlatform}-x64`;

        const downloadURL = `https://dl.nwjs.io/v0.30.1/`;

        const clientDownloadURL = `${downloadURL}${clientName}.zip`,
            sdkDownloadURL = `${downloadURL}${sdkName}.zip`;

        Promise.all([
            clientDownloadURL,
            sdkDownloadURL
        ].map(x => download(x, path.join(process.cwd()), {
            extract: true,
            headers: {accept: 'application/zip'}
        }).catch(error => {
            return reject(error);
        }))).then(()=>{
            return resolve();
        });
    });
}

exports.downloadClientAndSDK = downloadClientAndSDK;