'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'assets/js/*.js',
        '!assets/js/plugins/*.js',
        '!assets/js/scripts.min.js'
      ]
    },
    uglify: {
      dist: {
        files: {
          'assets/js/scripts.min.js': [
            'assets/js/plugins/*.js',
            'assets/js/_*.js'
          ]
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 7,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: 'images/',
          src: '{,*/,*/*/,*/*/*/}*.{png,jpg,jpeg}',
          dest: 'images/'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'images/',
          src: '{,*/}*.svg',
          dest: 'images/'
        }]
      }
    },
    watch: {
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: ['jshint','uglify']
      },
      livereload: {
        files: [
          '_config.yml',
          '_dev.yml',
          '_data/**',
          '_drafts/**',
          '_includes/**',
          '_layouts/**',
          '_pages/**',
          '_posts/**',
          '_sass/**',
          'assets/**',
          'images/**'
        ],
        tasks: ['shell:jekyllBuild'],
        options: {
          livereload: true
        }
      }
    },
    clean: {
      dist: [
        'assets/js/scripts.min.js'
      ]
    },
    shell: {
      jekyllBuild: {
        command: 'jekyll build --config=_config.yml,_dev.yml'
      }
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: '_site'
        }
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-shell');

  // Register tasks
  grunt.registerTask('default', [
    'clean',
    'uglify',
    'imagemin',
    'svgmin'
  ]);
  grunt.registerTask('dev', [
    'shell',
    'connect',
    'watch'
  ]);
  grunt.registerTask('images', [
    'imagemin',
    'svgmin'
  ]);

};
