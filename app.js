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

const upload= multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // limiting the size to 5mb
  }
});

app.set('views', path.join(__dirname,"views"));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded ({extended: false}))

app.get('/', (req, res) => {
const storedBlogs = blogData.readBlogs();

//getting the query parameters from the incoming request url
const page = parseInt(req.query.page) || 1;
const search = req.query.search || '';
const category = req.query.category || 'All';
const postsPerPage = 6;

let filteredBlogs = storedBlogs;

if(search) {
  filteredBlogs = filteredBlogs.filter(blog => 
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.content.toLowerCase().includes(search.toLowerCase())
  );
}

if(category && category !== 'All') {
  filteredBlogs= filteredBlogs.filter(blog => 
    blog.category.toLowerCase() === category.toLowerCase()
  );
}
//variables that will be used to calculate the pagination
const totalBlogs = filteredBlogs.length;
const totalPages = Math.ceil(totalBlogs / postsPerPage);
const startIndex = (page - 1) * postsPerPage;
const endIndex = startIndex + postsPerPage;
const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);


  res.render('index', {totalBlogs: totalBlogs, blogs: paginatedBlogs, currentPage: page, totalPages: totalPages, searchQuery: search, selectedCategory: category});
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

app.post('/post/:id/like', (req, res) => {
  const { id } = req.params;
  const { liked } = req.body;
  
  const blogs = blogData.readBlogs();
  const blog = blogs.find(b => b.id === id);
  
  if (blog) {
    blog.likes = blog.likes || 0;
    blog.likes += liked ? 1 : -1;
    blogData.saveBlogs(blogs);
    res.json({ success: true, likes: blog.likes });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Add comment
app.post('/post/:id/comment', (req, res) => {
  const { id } = req.params;
  const { name, email, comment } = req.body;
  
  const blogs = blogData.readBlogs();
  const blog = blogs.find(b => b.id === id);
  
  if (blog) {
    blog.comments = blog.comments || [];
    blog.comments.push({
      id: uuid.v4(),
      name,
      email,
      text: comment,
      createdAt: new Date().toISOString()
    });
    blogData.saveBlogs(blogs);
    res.redirect(`/post/${id}#comments`);
  } else {
    res.status(404).render('404');
  }
});

app.get('/post/:id', (req, res) => {
  const storedBlogs = blogData.readBlogs();
  const blog = storedBlogs.find(b => b.id === req.params.id);
  
  if (blog) {
    res.render('post', { blog });
  } else {
    res.status(404).render('404');
  }
});

app.listen(3000);