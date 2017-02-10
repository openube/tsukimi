/**
 ******************************************************************************
 **`%vim: set modelines=15:
 *
 * tsk_db.js
 * Database interfaces
 *
 * Copyright (c) 2016 Jacob Hipps/Neo-Retro Group, Inc.
 * https://ycnrg.org/
 *
 * @author      Jacob Hipps - jacob@ycnrg.org
 * @license     MPLv2 <https://www.mozilla.org/en-US/MPL/2.0/>
 * @param       vim: set ts=4 sw=4 noexpandtab syntax=javascript:
 *
 *****************************************************************************/
/* jshint -W083 */
/* jshint -W049 */

var MongoClient = require('mongodb').MongoClient;
var events = require('events');
var logthis = require('./logthis');
var scanner = require('./scanner');

var emitter = new events.EventEmitter();
var monjer = false;

function connect(conx) {
	logthis.verbose("Connecting to MongoDB: %s", conx);
	MongoClient.connect(conx, function(err,db) {
		if(!err) {
			logthis.info("Connected to Mongo OK");
			monjer = db;
			emitter.emit('db_connect_ok');
		} else {
			logthis.error("Failed to connect to Mongo database",{ error: err });
			monjer = false;
			emitter.emit('db_connect_fail');
		}
	});
}

function close() {
	if(monjer) {
		monjer.close();
		logthis.verbose("Connection to Mongo closed");
	} else {
		logthis.debug("Connection to Mongo not active");
	}
	emitter.emit('db_close');
}

function query_videos(qparams, _cbx) {
	monjer.collection('videos').find(qparams).toArray(_cbx);
}

function query_videos_rr(qparams, _cbx) {
	// use of this function versus query_videos() is preferred for
	// filling out templates, since it resolves external references,
	// then joins them inline with the video document
	var qerr = null;
	var qvids = [];
	var qfiles = {};

	var resolveFiles = function(fidlist, fIndex, _cbx) {
		monjer.collection('files').findOne({ _id: fidlist[fIndex].id }, function(err, tf) {
			if(err) {
				logthis.warning("RefResolver: Failed to lookup file %s:", fidlist[fIndex].id, err);
			} else {
				qfiles[fidlist[fIndex].id] = tf;
			}

			fIndex++;
			if(fIndex < fidlist.length) {
				resolveFiles(fidlist, fIndex, _cbx);
			} else {
				_cbx(qfiles);
			}
		});
	};

	var resolveDocument = function(vids, curIndex, _cbx) {
		var tvid = vids[curIndex];

		// series lookup
		monjer.collection('series').findOne({ _id: tvid.series_id }, function(err, tser) {
			if(err) logthis.error("RefResolver: Series lookup for %s failed:", tvid.series_id, err);

			// episode lookup
			monjer.collection('episodes').findOne({ _id: tvid.episode_id }, function(err, tep) {
				if(err) logthis.error("RefResolver: Episode lookup for %s failed:", tvid.episode_id, err);

				// file lookup
				qfiles = {};
				resolveFiles(tvid.sources, 0, function(tfiles) {
					tvid['_series'] = tser;
					tvid['_episode'] = tep;
					tvid['_files'] = tfiles;
					qvids.push(tvid);

					curIndex++;
					if(curIndex < vids.length) {
						resolveDocument(vids, curIndex, _cbx);
					} else {
						_cbx(qerr, qvids);
					}
				});
			});
		});
	};

	monjer.collection('videos').find(qparams).toArray(function(err, docs) {
		if(docs.length > 0) {
			resolveDocument(docs, 0, _cbx);
		} else {
			_cbx(err, []);
		}
	});
}

function get_video(qparams, _cbx) {
	monjer.collection('videos').findOne(qparams, _cbx);
}

function get_video_byid(id, _cbx) {
	monjer.collection('videos').findOne({ "_id": String(id) }, _cbx);
}

function query_series(qparams, _cbx) {
	monjer.collection('series').find(qparams).toArray(_cbx);
}

function get_series(qparams, _cbx) {
	monjer.collection('series').findOne(qparams, _cbx);
}

function get_series_byid(id, _cbx) {
	monjer.collection('series').findOne({ "_id": String(id) }, _cbx);
}

function query_episodes(qparams, _cbx) {
	monjer.collection('episodes').find(qparams).toArray(_cbx);
}

