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

module.exports = router;