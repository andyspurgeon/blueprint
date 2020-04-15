/**
 * @file            Gruntfile.js
 * @summary         Used to configure grunt, load Grunt plugins, and define tasks for execution.
 */

// **************************************************
// Node and npm Modules
// **************************************************
const sass = require('node-sass');

// **************************************************
// Module
// **************************************************
module.exports = function(grunt) {
    /**
     * @summary     Configure grunt tasks.
     */
    grunt.initConfig({
        // Read the package config
        pkg: grunt.file.readJSON('package.json'),

        // Copy libraries required on the client-side.
        copy: {
            packages: {
                expand: true,
                cwd: 'node_modules/',
                dest: 'public/pkg/',
                //flatten: true,
                //filter: 'isFile',
                src: [
                    'bulma/**',
                    'bulma-extensions/dist/**'
                ]
            }
        },

        // Create logs folder
        mkdir: {
            all: {
                options: {
                    create: ['logs']
                }
            },
        },

        // Compile SASS to CSS
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    'public/css/main.css': 'public/css/main.scss'
                }
            }
        },

        // Watch for changes
        watch: {
            css: {
                files: ['public/css/*.scss', 'public/css/partials/*.scss'],
                tasks: ['sass']
            }
        }

    });

    // Enable plugins
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-sass');

    // Tasks
    grunt.registerTask('default', ['copy', 'mkdir', 'sass']);
};