function get_episode(qparams, _cbx) {
	monjer.collection('episodes').findOne(qparams, _cbx);
}

function get_episode_byid(id, _cbx) {
	monjer.collection('episodes').findOne({ _id: id }, function(err, docs) {
		if(err) logthis.error("Failed to retrieve episode data",{ err: err, docs: docs });
		_cbx(docs);
	});
}

function get_episode_data(sid, _cbx) {
	monjer.collection('episodes').find({ series_id: sid }).toArray(function(err,docs) {
		if(err) logthis.error("Failed to retrieve episode data",{ err: err, docs: docs });

		logthis.debug("get_episode_data: returned %d episodes", docs.length);

		// build assoc array of series
		var slist = {};
		for(si in docs) {
			var tdoc = docs[si];
			slist[tdoc['_id']] = tdoc;
		}

		_cbx(slist);
	});
}

function update_episode(epid, indata, _cbx) {
	monjer.collection('episodes').update({ _id: epid }, indata, function(err,rdoc) {
		if(err) {
			logthis.debug("Failed to update episode data for %s", epid);
			_cbx(err);
		} else {
			logthis.debug("Wrote updated episode data for %s", epid);
			_cbx(null);
		}
	});
}

function update_file(id, indata, _cbx) {
	monjer.collection('files').update({ _id: id }, indata, function(err,rdoc) {
		if(err) {
			logthis.debug("Failed to update file data for %s", id);
			_cbx(err);
		} else {
			logthis.debug("Wrote updated file data for %s", id);
			_cbx(null);
		}
	});
}

function remove_file(id, _cbx) {
	monjer.collection('files').remove({ _id: id }, _cbx);
}

function query_files(qparams, _cbx) {
	monjer.collection('files').find(qparams).toArray(function(err, docs) {
		logthis.debug("query_files: returned %d files", docs.length);
		_cbx(err, docs);
	});
}

function get_file_data(id, _cbx) {
	monjer.collection('files').findOne({ _id: id }, function(err, docs) {
		if(err) logthis.error("Failed to retrieve file data",{ err: err, docs: docs });
		_cbx(docs);
	});
}

function get_file_groups(_cbx) {
	// group/reduce by tdex_id (series)
	var reducer = function(curr,result) {
					if(curr.series_id) result.series_id = curr.series_id;
					result.count++;
					if(curr.status == "new") result.new++;
					if(curr.status == "complete") result.complete++;
				  };

	// run aggregation
	monjer.collection('files').group({ tdex_id: 1 }, {}, { count: 0, new: 0, complete: 0 }, reducer, function(err,docs) {
		logthis.debug("get_file_groups: returned %d groups", docs.length, { err: err, docs: docs });
		_cbx(err,docs);
	});
}

function get_series_data(_cbx) {
	monjer.collection('series').find({}).toArray(function(err,docs) {
		if(err) logthis.error("Failed to retrieve series data",{ err: err, docs: docs });

		logthis.debug("get_series_data: returned %d series", docs.length);

		// build assoc array of series
		var slist = {};
		for(si in docs) {
			var tdoc = docs[si];
			slist[tdoc['_id']] = tdoc;
		}

		_cbx(slist);
	});
}

function update_series(serid, indata, _cbx) {
	monjer.collection('series').update({ _id: serid }, indata, function(err,rdoc) {
		if(err) {
			logthis.debug("Failed to update series data for %s", serid);
			_cbx(err);
		} else {
			logthis.debug("Wrote updated series data for %s", serid);
			_cbx(null);
		}
	});
}

