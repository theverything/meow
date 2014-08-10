// require modules
var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var mkdirp =  require('mkdirp');
var fm = require('front-matter');
var dist = './dist/';

// register handlebars partials
(function () {
  fs.readdir(path.join(__dirname, '../src/templates/partials'), function (err, files) {
    if (err) throw err;

    files.forEach(function (file) {
      fs.readFile(__dirname + '/../src/templates/partials/' + file, {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;

         var name = path.basename(file, '.html');
        handlebars.registerPartial(name, data);
      });
    });

  });
}());

// get layout
var layout = (function (path) {
  var data = fs.readFileSync(path, {encoding: 'utf8'});
  return handlebars.compile(data);
}(path.join(__dirname, '../src/templates/layout.html')));

// get

// write the files
function write(file, dest) {
  fs.readFile(__dirname + '/../src/html/' + file, {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    mkdirp(path.dirname(dest), function (err) {
      if (err) throw err;
      var frontMatter = fm(data);
      var template = handlebars.compile(frontMatter.body);
      var body = {
        content: template(frontMatter.attributes),
        attrs: frontMatter.attributes
      };
      var page = layout(body);

      fs.writeFile(dest, page);
    });
  });
};

module.exports = function (p, callback) {
  fs.readdir(p, function (err, files) {
    if (err) throw err;

    files.forEach(function (file) {
      var fileName = path.basename(file, '.html');

      if (fileName === 'posts') {
        return;
      } else if (fileName === 'index') {
        write(file, dist + file);
      } else {
        write(file, path.join(dist, fileName, "index.html"));
      }

    });
  });

  fs.readdir(path.join(p, 'posts'), function (err, files) {
    if (err) throw err;

    files.forEach(function (file) {
      var slug = path.basename(file, '.html').replace('_', '-');

      write(path.join('posts', file), path.join(dist, 'post', slug, "index.html"));

    });
  });


  callback();
};
