/**
 * Normalize node output with replace capability.
 * @version 0.0.1-alpha
 * @todo Idea - Strip DOM fragment. 
 */

const tidy = require('htmltidy2');
const request = require('request'); 
const fs = require('fs');
const es = require('event-stream');
const argv = require('minimist')(process.argv.slice(2));

const opts = {
    doctype: 'html5',
    hideComments: false, //  multi word options can use a hyphen or "camel case"
    indent: false,
    'drop-empty-elements': false // Keep empty tags
}

const worker = tidy.createWorker(opts);


const path = argv.p || 'http://localhost:8080/html/test-tidy.html';
const filename = path.split('/').pop();

request.get(path)
       .pipe(es.split())
       .pipe(es.map(function(data, callback){
           data = data.replace('h1', 'h2'); // Just for demonstration.
           callback(null, data);
       }))
       .pipe(worker)
       .pipe(fs.createWriteStream('out/' + filename + '-normalized.html'))
