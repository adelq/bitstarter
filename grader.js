#!/usr/bin/env node
/*
Automatically grade files for HTML tags/attributes.
Uses commander.js and cheerio.
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var restler = require('restler');
var URL_DEFAULT = "http://intense-ridge-1125.herokuapp.com";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var restlerURL = function(url) {
    return restler.request(url);
};

var assertURLExists = function(url) {
    return url;
};

var processURL = function(url) {
    console.log("Ace" + url);
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, url, checksfile) {
    var data;
    if (url === null) {
	data = cheerio.load(fs.readFileSync(htmlfile));
	checkData(data,checksfile);
    }
    else {
	restler.get(url).on('complete', function(remoteData) {
	    data = cheerio.load(remoteData);
	    checkData(data, checksfile);
	});
    }
};

var checkData = function(data, checksfile) {
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = data(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    console.log(JSON.stringify(out, null, 4));
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'URL') // clone(assertURLExists), URL_DEFAULT)
	.parse(process.argv);

    var checkJson = checkHtmlFile(program.file, program.url, program.checks);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
