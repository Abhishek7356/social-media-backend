
const router = require('express').Router();
const Messages = require('../db/messageSchema');

router.post('/', async (req, res) => {
    try {
        let response = new Messages(req.body);
        let result = await response.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err)
    }
});

//get partcular msgs
router.get('/:conversationId', async (req, res) => {
    try {
        let response = await Messages.find({ conversationId: req.params.conversationId });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err)
    }
});

//delete particular messages
router.delete('/delete/:conversationId', async (req, res) => {
    try {
        const deletedMsg = await Messages.deleteMany({ conversationId: req.params.conversationId });
        res.status(200).json("Message deleted successfully");
    } catch (err) {
        res.status(500).json("wrong");
    }
});


module.exports = router;