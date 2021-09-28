//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true

}));
app.use(express.static("public"));


// Connect a new database(local)
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true, useUnifiedTopology: true });

// post schema
const articleSchema = {
    title: String,
    content: String
}

// model (makes articles collection)
const Article = mongoose.model("Article", articleSchema)

// Route chaining
// app.route(route).get(callback).post(callback).delete(callback);
// *** callback == function(req,res){}

app.route("/articles")
    // FETCHES(GET) all the articles
    .get(function(req,res){
        // leaving the {conditions} empty will return all the entries in the collection
        Article.find({},function(err, foundArticles){
            if(!err){
                // sends back the JSON objects that were found
                // unlike with forms we use res to retrieve the results
                res.send(foundArticles)
            }else{
                res.send(err)
            }
        })
    })
    // CREATES(POST) one new variable
    // Using Postman App
    .post(function(req,res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save(function(err){
            if(!err){
                res.send("Successfully added article")
            }else{
                res.send(err)
            }
        });
    
    })
    // DELETES(DELETE) all the articles
    .delete(function(req,res){
        Article.deleteMany({}, function(err){
            if(!err){
                res.send("Successfully deleted Article collections")
            }else{
                res.send(err)
            }
        });
    });

// route chaining with route parameters
app.route("/articles/:articleTitle")
    // FETCHES(GET) the article on "articleTitle"
    .get(function(req,res){
        Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
            if(!err){
                res.send(foundArticle)
            }else{
                res.send(err)
            }
        })
    })
    // UPDATES(PUT) the entire article on "articleTitle"
    // using Postman App
    // will UPDATE THE ENTIRE article and any fields not requested to 
    // be changed will be erased!!
    .put(function(req,res){
        // check mongoose documentation for .updateOne()
        Article.updateOne(
            {title:req.params.articleTitle},
            {title:req.body.title, content:req.body.content},
            // .updateOne() callback function also has second parameter which
            // returns an object that states whether it was updated
            function(err){
                if(!err){
                    res.send("Successfully updated article")
                }else{
                    res.send(err)
                }
            });
    })
    // UPDATES(PATCH) a particular part of the article on "articleTitle"
    // using Postman App
    // Updates ONLY THE REQUESTED FIELDS and leaving the others 
    // untouched and retaining their original values
    .patch(function(req,res){
        // $set: will only update the ones that are requested
        // i.e. {$set: {title:example} }
        // by using {$set:req.body} in conjunction with body-parser
        // this will update all the parameters that have been requested
        // to be updated(DYNAMICALLY)
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated article");
                }else{
                    res.send(err)
                }
            });
    })
    .delete(function(req,res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted article")
                }else{
                    res.send(err)
                }
            })
    })



app.listen(3000, function() {
  console.log("Server started on port 3000");
});