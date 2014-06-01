module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: 'app.js'
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: '.',
          open: true
        }
      },
      canvas: {
        options: {
          port: 9001,
          base: '.',
          open: {
            target: 'http://0.0.0.0:9001/canvas.html'
          }
        }
      }
    },
     watch: {
      options: {
        livereload: true,
      },
      html: {
        files: ['index.html'],
      },
      js: {
        files: ['*.js'],
        tasks: ['jshint:all'],
      },
      css: {
        files: ['*.css'],
      }
    }
  });
  


  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint:all']);
  grunt.registerTask('serve', ['connect:canvas', 'watch']);

};
