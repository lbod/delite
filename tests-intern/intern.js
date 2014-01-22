// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define({
	// The port on which the instrumenting proxy will listen
	proxyPort: 9000,

	// A fully qualified URL to the Intern proxy
	//proxyUrl: 'http://localhost:9000/',

	// Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
	// specified browser environments in the `environments` array below as well. See
	// https://code.google.com/p/selenium/wiki/DesiredCapabilities for standard Selenium capabilities and
	// https://saucelabs.com/docs/additional-config#desired-capabilities for Sauce Labs capabilities.
	// Note that the `build` capability will be filled in with the current commit ID from the Travis CI environment
	// automatically
	capabilities: {
		'selenium-version': '2.37.0'
	},

	// Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
	// OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
	// capabilities options specified for an environment will be copied as-is
	environments: [

		{ browserName: 'safari', version: '7', platform: 'OS X 10.9' }
	],

	// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
	maxConcurrency: 3,

	// Whether or not to start Sauce Connect before running tests
	useSauceConnect: true,

	// Connection information for the remote WebDriver service. If using Sauce Labs, keep your username and password
	// in the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables unless you are sure you will NEVER be
	// publishing this configuration file somewhere
	webdriver: {
		host: 'localhost',
		port: 4444
	},
	loader: {
		baseUrl: '..',
		packages: [
			'delite',
			'dojo',
			'dcl'
		]
	},
// so if i change the client runner url to
// http://localhost:9000/__intern/client.html?baseUrl=%2F&config=delite/tests-intern%2Fintern.local&reporters=webdriver&sessionId=e75b9b59-18e0-4818-9bad-04205a99640c
// it works i.e. adding delite at delite/tests-intern%2Fintern.local&
// grunt loading fails without it, client loading fails with it unless I add delite/ i'm not mapping correctly
//	loader : {
//		baseUrl: '..',
//
//		packages: [
//			{name : 'dcl', location : './dcl'},
//			{name : 'delite', location : 'delite'},
//			{name : 'dojo', location : 'dojo'}
//		]
//	},
	// Configuration options for the module loader; any AMD configuration options supported by the specified AMD loader
	// can be used here
	// LEEB this is still looking towards in the delite dir for dojo and dcl - still can't map upwards, using { name: 'dcl-delite', location: '../dcl' } doesnt work
	// nowt works so far, changing the baseUrl will break shit - dojo, dcl etc need to be in the root of delite atm
//	loader: {
//		baseUrl: '..',
//		packages: [
//			{name : 'delite', location : 'delite'},
//			{name : 'dojo', location : 'dojo'},
//			{name : 'dcl', location : 'dcl'}
//		]
//	},
//	loader: {
//		baseUrl: '../',
//		// Packages that should be registered with the loader in each testing environment
//		packages: [ /*{ name: 'delite-testing', location: '.' },*/
//			{ name: 'delite', location: '.' },
//			{ name: 'dojo-delite', location: '../dojo' },
//			{ name: 'dcl-delite', location: '../dcl' }
//			],
//		map: {
//			'delite-testing': {
//				'delite': 'delite-testing',
//				'intern/dojo': 'delite/node_modules/intern/node_modules/dojo',
//				'dojo': 'dojo-delite',
//				'dcl' : 'dcl-delite'
//				//'tests-intern' : '.'
//			}
//		}
//	},
// http://localhost/deliteful/delite/node_modules/intern/client.html?config=tests-intern/intern.local&suites=tests-intern/unit/Destroyable&reporters=console

//	map: {
//		'delite-testing': {
//			'dojo': 'dojo-testing',
//			'intern/dojo': 'delite/node_modules/intern/node_modules/dojo',
//			'delite': 'delite-testing',
////				'dojo': '../dojo',
//			'dcl' : 'dcl-testing'
//			//'tests-intern' : '.'
//		}
//	}

	// Non-functional test suite(s) to run in each browser
	//suites: [ 'delite-testing/tests-intern/unit/all' ],
	suites: [ 'delite/tests-intern/unit/all' ],

	// Functional test suite(s) to run in each browser once non-functional tests are completed
	//functionalSuites: [ 'dojo-testing/tests-intern/functional/all' ],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation: /^(?:node_modules|tests-intern|tests)\//
});
