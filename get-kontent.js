/**
 * Normalize node output with replace capability.
 * @version 0.0.1-alpha
 * @todo Idea - Strip DOM fragment. 
 * @todo Idea - Count Words. 
 */

const tidy = require('htmltidy2').tidy;
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const opts = {
    doctype: 'html5',
    hideComments: true, //  multi word options can use a hyphen or "camel case"
    indent: 0,
    'drop-empty-elements': false, // Keep empty tags
    wrap: 0
}

//const worker = tidy.createWorker(opts);


const path = argv.p || 'http://localhost:8080/html/test-tidy.html';
const filename = path.split('/').pop();


const urls = [
    'https://example.com/1',
    'https://example.com/2'
];

urls.forEach((url) => {
    const filename = url.split('/').pop();
    let ws = fs.createWriteStream('out/' + filename + '-text.txt', {encoding: 'utf-8'})

    JSDOM.fromURL(url, {}).then(dom => {
        const content = dom.window.document.getElementById('content-holder')
              
        tidy(content.innerHTML, opts, (err, html) => {
            const contentDom = new JSDOM(html),
                    text = contentDom.window.document.body.textContent

            let _text = text.replace(/^\s*$(?:\r\n?|\n)/gm, '');      
        
            ws.write(_text)
            ws.end()
        });
    });
});
