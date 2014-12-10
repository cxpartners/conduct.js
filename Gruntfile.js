module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');

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
    }

  });

  grunt.registerTask('default', ['jshint']);

};
