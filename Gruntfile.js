/* jslint node: true */ 
'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['*.js', 'modules/*.js', 'tests/*.js'],
		},
		jsonlint: {
			config: {
				src: ['*.json']
			}

		},
		bashlint: {
			options: { force: true },
			src: ['**/*,sh']
		},

		nodeunit: {
			files : ['tests/*_test.js']
		},
		watch: {
			scripts: {
				files: '<%= jshint.files %>',
				tasks: ['jshint', 'nodeunit']
			},
			config : {
				files: '<%= jsonlint.config.src %>',
				tasks: ['jsonlint']
			}
		},
		copy: {
			build: {
				src: ['**', 
					'!**/node_modules/**', 
					'!**/tests/**', 
					'!**/ssl/**', 
					'ssl/certs.txt',
					'!config.json', 
					'!Gruntfile.js'],
				dest: 'build',
				expand: true
			}
		},
		clean: {
			build: {
				src: ['build']
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-lint-bash');

	grunt.registerTask('default', ['jshint', 'jsonlint', 'nodeunit']);
	grunt.registerTask('build', ['clean', 'copy']);
};