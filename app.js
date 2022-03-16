const { Console } = require('console');
const express = require('express');

// axios
const axios = require('axios').default;

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

// CORS package
const cors = require('cors');

//custom blog model
const Blog = require('./models/blog');

//custom user model
const User = require('./models/user');

//environment variables invoked
require('dotenv').config();

//host number
const host = '0.0.0.0';

//port number
const port = process.env.PORT || 3000;

//env variables
const dbURI = process.env.MONGO_DB_URI;
const RAWG_API_KEY = process.env.RAWG_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const GIANT_BOMB_KEY = process.env.GIANT_BOMB_KEY;

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
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(express.json({limit: '50mb'}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(cookieParser());

//GET route handlers
app.get('*', checkUser)
app.get('/', async(req, res) => {
  const recentVideos = await axios({
      method: 'get',
      url: `https://www.giantbomb.com/api/videos/?api_key=${GIANT_BOMB_KEY}&format=json&sort=publish_date:desc&limit=10&offset=0&`,
      responseType: "json"
    })
    .then(function (response) {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })

  const recentGames = await axios({
      method: 'get',
      url: `https://api.rawg.io/api/games?ordering=-released&page=1&page_size=12&metacritic=60,99&key=${RAWG_API_KEY}`,
      responseType: "json"
    })
    .then(function (response) {
      return response.data
    })
    .catch(err => {
      console.log(err)
    })

  Blog.find().sort({ 'createdAt': -1 }).limit(6)
    .then((result) => {
      res.render('index', { title: 'Home Page', blogs: result, videos: recentVideos, games: recentGames, RAWG_API_KEY, GIANT_BOMB_KEY });
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
app.post('/blogs', async (req, res) => {
  const { search } = req.body;
  const { limit, page } =  req.query;
  console.log(limit, page)

  const result = await Blog.find( { 'title' : { '$regex' : search, '$options' : 'i' } }, {}, {limit: Number(limit), skip: Number(page * limit)} ).sort({ 'createdAt': -1 });
  const docCount = await Blog.countDocuments( { 'title' : { '$regex' : search, '$options' : 'i' } } );
  const pages = Math.ceil(docCount / limit);

  res.json({ result, count: docCount, pageIndex: Number(page), page: (Number(page) + 1), pages});
}); 
app.get('/blogs/category/xbox', async (req, res) => {
  const { limit, page } =  req.query;
  const xboxBlogs = await Blog.find({category: "Xbox"}, {}, {limit: Number(limit), skip: Number(page * limit)}).sort({ 'createdAt': -1 }).exec();
  
  const docCount = await Blog.countDocuments({category: "Xbox"}).sort({ 'createdAt': -1 });
  const pages = Math.ceil(docCount / limit);

  res.json({ data: xboxBlogs, count: docCount, pageIndex: Number(page), page: (Number(page) + 1), pages});
}) 
app.get('/blogs/category/playstation', async (req, res) => {
  const { limit, page } =  req.query;
  const psBlogs = await Blog.find({category: "Playstation"}, {}, {limit: Number(limit), skip: Number(page * limit)}).sort({ 'createdAt': -1 }).exec();
  
  const docCount = await Blog.countDocuments({category: "Playstation"}).sort({ 'createdAt': -1 });
  const pages = Math.ceil(docCount / limit);

  res.json({ data: psBlogs, count: docCount, pageIndex: Number(page), page: (Number(page) + 1), pages});
}) 
app.get('/blogs/category/nintendo', async (req, res) => {
  const { limit, page } =  req.query;
  const nintendoBlogs = await Blog.find({category: "Nintendo"}, {}, {limit: Number(limit), skip: Number(page * limit)}).sort({ 'createdAt': -1 }).exec();
  
  const docCount = await Blog.countDocuments({category: "Nintendo"}).sort({ 'createdAt': -1 });
  const pages = Math.ceil(docCount / limit);

  res.json({ data: nintendoBlogs, count: docCount, pageIndex: Number(page), page: (Number(page) + 1), pages});
}) 
app.get('/blogs/category/pc', async (req, res) => {
  const { limit, page } =  req.query;
  const pcBlogs = await Blog.find({category: "PC"}, {}, {limit: Number(limit), skip: Number(page * limit)}).sort({ 'createdAt': -1 }).exec();

  const docCount = await Blog.countDocuments({category: "PC"}).sort({ 'createdAt': -1 });
  const pages = Math.ceil(docCount / limit);

  res.json({ data: pcBlogs, count: docCount, pageIndex: Number(page), page: (Number(page) + 1), pages});
}) 
app.get('/blogs/category/allblogs', async (req, res) => {
  const { limit, page } =  req.query;
  const allBlogs = await Blog.find({},{}, {limit: Number(limit), skip: Number(page * limit)}).sort({ 'createdAt': -1 }).exec();
  
  const docCount = await Blog.countDocuments();
  const pages = Math.ceil(docCount / limit);

  res.json({ data: allBlogs, count: docCount, pageIndex: Number(page), page: (Number(page) + 1), pages});
}) 
app.get('/blogs/recent', (req, res) => {
  Blog.find().sort({ 'createdAt': -1 }).limit(5)
    .then(result => res.json(result))
    .catch(e => console.log(e))
});
app.get('/blogs/manage-blogs', requireAuth, (req, res) => {
  // res.json({message: "hello world"})
  res.render('manageBlogs', { title: 'Manage Blogs'});
})
app.put('/blogs/manage-blogs/:id', requireAuth, async (req, res) => {
  const id = req.params.id
  const response = await Blog.findOneAndUpdate({ _id : id }, req.body)
  res.json(response)
})
app.delete('/blogs/manage-blogs/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const response = await Blog.findOneAndDelete({ _id : id })
  res.json(response);
})
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
res.render('videos', {title: 'Videos Page', GIANT_BOMB_KEY});
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
app.get('/user/profile', requireAuth, (req, res) => {
  res.render('profile', {title: 'Profile'});
});
app.put('/user/profile/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const update = JSON.parse(JSON.stringify(req.body));
  const data = await User.findByIdAndUpdate({ _id : id }, update)

  if (update.profile_pic) {
    User.updateOne(
      { _id : id },
      { $set: { profile_pic: update.profile_pic}},{upsert:true})
    //   .then((result, err) => {
    //      return res.json({ data: result, message:"Profile Updated Successfully" });
    //  })
  }
  res.json({ data: data, message:"Profile Updated Successfully" });
});
app.get('/create-blog', requireAuth, (req, res) => {
  res.render('blog-creator', {title: 'Blog Creator'});
});
app.post('/create-blog/publish', requireAuth, (req, res) => {

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

app.use((req, res) => {
  res.status(404).render("404", {title: '404 Page Not Found'});
});