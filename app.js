const express = require('express');
const app = express();
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/code-review', { useMongoClient: true });
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const Schema = mongoose.Schema

const Comment = mongoose.model('Comment', {
    title: String,
    content: String,
    snippetId: { type: Schema.Types.ObjectId, ref: 'Snippet' }
  });

const Snippet = mongoose.model('Snippet', {
    title: String,
    description: String, 
  });  



  app.use(methodOverride('_method'))
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.set('view engine','handlebars');
  app.use(bodyParser.urlencoded({ extended: true }));


// TODO: Need to Add Comments and then do styling. 


  app.get('/', (req, res) => {
    Snippet.find()
     .then(snippet => {
         res.render('snippet-index', { snippet: snippet});
     })
     .catch(err => {
         console.log(err)
     })
   });

   app.get('/snippet/new', (req, res) => {
    res.render('snippet-new', {});
  });

  app.post('/snippet', (req, res) => {
    Snippet.create(req.body).then((snippet) =>{
        console.log(snippet);
        res.redirect(`/snippet/${snippet.id}`)
    }).catch((err) => {
        console.log(err.message);
    })
  });

   app.get('/snippet/:id', (req, res) => {
    Snippet.findById(req.params.id).then((snippet) => { 
        Comment.find({ snippetId: req.params.id }).then(comments => {
        res.render('snippets-show', { snippet: snippet, comments: comments })
      })
    }).catch((err) => {
        console.log(err.message);
    })
   });


   app.get('/snippet/:id/edit', function (req, res) {
    Snippet.findById(req.params.id, function(err, snippet) {
      res.render('snippet-edit', {snippet: snippet});
    })
  });


  app.put('/snippet/:id', (req, res) => {
    Snippet.findByIdAndUpdate(req.params.id, req.body)
      .then(snippet => {
        res.redirect(`/snippet/${snippet._id}`)
      })
      .catch(err => {
        console.log(err.message)
      })
  });

  app.delete('/snippet/:id', function (req, res) {
    console.log("DELETE Snippet")
    Snippet.findByIdAndRemove(req.params.id).then((snippet) => {
      res.redirect('/');
    }).catch((err) => {
      console.log(err.message);
    })
  })

  app.post('/snippet/comments', function(req,res) {
    console.log("BEER!!!s")
    console.log(req.body)
    Comment.create(req.body).then(comment => {
      console.log("In here")
      console.log(comment.snippetId)
      res.redirect(`/snippet/${comment.snippetId}`)
    }).catch((err) => {
      console.log("Hey")
      console.log(err.message)
    })
  })

  app.delete('/snippet/comments/:id', function (req, res) {
    console.log("DELETE comment")
    Comment.findByIdAndRemove(req.params.id).then((comment) => {
      console.log("Deleted")
      res.redirect(`/snippet/${comment.snippetId}`);
    }).catch((err) => {
      console.log(err.message);
    })
  })





var port = process.env.PORT || '3000';
app.listen(port)
