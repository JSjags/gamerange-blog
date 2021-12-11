const { Console } = require('console');
const express = require('express');
// file system
const fs = require('fs');
//invoking express
const app = express();

// for mongodb database
const mongoose = require('mongoose');

//custom blog model
const Blog = require('./models/blog');

//port number
const port = 3000;

//connect to mongoDB
const dbURI = 'mongodb+srv://Jesse:jesjags01@gamerange.q8pni.mongodb.net/GameRange?retryWrites=true&w=majority';
mongoose.connect(dbURI)
.then((result) => {
  console.log("Connected to GameRange Database");
  app.listen(port, () => console.log(`GameRange listening on port ${port}!`));
}).catch((err) => {
  console.log(err);
});

//template engine setup
app.set('view engine', 'ejs');

//static folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended : false }));
app.use(express.json());

//GET route handlers
app.get('/', (req, res) => {
  Blog.find().sort({ 'createdAt': -1 }).limit(6)
    .then((result) => {
      res.render('index', {title: 'Home Page', blogs: result});
    })
    .catch((err) => {
      console.log(err);
    })
});
app.get('/home', (req, res) => {
  res.redirect('/');
});
app.get('/about', (req, res) => {
  res.render('about', {title: 'About Page'});
});
app.get('/blogs', async (req, res) => {
  // const blogs = await Blog.find().sort({ 'createdAt': -1 })
  res.render('blogs', { title: 'Blogs Page',});
});
app.get('/blogs/category/xbox', async (req, res) => {
  const xboxBlogs = await Blog.find({category: "Xbox"}).sort({ 'createdAt': -1 }).exec();
  res.json(xboxBlogs);
}) 
app.get('/blogs/category/playstation', async (req, res) => {
  const psBlogs = await Blog.find({category: "Playstation"}).sort({ 'createdAt': -1 }).exec();
  res.json(psBlogs);
}) 
app.get('/blogs/category/nintendo', async (req, res) => {
  const nintendoBlogs = await Blog.find({category: "Nintendo"}).sort({ 'createdAt': -1 }).exec();
  res.json(nintendoBlogs);
}) 
app.get('/blogs/category/pc', async (req, res) => {
  const nintendoBlogs = await Blog.find({category: "PC"}).sort({ 'createdAt': -1 }).exec();
  res.json(nintendoBlogs);
}) 
app.get('/blogs/category/allblogs', async (req, res) => {
  const xboxBlogs = await Blog.find().sort({ 'createdAt': -1 }).exec();
  res.json(xboxBlogs);
}) 
app.get('/blogs/recent', (req, res) => {
  Blog.find().sort({ 'createdAt': -1 }).limit(5)
    .then(result => res.json(result))
    .catch(e => console.log(e))
});
app.get('/blogs/:id', (req, res) => {
  const _id = req.params.id;
  Blog.findById(_id)
    .then(result => {
      const title = result.title;
      res.render('details', { title: title, blog: result})
    })
    .catch(e => res.send(e))
});
app.get('/reviews', (req, res) => {
  res.render('reviews', {title: 'Reviews Page'});
});
app.get('/videos', (req, res) => {
res.render('videos', {title: 'Videos Page'});
});
app.get('/create-blog', (req, res) => {
  res.render('blog-creator', {title: 'Blog Creator'});
});
app.post('/create-blog/publish', (req, res) => {

  let re = new RegExp('blogImage', 'gi')
  const blogImageUrlsKeys = [];
  const blogImageUrls = [];
  Object.keys(req.body).forEach(item => item.match(re) && blogImageUrlsKeys.push(item) );
  blogImageUrlsKeys.forEach(key => blogImageUrls.push(req.body[key]));

  //Creating a new blog with defined blog schema

  const blog = new Blog({
    category: req.body.category,
    title: req.body.title,
    author: req.body.author,
    hero: req.body.hero,
    snippet: req.body.snippet,
    blogSect1: req.body.blogSect1,
    bodyImages: [...blogImageUrls],
    blogSect2: req.body.blogSect2,
    closingRemark: req.body.closingRemark,
    tags: req.body.tags
  });
  
  //saving blog document to blogs collection to database
  blog.save()
    .then((result) => {
      console.log("blog document saved");
      res.status(201).render("published", {title: "Blog Published", blogDets: result});
    })
    .catch((err) => console.log(err));
});
app.get('/blogs/delete-blog', (req, res) => {
  // Blog.find()
  // .then((result) => {
  //   const blogs = result;
  //   res.render('deleteBlog', { title: 'Delete Blogs', blogs});
  // })
  // .catch((err) => {
  //   console.log(err);
  // })
  res.render('deleteBlog', { title: 'Delete Blogs'});
})
app.use((req, res) => {
  res.status(404).render("404", {title: '404 Page Not Found'});
});