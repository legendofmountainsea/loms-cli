#!/usr/bin/env node
const spawn = require('child_process').spawn;

const program = require('commander');
const download = require('download');
const path = require('path');
const Spinner = require('cli-spinner').Spinner;

program
	.version(require('./package.json').version)
	.option('-v, --version', 'output the version number')
	.description('LOMS Development CLI')
	.parse(process.argv);

program
	.command('init')
	.description('setup project.')
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
			
			let outputLog = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm",['i'],{
				cwd: process.cwd(),
				stdio: 'inherit',
			});
			
			outputLog.on('message', function(data) {
				process.stdout.clearLine();
				process.stdout.cursorTo(0);
				process.stdout.write(data);
				// console.log(data);
			});
			
			outputLog.on('error', function(data) {
				console.log('ERROR: ' + data);
			});
			outputLog.on('close', function(code) {
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
		let outputLog = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm",['run','dev'],{
			cwd: process.cwd(),
			stdio: 'inherit',
		});
		
		outputLog.on('message', function(data) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(data);
		});
		
		outputLog.on('error', function(data) {
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
		
		let outputLog = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm",['run','start-'+ platform],{
			cwd: process.cwd(),
			stdio: 'inherit',
		});
		
		outputLog.on('message', function(data) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(data);
		});
		
		outputLog.on('error', function(data) {
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
		let outputLog = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm",['run','server'],{
			cwd: process.cwd(),
			stdio: 'inherit',
		});
		
		outputLog.on('message', function(data) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(data);
		});
		
		outputLog.on('error', function(data) {
			console.log('ERROR: ' + data);
		});
		outputLog.on('close', function(code) {
			console.log('code: ' + code);
		});
	});

program
	.command('test')
	.description('run game unit tests.')
	.action(function () {
		let outputLog = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm",['test'],{
			cwd: process.cwd(),
			stdio: 'inherit',
		});
		
		outputLog.on('message', function(data) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(data);
		});
		
		outputLog.on('error', function(data) {
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
		
		let outputLog = spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm",['run','build-'+platform],{
			cwd: process.cwd(),
			stdio: 'inherit',
		});
		
		outputLog.on('message', function(data) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(data);
		});
		
		outputLog.on('error', function(data) {
			console.log('ERROR: ' + data);
		});
		outputLog.on('close', function(code) {
			console.log('code: ' + code);
			console.log(' distribution finished!');
		});
	});

program.parse(process.argv);
