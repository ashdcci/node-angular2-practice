var express = require('express')
var router = express.Router()
var mongojs = require('mongojs')
var crypto  = require('crypto')
db = require('../config/db');

// router.use('*',function(req, res, next){
//   res.status(404).json({'status':0,'error':'Url not found'})
//   return
// })

/**
 * methods for hybrid schema start
 */

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

  comment_id = (req.body.comment_id!="") ? req.body.comment_id : 0

  if(comment_id != 0){
    console.log(comment_id)

    db.user_posts.find({'comments._id':mongojs.ObjectId(req.body.comment_id)},{comments:{$slice: [1,1]}},function(err, result){
      if(err){
        res.status(500).send(err)
      }
      res.status(200).json(result)
    })

    return




    db.user_posts.update({
      _id: mongojs.ObjectId(req.body.post_id),
      "comments._id":mongojs.ObjectId(req.body.comment_id),
      // "comments._id": mongojs.ObjectId('5984496416d24152cfe64d7c')
    }, {$push: {'comments.$.child_comment':{
                          'user':req.body.user_id,
                          '_id': mongojs.ObjectId(),
                          'message':req.body.message,
                          'dateCreated': new Date(),
                          'like': 0,
                          'child_comment':[]
                        }
               }
      } , function(err, result){
      if(err){
        res.status(500).send(err)
      }
      res.status(200).json(result)
      return
    })

  }else{
    db.user_posts.update({
      _id: mongojs.ObjectId(req.body.post_id)
    }, {$push: {'comments':{
                          'user':req.body.user_id,
                          '_id': mongojs.ObjectId(),
                          'message':req.body.message,
                          'dateCreated': new Date(),
                          'like': 0,
                          'child_comment':[]
                        }
                      }
      } , function(err, result){
      if(err){
        res.status(500).send(err)
      }
      res.status(200).json(result)
      return
    })
  }




})


