const router = require('express').Router();
const { Thought, User } = require('../../models');


// get all thoughts
router.get('/', (req, res)=>{
    Thought.find({})
        .select('-__v')
        .then(data => res.json(data))
        .catch(err => res.sendStatus(500))
});

// get single thought
router.get('/:id', (req,res)=>{
    Thought.findOne({_id: req.params.id})
        .populate('reactions')
        .then(data => (!data)? res.status(404).json({ message: 'No thought found with this id!' }) : res.json(data))
        .catch(err => res.sendStatus(500))
})

// create a thought
router.post('/:uid', (req,res) => {
    Thought.create(req.body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: req.params.uid},
                {push: {thoughts: _id}}, {new: true}
            );
        })
        .then(data => (!data)? res.status(404).json({ message: 'No user found with this id!' }) : res.json({ message: 'Thought added!' }))
        .catch(err => res.sendStatus(500))
})

// add thought
router.put('/:id', (req,res) => {
    Thought.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators:true})
    .then(data => (!data)? res.status(404).json({ message: 'No thought found with this id!' }) : res.json(data))
    .catch(err => res.sendStatus(500))
})

// remove thought
router.delete('/:id', (req,res) => {
    Thought.findOneAndDelete ({_id:req.params.id})
    .then(data => {
        if (!data) return res.status(404).json({ message:  'No thought found with this id!'})
        return User.findOneAndUpdate(
            {thoughts:req.params.id},
            {$pull: {thoughts: req.params.id}}, {new: true}
        )
    })
    .catch(err => res.sendStatus(500))
})

module.exports = router;