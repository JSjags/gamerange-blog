const { Console } = require('console');
const express = require('express');

// file system
const fs = require('fs');

//invoking express
const app = express();

// for mongodb database
const mongoose = require('mongoose');

// cookie parser
const cookieParser = require('cookie-parser');

//jwt-json web token
const jwt = require('jsonwebtoken');

//custom blog model
const Blog = require('./models/blog');

//custom user model
const User = require('./models/user');

//environment variables
require('dotenv').config();

//host number
const host = '0.0.0.0';

//port number
const port = process.env.PORT || 3000;

//connect to mongoDB
const dbURI = process.env.MONGO_DB_URI;
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_SECRET = process.env.IGDB_SECRET;

// user schema error handler function
function errorHandler(err) {
  let errors = {
    username: "",
    email: "",
    password: ""
  }
  if(err.message === "Username not registered") {
    errors.username = "Username not registered";
  }
  if(err.message === "Password is incorrect") {
    errors.password = "Password is incorrect";
  }

  if(err.code === 11000) {
    const key = Object.keys(err.keyValue);
    errors[key] = `${key} ${err.keyValue[key]} already exists`
    return errors;
  }
  if(err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }
  return errors;
}

// variable holding cookie and jwt time
const maxAge =  60 * 60 * 24 * 3;

// jwt create token function
function createToken (id) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: maxAge
  })
}

// import requireAuth middleware function
const { requireAuth, checkUser } = require('./middlewares/authMiddleware')

mongoose.connect(dbURI)
.then((result) => {
  console.log("Connected to GameRange Database");
  app.listen(port, host, () => console.log(`listening on port ${port} and host ${host}`));
}).catch((err) => {
  console.log(err);
});

//template engine setup
app.set('view engine', 'ejs');

//static folder
app.use(express.static('public'));
app.use(express.urlencoded({ extended : false }));
app.use(express.json());
app.use(cookieParser());

//GET route handlers
app.get('*', checkUser)
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
  res.render('reviews', {title: 'Reviews Page', RAWG_API_KEY});
});
app.get('/videos', (req, res) => {
res.render('videos', {title: 'Videos Page', IGDB_CLIENT_ID, IGDB_SECRET});
});
app.get('/login', (req, res) => {
  res.render('login', {title: 'Login Page', RAWG_API_KEY})
})
app.get('/signup', (req, res) => {
  res.render('signup', {title: 'Signup Page', RAWG_API_KEY})
})
app.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
})
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id)
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })
    res.status(200).json({ user: user._id })
  } catch (error) {
    const errors = errorHandler(error)
    res.status(400).json({ errors })
  }
})
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // check if password and confirm password match
  if (req.body.password[0] !== req.body.password[1]) {
      res.status(401).json({
        password: "Passwords do not match"
      })
      return
    }
  // try to create user
  try {
    const user = await User.create({
      username,
      email,
      password: password[1]
    })
    const token = createToken(user._id)
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    })
    res.status(201).json({ user: user._id });
    console.log(user);

  } catch (error) {

      const errors = errorHandler(error)
      res.status(400).json({ errors });
  }
})
app.get('/create-blog', requireAuth, (req, res) => {
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