'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

var pos_img = new Array();
var neg_img = new Array();

var count = 20;
var twitter = fs.readFileSync('./data/twitter.txt').toString().split(":::");
var init_txt = fs.readFileSync('./data/init.txt').toString();

function intervalFunc() {
  twitter = fs.readFileSync('./data/twitter.txt').toString().split(":::");
  count += parseInt(twitter[0]);
  if (count < 1) count = 1;
  if (count > 39) count = 39;
  console.log(twitter[0]);
}

//read pos img
for (var i = 1; i < 6; i++) {
  var url = './data/img/pos/pos_' + i + '_rgb.txt';
  pos_img[i - 1] = fs.readFileSync(url).toString();
}

//read neg img
for (var i = 1; i < 6; i++) {
  var url = './data/img/neg/neg_' + i + '_rgb.txt';
  neg_img[i - 1] = fs.readFileSync(url).toString();
}

//setInterval(intervalFunc, 5000);

const app = express();
// Setup logger

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));


// Always return the main index.html, so react-router render the route in the client
//   모든 request에 대해서 build폴더 아래 index.html을 보내도록 되어 있는데,
//       이부분을 수정하여 server side 프로그래밍을 한다.

//send rgb
app.get("/rgb", function (req, res, next) {
  res.send({ neg_img, pos_img });
});

//send twitter message
app.get("/twitter", function (req, res, next) {
  intervalFunc();
  res.send({
    sentence: twitter[1],
    sentimental: {
      emotion: (count >= 20) ? 'pos' : 'neg',
      level: parseInt(Math.abs(20 - parseInt(count)) / 2),
    }
  });
});

//send init message
app.get("/init", function (req, res, next) {
  res.send({
    sentence: init_txt,
    sentimental: {
    emotion: 'pos', level: 0,
    }
  });
});

const PORT = process.env.PORT || 9000; // use 9000 port

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
