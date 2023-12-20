
const express = require('express');
const User = require('./db/user');
const Post = require('./db/post');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('./db/config');
const ConversationRoutes = require('./routes/conversation');
const messageRoutes = require('./routes/message');
const app = express();

app.use(express.json())
app.use(cors());
app.use('/conversation', ConversationRoutes);
app.use('/message', messageRoutes);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '_' + Date.now())
    }
});

const upload = multer({ storage });

app.use('/images', express.static(path.join(__dirname, 'public/images')));

//add post 
app.post('/uploadfile', upload.single("file"), async (req, res) => {
    try {
        const caption = req.body.caption;
        const image = req.file.filename;
        const userId = req.body.userId;

        const postDetails = { caption, image, userId };
        let response = new Post(postDetails);
        let result = await response.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err)
    }
})

//get all post
app.get('/all-post', async (req, res) => {
    try {
        let post = await Post.find();
        res.status(200).send(post);
    } catch (err) {
        res.status(500).json(err)
    }
});

//get user posts
app.get('/current-user-post/:userId', async (req, res) => {
    try {
        let currentUserPost = await Post.find({ userId: req.params.userId });
        res.status(200).json(currentUserPost)
    } catch (err) {
        res.status(500).json(err)
    }
});

//update post
app.put('/postlikes/:postId', async (req, res) => {
    try {
        let currentPost = await Post.findById(req.params.postId);
        if (!currentPost.likes.includes(req.body.userId)) {
            let response = await Post.updateOne({ _id: req.params.postId }, { $push: { likes: req.body.userId } });
            res.status(200).json(response);
        } else {
            let response = await Post.updateOne({ _id: req.params.postId }, { $pull: { likes: req.body.userId } });
            res.status(200).json(response);
        }
    } catch (err) {
        res.status(500).json(err)
    }
})





//get one user
app.get('/get-user', async (req, res) => {
    try {
        let username = req.query.username;
        let userId = req.query.userId;
        let user = username ? await User.find({ username: username }) : await User.findById(userId);
        res.status(200).send(user)
    } catch (err) {
        res.status(500).json(err)
    }
});

//get all user
app.get('/get-alluser', async (req, res) => {
    try {
        let allUsers = await User.find();
        res.status(200).json(allUsers)
    } catch (err) {
        res.status(500).json(err)
    }
});

//user login
app.post('/login', async (req, res) => {
    console.log(req.body)
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user.password == req.body.password) {
                res.status(200).json(user)
            } else {
                res.status(501).json("Incorrect Password !")
            }
        } else {
            res.status(502).json('User not found')
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

//add user
app.post('/register', async (req, res) => {
    try {
        let registerUser = new User(req.body);
        let result = await registerUser.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err)
    }
})


//user particular update
app.put('/follows/:userId', async (req, res) => {
    try {
        let user = await User.findById(req.params.userId);
        if (user.followers.includes(req.body.userId)) {
            let response = await User.updateOne({ _id: req.params.userId }, {
                $pull: { followers: req.body.userId }
            });
            let followingResp = await User.updateOne({ _id: req.body.userId }, {
                $pull: { followings: req.params.userId }
            });
            res.status(200).json('Remove from followers')
        } else {
            let response = await User.updateOne({ _id: req.params.userId }, {
                $push: { followers: req.body.userId }
            });
            let followingResp = await User.updateOne({ _id: req.body.userId }, {
                $push: { followings: req.params.userId }
            });
            res.status(200).json('added to followers')
        }
    } catch (err) {
        res.status(500).json(err)
    }
});

//user particular update
app.put('/uploadProfilePicture/:userId', upload.single("file"), async (req, res) => {
    try {
        let response = await User.updateOne({ _id: req.params.userId }, { $set: { profile_picture: req.file.filename } });
        res.status(200).json(req.file.filename)
    } catch (err) {
        res.status(500).json(err);
    }
})

app.listen(4000, () => {
    console.log('server started');
});

//update user with file
app.put("/update/user/:id", upload.single("file"), async (req, res) => {
    // console.log("inside userUpdate");
    // console.log(req.body)
    // console.log(req.params.id)
    // console.log(req.file.filename);
    const { cover_picture, ...others } = req.body;
    // console.log(others)

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: { ...others, cover_picture: req.file.filename } })
        res.status(200).json(updateUser)
    } catch (err) {
        res.status(500).json(err)
    }
});

//update user without file
app.put('/api/user/:id', async (req, res) => {
    console.log(req.body)
    console.log(req.params.id)
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updateUser)
    } catch (err) {
        res.status(500).json(err)
    }
})