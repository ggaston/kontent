const tidy = require('htmltidy2');
const request = require('request'); 
const fs = require('fs');

const opts = {
    doctype: 'html5',
    hideComments: false, //  multi word options can use a hyphen or "camel case"
    indent: false,
    'drop-empty-elements': false // Keep empty tags
}

const worker = tidy.createWorker(opts);


const domain = 'http://localhost:8080/';
const path = 'html/'
const filename = 'test-tidy.html'

request.get(domain + path + filename)
       .pipe(worker)
       .pipe(fs.createWriteStream('html/' + filename + '-clean.html'));