var fs = require('fs');
var path = require('path');
var config = require('config');
var _ = require('underscore');
var path = require('path');
var log = require('../utils/log')('crontab');

var NODE_COMMAND = config.crontab.nodeCommand;
var SHELL_COMMAND = config.crontab.shellCommand;
var comment = config.crontab.comment;
var execDir = path.join(__dirname, '../');

/* istanbul ignore if */
if (!NODE_COMMAND || !SHELL_COMMAND) {
	throw new Error('need NODE_COMMAND and SHELL_COMMAND config');
}

require('crontab').load(function (err, crontab) {
	/* istanbul ignore if */
	if (err) {
		return log.error('Crontab: load retunr a error %s', err);
	}
	var jobs = crontab.jobs({comment: comment});
	_.each(jobs, function (job) {
		var str = job.toString();
		log.info('Crontab: init remove task %s', str);
		crontab.remove(job);
	});

	var createJob = function (dir, filename, ext) {
		var crontabCommand = '';
		/* istanbul ignore if */
		if (ext === '.sh') {
			crontabCommand = 'cd ' + execDir + ' && ' + SHELL_COMMAND + ' ' + dir;
		}
		/* istanbul ignore else */
		else {
			crontabCommand = 'cd ' + execDir + ' && ' + NODE_COMMAND + ' ' + dir;
		}
		var jobs = crontab.jobs({command: crontabCommand, comment: comment});
		/* istanbul ignore if */
		if (jobs.length) {
			return log.info('Crontab: task %s is exist', crontabCommand);
		}
		var when = config.crontab && config.crontab[filename];
		if (when) {
			var job = crontab.create(crontabCommand, when, comment);
			return log.info('Crontab: register task %s', job.toString());
		}
		/* istanbul ignore next */
		return log.error("Don't know what time " + filename + ' to run');
	};

	fs.readdir(__dirname, function (err, dirs) {
		dirs.forEach(function (key) {
			var ext = path.extname(key);
			var filename = key.replace(ext, '');
			if (filename !== 'index') {
				var dir = __dirname + '/' + key;
				createJob(dir, filename, ext);
			}
		});
		crontab.save();
	});
});