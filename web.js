var express = require('express');
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
  f = fs.readFileSync('index.html');
  stringbuffer = buf.toString(f);

  response.send(stringbuffer);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
