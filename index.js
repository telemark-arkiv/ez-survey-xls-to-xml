var fs = require('fs')
  , node_xj = require("xls-to-json")
  , xml2js = require('xml2js')
  , builder = new xml2js.Builder()
  ;

function deleteFile(fileName) {
  fs.unlink(fileName);
}

function convertFile(fileName) {
  var infile = fileName
    , outfile = fileName.replace('.xls', '.xml')
    , tmpfile = fileName.replace('.xls', '.json')
    , fileWriteStream = fs.createWriteStream(outfile)
    ;

  node_xj({
    input: infile,
    output: tmpfile
  },  function(err, result) {
        if(err) {
          console.error(err);
        } else {
          var xml = builder.buildObject(result)
            ;

          fileWriteStream.write(xml);

          deleteFile(tmpfile);
        }
  });
}

function isXls(fileName) {
  return fileName.indexOf('.xls') > -1 ? true : false;
}

function parseFiles(err, files){
  if(err) {
    throw err;
  }
  files.forEach(function(file){
    if(isXls(file)){
      console.log('Converting ' + file);
      convertFile(file);
    }
  });
}

fs.readdir(process.cwd(), parseFiles);
