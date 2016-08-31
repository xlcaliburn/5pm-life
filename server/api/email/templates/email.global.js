'use strict';

export function get_text_version(content) {
    var text_body = fs.readFileSync(__dirname + '/html/' + content.template + '.html').toString();

    text_body = text_body.replace(/<br>/g, '\r\n'); // removes <br>
    text_body = text_body.replace(/<br \/>/g, '\r\n'); // removes <br />
    text_body = text_body.replace(/(<([^>]+)>)/ig,""); // removes all html
    text_body = text_body.replace(/^\s+|\s+$/g, ""); // removes whitespace

    return text_body;
}

export function get_html_version(content) {
    var html_body = fs.readFileSync(__dirname + '/html/' + content.template + '.html').toString();

    for (var prop in content) {
        var property = new RegExp('{{' + prop + '}}', "g");
        html_body = html_body.replace(property, content[prop]);
    }

    return html_body;
}
