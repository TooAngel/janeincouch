const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('build'));

app.get('/home', function(req, res){
  res.sendFile(path.resolve(__dirname + '/../build/index.html'));
});

app.get('/game/*', function(req, res){
  res.sendFile(path.resolve(__dirname + '/../build/index.html'));
});

// TODO do we need this?
// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
