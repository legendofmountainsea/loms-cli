#!/usr/bin/env node
const spawn = require('child_process').spawn;

const program = require('commander');
const download = require('download');
const path = require('path');
const Spinner = require('cli-spinner').Spinner;

program
	.version('1.1.1')
	.description('LOMS Development CLI');

program
	.command('init')
	.description('Setup project.')
	.action(function () {
		const downloadingStr = new Spinner('download nwjs client to local %s');
		downloadingStr.setSpinnerString(18);
		downloadingStr.start();
		
		let downloadURL = null;
		
		if(/^win/.test(process.platform)){
			downloadURL = 'https://dl.nwjs.io/v0.27.0/nwjs-v0.27.0-win-x64.zip';
		}else {
			downloadURL = 'https://dl.nwjs.io/v0.27.0/nwjs-v0.27.0-osx-x64.zip';
		}
		
		download(downloadURL, path.join(process.cwd()),{ extract: true, headers: { accept: 'application/zip' } } ).then(() => {
			downloadingStr.stop();
			console.log(' download finished!');
			
			const initloadingStr = new Spinner('install project %s');
			initloadingStr.setSpinnerString(18);
			initloadingStr.start();
			
			let outputLog = spawn('npm i');
			
			outputLog.stdout.on('data', function(data) {
				console.log(data);
			});
			
			outputLog.stderr.on('data', function(data) {
				console.log('ERROR: ' + data);
			});
			outputLog.on('close', function(code) {
				initloadingStr.stop();
				console.log('code: ' + code);
				console.log('install finished!');
				console.log('Project is ready for development!');
			});
		}).catch(error => {
			console.log('download error: ' + error);
		});
	});

program
	.command('run-dev')
	.description('debug game with web.')
	.action(function () {
		let outputLog = spawn('npm run dev');
		
		outputLog.stdout.on('data', function(data) {
			console.log(data);
		});
		
		outputLog.stderr.on('data', function(data) {
			console.log('ERROR: ' + data);
		});
		outputLog.on('close', function(code) {
			console.log('code: ' + code);
		});
	});

program
	.command('run-client')
	.description('debug game with nwjs client.')
	.action(function () {
		let platform = null;
		
		if(/^win/.test(process.platform)){
			platform = 'win';
		}else {
			platform = 'mac';
		}
		
		let outputLog = spawn('npm run start-'+ platform);
		
		outputLog.stdout.on('data', function(data) {
			console.log(data);
		});
		
		outputLog.stderr.on('data', function(data) {
			console.log('ERROR: ' + data);
		});
		outputLog.on('close', function(code) {
			console.log('code: ' + code);
		});
	});

program
	.command('run-server')
	.description('debug game server.')
	.action(function () {
		let outputLog = spawn('npm run server');
		
		outputLog.stdout.on('data', function(data) {
			console.log(data);
		});
		
		outputLog.stderr.on('data', function(data) {
			console.log('ERROR: ' + data);
		});
		outputLog.on('close', function(code) {
			console.log('code: ' + code);
		});
	});

program
	.command('dist')
	.description('distribute game.')
	.action(function () {
		let platform = null;
		
		if(/^win/.test(process.platform)){
			platform = 'win';
		}else {
			platform = 'mac';
		}
		
		const distributingStr = new Spinner('distributing %s');
		distributingStr.setSpinnerString(18);
		distributingStr.start();
		
		let outputLog = spawn('npm run build-'+ platform);
		
		outputLog.stdout.on('data', function(data) {
			console.log(data);
		});
		
		outputLog.stderr.on('data', function(data) {
			console.log('ERROR: ' + data);
		});
		outputLog.on('close', function(code) {
			distributingStr.stop();
			console.log('code: ' + code);
			console.log(' distribution finished!');
		});
	});

program.parse(process.argv);