function add_series_full(sname, indata, _cbx) {
	// clone data
	var sdata = JSON.parse(JSON.stringify(indata));
	delete(sdata.episodes);

	// generate a new norm_id
	var new_tdex = normalize(sdata.ctitle);

	// generate series_id
	var tser_id = mkid_series(new_tdex, sdata);

	// set series data
	var thisx = {
					'_id': tser_id,
					norm_id: new_tdex,
					title: sdata.ctitle,
					count: null,
					genre: sdata.genre,
					xrefs: sdata.xrefs,
					tv: sdata.tv,
					ctitle: sdata.ctitle,
					synopsis: sdata.synopsis,
					lastupdated: sdata.lastupdated,
					artwork: sdata.artwork
				};

	// process episode data
	var eplist = [];
	for(ti in indata.episodes) {
		var thisep = indata.episodes[ti];
		var tep_id = mkid_episode(tser_id, thisep);
		thisep._id = tep_id;
		thisep.tvdb_id = thisep.id;
		thisep.series_id = tser_id;
		delete(thisep.id);
		eplist.push(thisep);
	}

	logthis.debug("eplist ready for insert",{ eplist: eplist });

	// insert series data into Mongo
	monjer.collection('series').insert(thisx, function(err,rec) {
		if(!err) {
			monjer.collection('episodes').insert(eplist, function(err,rec) {
				if(!err) {
					var xresp = { status: "ok", new_tdex: new_tdex, series_id: tser_id };
					logthis.verbose("Inserted series and episode data into Mongo successfully", xresp);
					_cbx(xresp);
				} else {
					logthis.error("Failed to insert episodes into Mongo", { error: err, result: rec });
					_cbx({ status: "error", error: err });
				}
			});
		} else {
			logthis.error("Failed to insert series into Mongo", { error: err, result: rec });
			_cbx({ status: "error", error: err });
		}
	});

}

function mkid_series(sid, xdata) {
	// create unique series ID with tdex_id + release year
	var dyear;
	if(xdata.tv.debut) {
		dyear = String((new Date(parseFloat(xdata.tv.debut) * 1000.0)).getFullYear());
	} else {
		dyear = "90" + String(parseInt(Date.now() / 1000)).substr(-5);
	}
	return sid + "." + dyear;
}

function mkid_episode(sid, xdata) {
	var isuf = (xdata.id || String(Date.now() / 1000000.0).split('.')[1]);
	return sid + "." + (String(xdata.season) || '0') + "." + (String(xdata.episode) || '0') + "." + isuf;
}

function mkid_video(serdata, epidata) {
	var isuf = (epidata.first_aired || String(Date.now() / 1000000.0).split('.')[1]);
	return serdata._id + "." + (String(epidata.season) || '0') + "." + (String(epidata.episode) || '0') + "." + isuf;
}

function update_file_series(match, serid, _cbx) {
	// retrieve files for update
	monjer.collection('files').find(match).toArray(function(err, files) {
		logthis.debug("returned files", { err: err, files: files });
		// retrieve episodes for series
		monjer.collection('episodes').find({ series_id: serid }).toArray(function(err, eplist) {
			// loop through all of the files and update the series_id and episode_id
			var fcount = eplist.length;
			var newfiles = [];
			for(ti in files) {
				var tfile = files[ti];
				tfile.series_id = serid;
				try {
					tfile.episode_id = (eplist.filter(function(x) { return parseInt(x.season) == parseInt(tfile.fparse.season) && parseInt(x.episode) == parseInt(tfile.fparse.episode); })[0]._id || null);
				} catch(e) {
					logthis.warning(e.message);
					logthis.error("Skipping file without episode match", tfile);
					continue;
				}
				newfiles.push(tfile);
			}
			// remove existing files; may change this later, but this makes things
			// easier so that we don't need to create a seperate function to do this
			// with a chain of callbacks to update every single entry
			monjer.collection('files').remove(match, function(err,rdoc) {
				if(!err) logthis.verbose("removed existing files without error");
				else logthis.error("Error removing existing files", { error: err, result: rdoc});

				// update files
				monjer.collection('files').insert(newfiles, function(err,rdoc) {
					if(!err) logthis.verbose("inserted updated file entries OK");
					else logthis.error("Error when adding new file entries", { error: err, result: rdoc});

					// update series entry with correct count
					monjer.collection('series').update({ '_id': serid }, { '$set': { count: fcount } }, function(err,rdoc) {
						logthis.verbose("updated series file count OK");
						_cbx(null);
					});
				});
			});
		});
	});
}

