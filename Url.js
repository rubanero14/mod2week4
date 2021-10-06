const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
	originalUrl: String,
	shortUrl: Number
})

module.exports = mongoose.model('Url', UrlSchema);	