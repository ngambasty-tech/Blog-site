const path = require('path');

const express = require('express');
const app = express();
const port = 3000;

app.set('views', path.join(__dirname,"views"));
app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

app.get('/compose', (req, res) => {
  res.render('compose');
});

app.get('/404', (req, res) => {
  res.render('404');
});
app.get('/post', (req, res) => {
  res.render('post');
});

app.listen(3000);