const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    hero: {
        type: [{
            filename: {
                type: String,
                required: true,
            },
            mimetype: {
                type: String,
                required: true
            },
            base64: {
                type: String,
                required: true
            }
        }]
    },
    snippet: {
        type: String,
        required: true
    },
    blogSect1: {
        type: String,
        required: true
    },
    bodyImages: {
        type: [{
            filename: {
                type: String,
                required: true,
            },
            mimetype: {
                type: String,
                required: true
            },
            base64: {
                type: String,
                required: true
            }
        }],
        required: true
    },
    blogSect2: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Blog = mongoose.model('Blogs', blogSchema);

module.exports = Blog;