module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({

    /*
     * Read options from external JSON files
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Validate with JSHint
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: ['src/**/*.js']
    },

    /**
     * Run automated JS tests.
     */
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      dev: {
        reporters: 'dots'
      }
    }

  });

  grunt.registerTask('default', ['jshint']);

};
