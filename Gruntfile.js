module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    apps: grunt.file.readJSON('apps.json')
  })
  grunt.registerTask('build', function(identifier) {
    var apps = grunt.config('apps')
    if (identifier != undefined) {
      var done = this.async()
      var app = apps[identifier]
      var args = ['nativefier', '--name', app.name]
      if (app.options) {
        args.push(...app.options);
      }
      var urls = app.additionalUrls || []
      urls.unshift(app.url)
      args.push('--internal-urls', `^(${urls.join(")|(")})`)
      if (app.icon) {
        console.log(`icon: ${app.icon}`);
        args.push('--icon', app.icon);
      }
      args.push(app.url, 'build');
      console.log(`Running: npx ${args.join(' ')}`)
      grunt.util.spawn({
        cmd: 'npx',
        args: args
      }, function(error, result, code) {
        console.log(String(result))
        done()
      })
    } else {
      var tasks = []
      Object.keys(apps).forEach(function (identifier) {
        tasks.push('build:' + identifier)
      })
      grunt.task.run(tasks)
    }
  })
  grunt.registerTask('install', function(identifier) {
    var apps = grunt.config('apps')
    if (identifier != undefined) {
      var done = this.async()
      var app = apps[identifier]
      grunt.util.spawn({
        cmd: 'ditto',
        args: [`build/${app.name}-darwin-x64/${app.name}.app`, `/Users/clifbromley/Applications/${app.name}.app`]
      }, function(error, result, code) {
        console.log(String(result))
        done()
      })
    } else {
      var tasks = []
      Object.keys(apps).forEach(function (identifier) {
        tasks.push('install:' + identifier)
      })
      grunt.task.run(tasks)
    }
  })
}