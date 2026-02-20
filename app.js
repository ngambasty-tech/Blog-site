const fs = require('fs');
const multer = require('multer');

const uuid = require('uuid');
const path = require('path');
const blogData = require('./util/blog-data');

const express = require('express');
const app = express();
const port = 3000;



const storage = multer.diskStorage({
  destination: function(req, file, cd) {
    cd(null, 'public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startswith('image/')) {
//     cd(null, true);
//   } else {
//     cb(new Error('Please upload an image'), false);
//   }
// };
const upload= multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // limiting the size to 5mb
  }
  // fileFilter:fileFilter
});

app.set('views', path.join(__dirname,"views"));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded ({extended: false}))

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

app.get('/compose', (req, res) => {
  res.render('compose');
});
app.post('/compose', upload.single('image'), (req, res) => {
  const Blog ={
  id: uuid.v4(),
  title: req.body.title,
  category: req.body.category,
  status: req.body.status,
  content: req.body.content,
  image: req.file ? `/images/${req.file.filename}` : null,
  createdAt: new Date().toISOString()
}

  console.log(Blog);
  const blogs = blogData.readBlogs();
  blogs.push(Blog);
  blogData.saveBlogs(blogs);
  console.log("done");
  res.redirect('/admin');
})

app.get('/404', (req, res) => {
  res.render('404');
});
app.get('/post', (req, res) => {
  res.render('post');
});

app.listen(3000);