var express = require('express')
var router = express.Router()
var mongojs = require('mongojs')
var crypto  = require('crypto')
db = require('../config/db');

// router.use('*',function(req, res, next){
//   res.status(404).json({'status':0,'error':'Url not found'})
//   return
// })

router.post('/create',function(req, res, next){



  db.user_posts.save({
    'title':req.body.title,
    'description': req.body.description,
    'by': req.body.added_by,
    'comments': []

  },function(err, results){
      if(err){
        res.status(500).send(err)
      }

      res.status(200).json(results)
      return
  })



})


router.post('/comment',function(req, res, next){
  if(!req.body.user_id || !req.body.post_id){
    res.status(400).json({'status':0,'msg':'unauthorise access'})
    return
  }

  var comment = {};
  comment.user = req.body.user_id
  comment._id =  mongojs.ObjectId()
  comment.message =  req.body.message
  comment.dateCreated = new Date()
  comment.like = 0
  console.log(comment,req.body.post_id)

  db.user_posts.update({
    _id: mongojs.ObjectId(req.body.post_id)
  }, {$push: {'comments':{
                        'user':req.body.user_id,
                        '_id': mongojs.ObjectId(),
                        'message':req.body.message,
                        'dateCreated': new Date(),
                        'like': 0
                      }
                    }
    } , function(err, result){
    if(err){
      res.status(500).send(err)
    }
    res.status(200).json(result)
    return
  })


})


router.get('/lists',function(req, res, next){
  db.user_posts.find({},{comments:{$slice: [1,2]}},function(err, results){
      if(err){
        res.status(500).send(err)
      }
      res.status(200).json(results)
      return
  })




})

router.put('/like-post',function(req, res, next){
  if(!req.body.user_id || !req.body.post_id || !req.body.like_state){
    res.status(400).json({'status':0,'msg':'unauthorise access'})
    return
  }

  like_state = (req.body.like_state == 0) ? -1 : 1;

  db.user_posts.findAndModify({
    query: { _id: mongojs.ObjectId(req.body.post_id) },
    update: { $inc: { like_count: like_state } }
  },function(err, result){
    if(err){
      res.status(500).send(err)
    }
    res.status(200).json(result)
    return
  })


})

router.put('/like-comment',function(req, res, next){
  if(!req.body.user_id || !req.body.post_id || !req.body.like_state || !req.body.comment_id){
    res.status(400).json({'status':0,'msg':'unauthorise access'})
    return
  }

  like_state = (req.body.like_state == 0) ? -1 : 1;

  db.user_posts.update({ _id: mongojs.ObjectId(req.body.post_id),"comments._id":mongojs.ObjectId(req.body.comment_id)   },
    { $inc: { "comments.$.like": like_state } },function(err, result){
    if(err){
      res.status(500).send(err)
    }
    res.status(200).json(result)
    return
  })


})




module.exports = router
