var path = require('path');
var formidable = require('formidable');
var StringDecoder = require('string_decoder').StringDecoder;
var typeis = require('type-is');
var File = require('formidable/lib/file');

formidable.IncomingForm.prototype.handlePart = function (part) {
	var self = this;

	if (part.filename === undefined) {
		var value = '', decoder = new StringDecoder(this.encoding);

		part.on('data', function (buffer) {
			self._fieldsSize += buffer.length;
			if (self._fieldsSize > self.maxFieldsSize) {
				self._error(new Error('maxFieldsSize exceeded, received ' + self._fieldsSize + ' bytes of field data'));
				return;
			}
			value += decoder.write(buffer);
		});

		part.on('end', function () {
			self.emit('field', part.name, value);
		});
		return;
	}

	this._flushing++;

	var ext = path.extname(part.filename);
	var file = {
		name: part.filename,
		type: part.mime,
		hash: self.hash,
		ext: ext,
		size: 0,
		binaryBuff: undefined
	};

	this.emit('fileBegin', part.name, file);

	var _buff = '';

	part.on('data', function (buffer) {
		if (buffer.length === 0) {
			return;
		}
		self.pause();
		file.size += buffer.length;
		_buff += buffer.toString('binary');
		self.resume();
	});

	part.on('end', function () {
		file.binaryBuff = _buff;
		self._flushing--;
		self.emit('file', part.name, file);
		self._maybeEnd();
	});
};

exports = module.exports = formParser;

function formParser(options) {
	options = options || {};
	return function (req, res, next) {
		if (!typeis.hasBody(req) || req._body) {
			return next();
		}
		var _multipart = multipart(options);

		if (typeis(req) === 'multipart/form-data') { // form 表单提交 图片
			_multipart(req, res, next);
		} else {
			next();
		}
	};
}

// 表单
function multipart(options) {
	options = extend({
		uploadDir: 'dev/null',
		keepExtensions: true,
		hash: 'md5'
	}, options);
	return function multipartParser(req, res, next) {
		var form = new formidable.IncomingForm(), data = [], done;

		Object.keys(options).forEach(function (key) {
			form[key] = options[key];
		});
		form.parse(req, function (err, fields, files) {
			req._body = true;
			req.body = extend(fields, files);
			next();
		});
	};
}

function extend(source, target) {
	if (!source) source = {};
	if (!target) return source;
	for (var k in target) {
		source[k] = target[k];
	}
	return source;
}