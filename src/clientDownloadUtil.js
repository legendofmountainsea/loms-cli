const download = require('download');
const path = require('path');

const fsExtra = require('fs-extra');

function downloadClientAndSDK() {

	return new Promise((resolve, reject) => {
		let downloadPlatform = null;
		switch (process.platform) {
			case 'win32':
				downloadPlatform = 'win';
				break;
			case 'linux':
				downloadPlatform = 'linux';
				break;
			default:
				downloadPlatform = 'osx';
				break;
		}

		const clientName = `nwjs-v0.30.1-${downloadPlatform}-x64`,
			sdkName = `nwjs-sdk-v0.30.1-${downloadPlatform}-x64`,
			fileName = /^linux/.test(downloadPlatform) ? 'tar.gz' : 'zip';

		const downloadURL = `https://dl.nwjs.io/v0.30.1/`;

		const clientDownloadURL = `${downloadURL}${clientName}.${fileName}`,
			sdkDownloadURL = `${downloadURL}${sdkName}.${fileName}`;

		if (fsExtra.existsSync(path.join(process.cwd(), clientName)) && fsExtra.existsSync(path.join(process.cwd(), sdkName))) {
			return resolve();
		}

		Promise.all([
			clientDownloadURL,
			sdkDownloadURL
		].map(x => download(x, path.join(process.cwd()), {
			extract: true,
		}).catch(error => {
			return reject(error);
		}))).then(() => {
			return resolve();
		});
	});
}

exports.downloadClientAndSDK = downloadClientAndSDK;
