/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-controllers
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

/**
 *
 * @module index
 */

exports.options = {
  workDir: './controllers'
}

exports.metadata = {
  name: 'Controllers',
  type: 'dynamic',
  layer: 'controllers'
}

exports.plugin = {
  load: function(inject, loaded) {
    var self = this;
    var controllerPath = this.options.workDir

    this.Logger.log('Loading from directory -- ' + controllerPath)
    fs.readdir(controllerPath, function(err, files) {
      var count = 0

      if(err) {
        if(err.code === 'ENOENT') {
          self.Logger.log('No controllers loaded.');
        }
      }
      var controllers = _.chain(files)
        .filter(function(file){
          return (file.indexOf('.') !== 0 && file !== 'index.js')
        })
        .map(function(file){
          var pendingInject = inject(require(path.join(controllerPath, file)))
          var controllerName = path.basename(file, '.js')
          return {param: controllerName, load: pendingInject}
        })
        .value()

      if(controllers.length > 0) {
        self.Logger.log('loaded ' + controllers.length + ' controllers.');
      }
      loaded(null, controllers);
    });
  },
  start: function(done) {
    done()
  },
  stop: function(done) {
    done()
  }
}