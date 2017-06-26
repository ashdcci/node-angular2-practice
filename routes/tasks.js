var express = require('express')
var router = express.Router()
var mongojs = require('mongojs')
var db = mongojs('mongodb://root:core2duo@ds111622.mlab.com:11622/shared_test', ['tasks'])

// get all tasks
router.get('/tasks',function(req, res, next){
  db.tasks.find(function(err, results){
  	if(err){
  		res.send(err)
  	}
  	res.json(results)
  	return
  })
  return
})


// get single tasks
router.get('/task/:id',function(req, res, next){
	db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)},function(err,result){
		if(err){
			res.send(err)
		}
		res.json(result)
	})
	return
})

//Save Task
router.post('/task', function(req, res, next){
    var task = req.body;
    console.log(req.body);
    if(!task.title || !(task.isDone + '')){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.tasks.save(task, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }
});


// delete task
router.delete('/task/:id',function(req, res, next){
	db.tasks.remove({_id: mongojs.ObjectId(req.params.id)},function(err,result){
		if(err){
			res.send(err)
		}
		res.json(result)
	})
	return
})

// update task

router.put('/task/:id',function(req, res, next){

	var task = req.body
	var updTask = {}

	if(task.isDone){
		updTask.isDone = task.isDone
	}

	if(task.title){
		updTask.title = task.title
	}

	if(!updTask){
		res.status(400).json({
			'error':'bad data'
		})
	}

	db.tasks.update({_id: mongojs.ObjectId(req.params.id)},updTask,{},function(err,result){
		if(err){
			res.send(err)
		}
		res.json(result)
	})
	return
})



module.exports = router