router.get('/lists',function(req, res, next){
  db.user_posts.find({},{comments:{$slice: [1,900]}},function(err, results){
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

router.delete('/delete-comment',function(req, res, next){

  if(!req.body.user_id || !req.body.post_id || !req.body.comment_id){
    res.status(400).json({'status':0,'msg':'unauthorise access'})
    return
  }

  db.user_posts.update({ _id: mongojs.ObjectId(req.body.post_id),
                        "comments._id":mongojs.ObjectId(req.body.comment_id) },
                        {$pull: {comments: {_id: mongojs.ObjectId(req.body.comment_id)}}}
                        ,function(err, result){
                          if(err){
                            res.status(500).send(err)
                          }
                          res.status(200).json(result)
                          return

                          })
})


router.delete('/delete-post',function(req, res, next){
    if(!req.body.user_id || !req.body.post_id){
      res.status(400).json({'status':0,'msg':'unauthorise access'})
      return
    }

    db.user_posts.remove({_id: mongojs.ObjectId(req.body.post_id)},function(err, result){
      if(err){
        res.status(500).send(err)
      }
      res.status(200).json(result)
      return
    })
})



/**
 * methods for non hybrid schema operations
 */

router.post('/add-post',function(req, res, next){

  if(!req.body.user_id){
    res.status(400).json({'status':0,'msg':'unauthorise access'})
    return
  }

  tomodel = {}
  tomodel.title = ( typeof req.body.title !== 'undefined' ) ? req.body.title :  ''
  tomodel.description = ( typeof req.body.description !== 'undefined' ) ? req.body.description :  ''
  tomodel.by = req.body.user_id
  tomodel.created_at = new Date()

  db.posts.save({
    'title': tomodel.title,
    'description': tomodel.description,
    'uid': mongojs.ObjectId(tomodel.by),
    'created_at': tomodel.created_at,
    'likes':[]
  },function(err, result){
    if(err){
      res.status(500).send(err)
    }
    res.status(200).json(result)
    return
  })
})


router.put('/update-post',function(req, res, next){

  if(!req.body.user_id || !req.body.post_id){
    res.status(400).json({'status':0,'msg':'unauthorise access'})
    return
  }

  tomodel = {}
  tomodel.title = ( typeof req.body.title !== 'undefined' ) ? req.body.title :  ''
  tomodel.description = ( typeof req.body.description !== 'undefined' ) ? req.body.description :  ''
  tomodel.by = req.body.user_id
  tomodel.created_at = new Date()

  db.posts.update({'_id':mongojs.ObjectId(req.body.post_id),'uid':mongojs.ObjectId(req.body.user_id) },{
    $set:{
      'title': tomodel.title,
      'description': tomodel.description,
      'updated_at': new Date()
    }
  },function(err, result){
    if(err){
      res.status(500).send(err)
    }
    res.status(200).json(result)
    return
  })
})


router.post('/add-comment',function(req, res, next){
  if(!req.body.user_id || !req.body.post_id){
    res.status(400).json({'status':0,'msg':'unauthorise access'})
    return
  }

  tomodel = {}
  tomodel.message = ( typeof req.body.message !== 'undefined' ) ? req.body.message :  ''
  tomodel.by = mongojs.ObjectId(req.body.user_id)
  tomodel.post_id = mongojs.ObjectId(req.body.post_id)
  tomodel.created_at = new Date()

  db.comments.save({
    'comment': tomodel.message,
    'uid': tomodel.by,
    'post_id': tomodel.post_id,
    'created_at': tomodel.created_at
  },function(err, result){
    if(err){
      res.status(500).send(err)
    }
    res.status(200).json(result)
    return
  })


})

router.get('/fetch-post/:post_id/:page',function(req, res, next){


  if(!req.params.post_id){
    res.status(400).json({'status':0,'msg':'unauthorise access'})
    return
  }

  limiter = parseInt(req.params.page)
  db.posts.findOne({'_id': mongojs.ObjectId(req.params.post_id)},function(err, result){
    if(err){
      res.status(500).send(err)
    }
    comments = []
    result.comments = []


    db.comments.find({'post_id':req.params.post_id}).limit(10).skip(limiter,function(err1, res1){
      if(err1){
        res.status(500).send(err1)
      }
          result.comments = res1
          res.status(200).json(result)
    })


  })


})


router.get('/fetch-all-post/:page',function(req, res, next){

  limiter = ( typeof req.params.page !== 'undefined' ) ? parseInt(req.params.page) : 0

  user_post = []


  db.posts.find({},function(err,post){
    if(err){
      res.status(500).send(err)
      return
    }
    res.json(post)
  })
  return

  // db.ships.aggregate([{$project : {_id : 0, operator : {$toLower : "$operator"},crew : {"$multiply" : ["$crew",10]}}},
  //                     {$group : {_id : "$operator", num_ships : {$sum : "$crew"}}}])

  db.posts.aggregate([
    {
      "$lookup": {
        "from": "comments",
        "localField": "_id",
        "foreignField": "post_id",
        "as": "comment"
      }

    },
    {
      $project: {
        _id: "$_id",
        title: "$title",
        num_likes: {$size:"$likes"},
        likes: "$likes",
        created_at: "$created_at",
        num_comment: 0,
        comment: {$slice:["$comment",10]},
      }
    }
  ]).limit(10).skip(limiter,function(err, post){
    if(err){
      res.status(500).send(err)
      return
    }
    res.json(post)
  })


  return

  db.posts.aggregate([

    {
      "$lookup": {
        "from": "comments",
        "localField": "_id",
        "foreignField": "post_id",
        "as": "comment"
      }

    },
    {
        "$match": {
            "comment": {
                "$exists": true
            }
        }
    },
    //  { $group: { _id: null, count: { $sum: 1 } } },
    {

    "$project": {
        "title":"$title",

        "comment": {
          // "likes": "$comment.likes",
          // "like_count": {$size: "$comment.likes"},
          // "count": {
          //     "$size": { "$ifNull": [ "$comment.likes", [] ] }
          //   },
          "$slice": ["$comment", 10],
        },
        "comment_count": {$size: "$comment"}
    }
    }

    // {"$unwind": "$comment"}
  ]).limit(10).skip(limiter,function(err, post){
    if(err){
      res.status(500).send(err)
      return
    }
    res.json(post)
  })
  return




})

router.put('/like_comment',function(req, res, next){
  if(!req.body.post_id || !req.body.comment_id || !req.body.user_id){
    res.status(400).send('not authenticate to like comment')
  }

  query = ( typeof req.body.check !== 'undefined' && req.body.check == 1 ) ? {$addToSet: {'likes':req.body.user_id}} :  {$pull: {'likes':req.body.user_id}}


  db.comments.update({'_id':mongojs.ObjectId(req.body.comment_id),'post_id':mongojs.ObjectId(req.body.post_id)},query,function(err,result){
    if(err){
      res.status(500).send(err)
      return
    }
    res.json(result)
  })

  return

})


router.put('/like_post',function(req, res, next){
  if(!req.body.post_id || !req.body.user_id){
    res.status(400).json({'status':0,'msg':'not authenticate to like comment'})
    return
  }

  query = ( typeof req.body.check !== 'undefined' && req.body.check == 1 ) ? {$addToSet: {'likes':req.body.user_id}} :  {$pull: {'likes':req.body.user_id}}


  db.posts.update({'_id':mongojs.ObjectId(req.body.post_id)},query,function(err,result){
    if(err){
      res.status(500).send(err)
      return
    }
    res.json(result)
  })

  return
})



module.exports = router
