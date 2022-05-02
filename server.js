// const express = require('express');
// const bodyParser = require('body-parser');
// const https = require('https');
// const app = express();
//
// app.use(bodyParser.urlencoded({extended: true}));
// const custom = 'https://random-data-api.com/api/device/random_device';
// app.get('/', (req, res) => {
//   https.get(custom, (response) => {
//     response.on('data', (data) => {
//       const myData = JSON.parse(data);
//       console.log(myData);
//       res.write('You can buy ' + myData.manufacturer + ' product without delay');
//       res.send();
//
//     })
//   });
//   // res.sendFile(__dirname + '/index.html');
// })
//
// app.get('/about/troops' , (req, res) => {
//   res.send('<h1>About page</h1>')
// })
//
// app.post('/', (req, res) => {
//   const num1 = req.body.num1;
//   const num2 = req.body.num2;
//   const num3 = parseInt(num1) + parseInt(num2);
//   res.send(`The result is ${num3}`);
// })
//
// app.listen(process.env.PORT || 3000, () => {
//   console.log('Listening on port: 3000');
// })

const express = require('express');
const bodyParser = require('body-parser');
const fortunes = require('./lib/fortune.js');
const app = express();
const {engine} = require('express-handlebars');
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);

app.use((req, res, next) => {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
})

app.get('/', (req, res) => {
  res.render('home', {fortune: fortunes.getFortunes()});
});

app.get('/about', (req, res) => {
  res.render('about', {pageTestScript: '/qa/tests-about.js'});
})

app.get('/about', (req, res) => {
  res.type('text/plain');
  res.send('About page');
})

app.get('/about/something', (req, res) => {
  res.type('text/plain');
  res.send('Something directory');
})

app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 not found');
})

app.listen(app.get('port'), () => {
  console.log('Listening on port: ' + app.get('port'));
})
