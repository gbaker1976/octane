'use strict';

Object.defineProperty(exports, "__esModule", {
				value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Foreman = exports.Foreman = function () {
				function Foreman(script) {
								_classCallCheck(this, Foreman);

								if (!script) throw new Error('You must supply a script to execute!');
								this._script = script;

								return this;
				}

				_createClass(Foreman, [{
								key: 'start',
								value: function start() {
												this._worker = new Worker(this._script);
												this._worker.postMessage({
																command: 'start'
												});
												return this;
								}
				}, {
								key: 'stop',
								value: function stop() {
												this._worker.postMessage({
																command: 'stop'
												});
												return this;
								}
				}, {
								key: 'send',
								value: function send(data) {
												this._worker.postMessage({
																command: 'data',
																data: data
												});
												return this;
								}
				}, {
								key: 'on',
								value: function on(name, handler) {
												this._worker.addEventListener('message', function (message) {
																if (name === message.command) {
																				handler(message.data);
																}
												}, false);
												return this;
								}
				}, {
								key: 'off',
								value: function off(name) {
												this._worker.removeEventListener('message');
												return this;
								}
				}]);

				return Foreman;
}();

;