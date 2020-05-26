const path = require('path');
const os = require('os');
const fs = require('fs');

const Busboy = require('busboy');

exports.filesUpload = function(req, res, next) {
  // See https://cloud.google.com/functions/docs/writing/http#multipart_data
  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      // Cloud functions impose this restriction anyway
      fileSize: 10 * 1024 * 1024,
    }
  });

  const fields = {};
  const files = [];

  busboy.on('field', (key, value) => {
    fields[key] = value;
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    file.on('readable', () => {
        let buf = file.read();
        
        if (buf) {
            files.push({
              fieldname,
              originalname: filename,
              encoding,
              mimetype,
              buffer: buf,
              size: Buffer.byteLength(buf),
            });
        }
    });
  });

  busboy.on('finish', () => {
        req.body = fields;
        req.files = files;
        next();
        return true;
  });

  busboy.end(req.rawBody);
}
