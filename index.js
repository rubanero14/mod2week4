const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Url = require('./Url');

mongoose.connect('mongodb+srv://api-user:abcd1234@cluster0.lxbfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

const port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req,res){
	res.json({message:"Welcome to my REST API!"})
})

router.get('/new/:url(*)', function(req, res){
	//check in database if the data exist or not (use Url.findOne)
	Url.findOne({originalUrl:req.params.url}, function(err, url){
		if(err){
			res.send(err);
		} else {
			if(url) {
				res.json({original_url: url.originalUrl, short_url: url.shortUrl});
			} else {
				Url.count(function(err,count){
					if(err){
						res.send(err);
					} else {
						var url = new Url();
						url.originalUrl = req.params.url;
						url.shortUrl = count+1;
						url.save(function(err){
							if(err){
								res.send(err);
							} else {
								res.json({original_url: url.originalUrl, short_url: url.shortUrl});
							}
						})
					}
				})
			}
		}
	})
});

router.get('/:url', function(req,res){
	//1)search for the id
	//2)redirect to the given url

	Url.findOne({shortUrl:req.params.url}, function(err,url){
		if(err){
			res.send(err);
		} else {
			//redirect user to original url
			res.redirect(url.originalUrl);
		}
	})
})

app.use('/', router);

app.listen(port);
console.log("Application is running on port "+port);