function import_selection(selection, iconfig, cbProgress, _cbx) {
	var numSelection = selection.length;
	var err = null;

	var doScreenshot = function(fdata, _cbx) {
		if(iconfig.vscap_auto) {
			try {
				scanner.xbake_vscap(fdata.location[fdata.default_location].fpath.real, fdata._id, 'auto', _cbx);
			} catch(e) {
				logthis.exception("Failed to construct XBake call due to malformed or incomplete file object:", e);
				_cbx(null);
			}
		} else {
			_cbx(null);
		}
	};

	var vidImport = function(slist, curIndex, _cbx) {
		// retrieve file object, fresh from the db
		monjer.collection('files').findOne({ _id: slist[curIndex]._id }, function(err, tfile) {
			// grab series and episode entries
			monjer.collection('series').findOne({ _id: tfile.series_id }, function(err, tser) {
				monjer.collection('episodes').findOne({ _id: tfile.episode_id }, function(err, tep) {
					console.log("tfile =", tfile);
					console.log("tser =", tser);
					console.log("tep =", tep);

					// generate video ID & update progress
					tvid_id = mkid_video(tser, tep);
					cbProgress(tvid_id);

					// check if video already exists
					monjer.collection('videos').findOne({ _id: tvid_id }, function(err, xvdata) {
						var vdata;
						var itime = parseInt(Date.now() / 1000);
						if(xvdata) {
							logthis.debug("Updating existing entry for %s:", tvid_id, xvdata);
							vdata = xvdata;
						} else {
							logthis.debug("Creating new entry for %s", tvid_id);
							vdata = {
								_id: tvid_id,
								metadata: {
									title: null,
									series: null,
									episode: null,
									season: null,
									special: tfile.fparse.special || null
								},
								series_id: tser._id,
								episode_id: tep._id,
								vstats: {
									ctime: itime,
									mtime: itime,
									last_watched: null,
									view_count: 0
								},
								vscap: [],
								sources: [],
								groups: [],
								tags: [],
								status: 'ok'
							};
						}

						// remove default bit from any existing sources; new entry will be set as default
						// may want to have this be a configuration option
						for(tvsi in vdata.sources) {
							vdata.sources[tvsi].default = false;
						}

						if(iconfig.group) {
							vdata.groups.push(iconfig.group);
						}

						vdata.vstats.mtime = itime;
						vdata.sources.push({
							id: tfile._id,
							default: true,
							default_location: tfile.default_location || null,
							mediainfo: tfile.mediainfo
						});

						// take screenshot, if enabled; otherwise returns null
						doScreenshot(tfile, function(vscap) {
							if(vscap) {
								logthis.debug("Took screenshot successfully:", vscap);
								vdata.vscap = vscap;
							}

							// upsert into videos collection
							monjer.collection('videos').update({_id: tvid_id}, vdata, {upsert: true}, function(err, rdoc) {
								if(err) logthis.error("Failed to upsert video entry for %s", tvid_id, err);

								// update file status
								tfile.status = "complete";
								monjer.collection('files').update({_id: tfile._id}, tfile, function(err, rdoc) {
									if(err) logthis.error("Failed to update file status for %s", tfile._id, err);

									// on to the next one
									curIndex++;
									if(curIndex < numSelection) {
										vidImport(slist, curIndex, _cbx);
									} else {
										_cbx(err);
									}
								});
							});
						});
					});
				});
			});
		});
	};

	vidImport(selection, 0, _cbx);
}

function normalize(instr) {
	return instr.replace(/[ ★☆\.]/g,'_').replace(/['`\-\?!%&\*@\(\)#:,\/\\;\+=\[\]\{\}\$\<\>]/g,'').toLowerCase().trim();
}

/**
 * Exports
 **/

exports.connect				= connect;
exports.close				= close;
exports.query_videos		= query_videos;
exports.query_videos_rr		= query_videos_rr;
exports.get_video			= get_video;
exports.get_video_byid		= get_video_byid;
exports.query_series		= query_series;
exports.get_series			= get_series;
exports.get_series_byid		= get_series_byid;
exports.query_episodes		= query_episodes;
exports.get_episode			= get_episode;
exports.get_episode_byid	= get_episode_byid;
exports.get_episode_data	= get_episode_data;
exports.update_episode		= update_episode;
exports.update_file			= update_file;
exports.remove_file			= remove_file;
exports.query_files			= query_files;
exports.get_file_groups		= get_file_groups;
exports.get_series_data		= get_series_data;
exports.add_series_full		= add_series_full;
exports.update_file_series	= update_file_series;
exports.update_series		= update_series;
exports.get_file_data		= get_file_data;
exports.import_selection	= import_selection;
