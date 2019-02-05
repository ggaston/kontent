/**
 * Normalize node output with replace capability.
 * @version 0.0.1-alpha
 * @todo Idea - Strip DOM fragment. 
 * @todo Idea - Count Words. 
 */

const tidy = require('htmltidy2');
const request = require('request'); 
const fs = require('fs');
const es = require('event-stream');
const argv = require('minimist')(process.argv.slice(2));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const opts = {
    doctype: 'html5',
    hideComments: false, //  multi word options can use a hyphen or "camel case"
    indent: 0,
    'drop-empty-elements': false, // Keep empty tags
    wrap: 0,
    'hide-comments': true
}

const worker = tidy.createWorker(opts);


const path = argv.p || 'http://localhost:8080/html/test-tidy.html';
const filename = path.split('/').pop();

let counter = 0;

console.log(filename)


let stream = request.get(path)
       //.pipe(es.split())
       //.pipe(es.map(function(data, callback){
       //    data = data.replace('h1', 'h2'); // Just for demonstration.
       //    callback(null, data);
       //}))
       .pipe(worker)
       .pipe(es.map(function(data, callback){
            const dom = new JSDOM(data);
            const el = dom.window.document.getElementById('content-holder')

            if (el) {
                data = el.innerHTML;
            } else {
                data = '';
            }
            
            callback(null, data);
        }))
       .pipe(es.split())
       .pipe(es.map(function(data, callback){
            const dom = new JSDOM(data);
            const match = dom.window.document.body.textContent.match();
            
            if (match.input) {
                counter++
                data = match.input + '\n';
                console.log(counter + ': ' + match.input);
                
            } else {
                data = ''
            }
            
            callback(null, data)
       }))
       .pipe(fs.createWriteStream('out/' + filename + '-text.txt'))

 stream.on('close', function(){
    console.log('Finished: ' + counter);
 });    


