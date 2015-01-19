module.exports = function(grunt) {
    
    grunt.initConfig({
        uglify: {
            options: {
              mangle: false
            },
            my_target: {
              files: {
                'src/app.min.js': ['src/steel.js', 'src/automobile.js', 'src/mechanic.js', 'src/app.js']
              }
            }
        },
        connect: {
            server: {
                options: {
                    port: 1111,
                    keepalive: false,
                    base: ['./', 'src/', 'test/'],
                    debug: true,
                    middleware: function (connect, options) {
                        var middlewares = [
                            require('grunt-connect-rewrite/lib/utils').rewriteRequest
                        ];
                        var directory = options.directory || options.base[options.base.length - 1];

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        options.base.forEach(function(base) {
                            // Serve static files.
                            middlewares.push(connect.static(base));
                        });

                        return middlewares;
                    }
                }
            },
            rules: [            
                {from: '^/tests(.*)', to: '/test/index.html$1'},
                {from: '^/$', to: '/src/index.html'},
                {from: '^/(.*)$', to: '/$1'}
            ]
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['uglify']
            },
            livereload: {
                // Here we watch the files the sass task will compile to
                // These files are sent to the live reload server after sass compiles to them
                options: { livereload: true },
                files: ['src/*']
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-rewrite');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('server', ['uglify', 'configureRewriteRules','connect:server',  'watch'])

};