/**
 ******************************************************************************
 **%%vim: set modelines=15:
 *
 * scanner.js
 * Asynchronous XBake scanning interface
 *
 * Copyright (c) 2016 Jacob Hipps/Neo-Retro Group, Inc.
 * https://ycnrg.org/
 *
 * @author      Jacob Hipps - jacob@ycnrg.org
 * @license     MPLv2 <https://www.mozilla.org/en-US/MPL/2.0/>
 * @param       vim: set ts=4 sw=4 noexpandtab syntax=javascript:
 *
 *****************************************************************************/

var child_process = require('child_process');
var fs = require('fs');
var logthis = require('./logthis');

exports.xbake_scandir = function(indir, _cbx) {

	// check if target exists and is a directory
	try {
		var dstat = fs.statSync(indir);
		if(!dstat.isDirectory()) {
			_cbx({ msgtype: "_exception", msg: "Selected file is not a directory" });
			return;
		}
	} catch(e) {
		_cbx({ msgtype: "_exception", msg: "Error accessing selected directory" });
		return;
	}

	// spawn XBake process
	var xbake = child_process.spawn('yc_xbake', [ '--tsukimi', '--scan', indir ] );

	// set up event listeners
	xbake.stderr.on('data', function(data) {
		//console.log("[yc_xbake] stderr: "+data.toString());
		try {
			var odata = JSON.parse(data.toString());
		} catch(e) {
			var odata = { msgtype: '_raw', data: data.toString() };
		}
		_cbx(odata);
	});

	xbake.on('close', function(exitCode) {
		_cbx({ msgtype: "_close", exitcode: exitCode });
	});

}
