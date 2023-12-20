
const router = require('express').Router();
const Conversation = require('../db/conversationScema')

//add conversation
router.post('/', async (req, res) => {
    try {
        let conversation = await Conversation.find({ member: { $all: [req.body.senderId, req.body.receiverId] } });
        console.log(conversation);
        if (conversation.length == 0) {
            let response = new Conversation({ member: [req.body.senderId, req.body.receiverId] });
            let result = await response.save();
            res.status(200).json(result)
        } else {
            res.status(200).json('conversation allready exist')
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//get partcular conversation
router.get('/:userId', async (req, res) => {
    try {
        let response = await Conversation.find({ member: { $in: req.params.userId } });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    }
})

//get one conversation
router.get('/:firstUserId/:secondUserId', async (req, res) => {
    try {
        let response = await Conversation.findOne({
            member: { $all: [req.params.firstUserId, req.params.secondUserId] }
        });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;