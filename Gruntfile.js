module.exports = function (grunt) {
	grunt.loadNpmTasks('intern');
//	var req = (function () {
//		this.dojoConfig = {
//			async: true,
//			baseUrl: __dirname,
//			//baseUrl: '..',
//			packages: [
//				{ name: 'intern', location: 'node_modules/intern' },
//				{ name: 'when', location: 'node_modules/when', main: 'when' }
//				//{ name: 'delite', location: '.' },
////				{ name: 'dojo', location: '../dojo' },
////				{ name: 'dcl', location: '../dcl' },
//			],
//			map: {
//				'*': {
//					'intern/dojo': 'intern/node_modules/dojo'
//				}
//			}
//		};
//
//		require('intern/node_modules/dojo/dojo');
//		return this.require;
//	})();

	grunt.initConfig({
		intern: {

			local: {
				options: {
//					loader: {
//						baseUrl: '..',
//						packages: [
//						{name : 'delite', location : './delite'},
//						{name : 'dojo', location : './dojo'},
//						{name : 'dcl', location : './dcl'}
//						]
//					},
					runType: 'runner',
					config: 'tests-intern/intern.local',
					reporters: ['runner']
				}
			},
			remote: {
				options: {
					runType: 'runner',
					config: 'tests-intern/intern',
					reporters: ['runner']
				}
			},
			proxy: {
				options: {
					runType: 'runner',
					proxyOnly: true,
					config: 'tests-intern/intern.proxy',
					reporters: ['runner']
				}
			},
			node: {
				options: {
					runType: 'client',
					config: 'tests-intern/intern',
					reporters: ['console']
				}
			}
		}
	});

	var servicesServer;
//	grunt.registerTask('proxy', function () {
//		var done = this.async();
//		req(['delite/tests-intern/services/main'], function (services) {
//			services.start().then(function (server) {
//				servicesServer = server;
//				done(true);
//			});
//		});
//	});

	grunt.registerTask('test', function (target) {
		if (!target || target === 'coverage') {
			target = 'remote';
		}

		function addReporter(reporter) {
			var property = 'intern.' + target + '.options.reporters',
				value = grunt.config.get(property);

			if (value.indexOf(reporter) !== -1) {
				return;
			}

			value.push(reporter);
			grunt.config.set(property, value);
		}
		if (this.flags.coverage) {
			addReporter('lcovhtml');
		}

		if (this.flags.console) {
			addReporter('console');
		}

//		if (target !== 'node') {
//			grunt.task.run('proxy');
//		}
		grunt.task.run('intern:' + target);
	});
};
