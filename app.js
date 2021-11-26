const { Console } = require('console');
const express = require('express');
// file system
const fs = require('fs');
//invoking express
const app = express();

// for mongodb database
const mongoose = require('mongoose');

// for passing file uploads
const multer = require('multer');

// invoking multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './my-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

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

//GET route handlers
app.get('/', (req, res) => {
  Blog.find()
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
app.get('/blogs', (req, res) => {
  res.render('blogs', {title: 'Blogs Page'});
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
app.post('/create-blog', upload.fields([{name: 'hero', maxCount: 1}, {name: 'body-images', maxCount: 3}]), (req, res, next) => {
  //poster image encoded
  let poster = req.files['hero'].map(file => {
    let img = fs.readFileSync(file.path);
    return encodeImage = img.toString('base64')
  })
  let finalPoster = poster.map((src, index) => {
    return {
      filename: req.files['hero'][index].originalname,
      mimetype: req.files['hero'][index].mimetype,
      base64: src
    }
  })

  //blog images encoded
  let blogImages = req.files['body-images'].map(file => {
    let img = fs.readFileSync(file.path);
    return encodeImage = img.toString('base64')
  })
  let finalBlogImages = blogImages.map((src, index) => {
    return {
          filename: req.files['body-images'][index].originalname,
          mimetype: req.files['body-images'][index].mimetype,
          base64: src
        }
  })

  const blog = new Blog({
    category: req.body.category,
    title: req.body.title,
    author: req.body.author,
    hero: finalPoster,
    snippet: req.body.snippet,
    blogSect1: req.body['blog-sect-1'],
    bodyImages: finalBlogImages,
    blogSect2: req.body['blog-sect-2']
  })
  blog.save()
    .then((result) => {
      console.log('upload to database successful');
      fs.rmdir('./my-uploads',() => {
        console.log('my-uploads folder deleted')
      });
      fs.mkdir('./my-uploads', (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('my-uploads folder created');
      })
      res.status(201).json({"message": "Blog Published"});
    })
    .catch((err) => console.log(err))
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
// app.listen(port, () => console.log(`GameRange listening on port ${port}!`))