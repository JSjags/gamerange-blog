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
        type: String,
        required: true
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
        type: [String],
    },
    blogSect2: {
        type: String,
        required: true
    },
    closingRemark: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    }
}, {timestamps: true});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;