'use strict';
var fs = require('fs');

export function get_text_version(content) {
    try {
        var text_body = fs.readFileSync(__dirname + '/html/' + content.template + '.html').toString();

        for (var prop in content) {
            var property = new RegExp('{{' + prop + '}}', "g");
            text_body = text_body.replace(property, content[prop]);
        }

        text_body = text_body.replace(/<br>/g, '\r\n'); // removes <br>
        text_body = text_body.replace(/<br \/>/g, '\r\n'); // removes <br />
        text_body = text_body.replace(/(<([^>]+)>)/ig,""); // removes all html
        text_body = text_body.replace(/^\s+|\s+$/g, ""); // removes whitespace

        return text_body;
    } catch (error) {
        console.log('Email error', error);
        return;
    }
}

export function get_html_version(content) {
    try {
        var html_body = fs.readFileSync(__dirname + '/html/' + content.template + '.html').toString();

        for (var prop in content) {
            var property = new RegExp('{{' + prop + '}}', "g");
            html_body = html_body.replace(property, content[prop]);
        }

        return html_body;
    } catch(error) {
        console.log('Email html error', error);
        return;
    }

}
