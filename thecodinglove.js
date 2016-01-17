var request = require('request');
var he = require('he');

module.exports = function (req, res, next) {
  var thecodinglove_random = 'http://thecodinglove.com/random';
  request({uri: thecodinglove_random,encoding: 'utf-8'}, function(err, response, body) {
    console.log(body);
    var re_text = /<h3>(.*)<\/h3>/;
    text = body.match(re_text)[1];
    console.log(text);
    var re_image = /<p class=".{1,2}"><img src="(.*)">/;
    image = body.match(re_image)[1];
    console.log(image);
    var re_credit = /\/\* by (.*) \*\//
    credit = body.match(re_credit)[1];
    console.log(credit);
    var re_post = /data-url="(.*)" data-text/;
    post = body.match(re_post)[1];
    console.log(post);
    // write response message and add to payload
    var botPayload = {};
    //botPayload.text = text +  '\nby: ' + credit + '\nOrignal post: ' + post;
    botPayload.username = 'thecodinglove';
    botPayload.channel = req.body.channel_id;
    botPayload.icon_emoji = ':heart:';
    botPayload.attachments = [];
    var attachment = {};
    attachment.image_url = image;
    attachment.title = he.decode(text);
    attachment.title_link = post;
    attachment.pretext = 'thecodinglove.com'
    attachment.text = 'by: ' + credit;
    botPayload.attachments.push(attachment)



    // send resoinse
    send(botPayload, function (error, status, body) {
      if (error) {
        return next(error);
      } else if (status !== 200) {
        // inform user that our Incoming WebHook failed
        return next(new Error('Incoming WebHook: ' + status + ' ' + body));

      } else {
        return res.status(200).end();
      }
    });
  });
};

function send (payload, callback) {
  var path = process.env.INCOMING_WEBHOOK_PATH;
  var uri = 'https://hooks.slack.com/services' + path;

  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }

    callback(null, response.statusCode, body);
  });
}
