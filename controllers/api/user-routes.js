const { userInfo } = require('os');

const router = require('express').Router();
const { User , Thought } = require('../../models');

// get all user
router.get('/', (req, res)=>{
    User.find({})
        .select('-__v')
        .then(data => res.json(data))
        .catch(err => res.sendStatus(500))
});

// get single user
router.get('/:id', (req,res)=>{
    User.findOne({_id: req.params.id})
        .populate('friends')
        .populate('thoughts')
        .then(data => (!data)? res.status(404).json({ message: 'No user found with this id!' }) : res.json(data))
        .catch(err => res.sendStatus(500))
})

// add user
router.post('/', (req,res)=>{
    User.create(req.body)
        .then(data => res.json(data))
        .catch(err => {
            if (err.code === 11000){
                // Mongo return error with codes, 11000 is duplicated keys error
                if (Object.keys(err.keyPattern)[0]==='username') res.status(400).json({ message:  'Username already existed'})
                else res.status(400).json({ message:  'Email is already been used'});
                return;
            }
            res.sendStatus(500);
        })
})

// update user
router.put('/:id', (req,res) => {
    User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators:true})
    .then(data => (!data)? res.status(404).json({ message: 'No user found with this id!' }) : res.json(data))
    .catch(err => {
        if (err.code === 11000){
            // Mongo return error with codes, 11000 is duplicated keys error
            if (Object.keys(err.keyPattern)[0]==='username') res.status(400).json({ message:  'Username already existed'})
            else res.status(400).json({ message:  'Email is already been used'});
            return;
        }
        res.sendStatus(500);
    })
})

// remove user
router.delete('/:id', (req,res) => {
    User.findOneAndDelete ({_id:req.params.id})
    .then(data => (!data)? res.status(404).json({ message: 'No user found with this id!' }) : res.json(data))
    .catch(err => res.sendStatus(500))
})

// add friend
router.post('/:id/friends/:fid', (req,res) => {
    // first find if the friend id exist
    User.findOne({_id: req.params.fid})
        .then(data =>{
            if (!data) {
                res.status(404).json({ message: 'No friend found with this id!' })
                return;
            }
            // then find and add friend to user
            User.findOneAndUpdate({_id: req.params.id}, { $addToSet: {friends: req.params.fid}} , {new: true})
            .then(data => (!data)? res.status(404).json({ message: 'No user found with this id!' }) : res.json(data))
        })
        .catch(err => res.sendStatus(500))
});

// remove friend
router.delete('/:id/friends/:fid', (req,res) => {
    // first find if the friend id exist
    User.findOne({_id: req.params.fid})
        .then(data =>{
            if (!data) {
                res.status(404).json({ message: 'No friend found with this id!' })
                return;
            }
            // then find and add friend to user
            User.findOneAndUpdate({_id: req.params.id}, { $pull: {friends: req.params.fid}} , {new: true})
            .then(data => (!data)? res.status(404).json({ message: 'No user found with this id!' }) : res.json(data))
        })
        .catch(err => res.sendStatus(500))
})

module.exports = router;