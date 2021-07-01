const express = require('express');
const app = express();
const PORT = 8797;
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
})


const middleware = require('./helper/authenMiddleware')
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('uploads'))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
app.use(allowCrossDomain);

io.on(("connection"), function (socket) {
    console.log('abc');
    socket.on('newPost', ({ title, imgVideo, described, like, comment, author, space }) => {
        io.emit('getPost', {
            title, imgVideo, described, like, comment, author, space
        })
    })

    socket.on('deletePost', (postID) => {
        io.emit('delete', postID)
    })
    socket.on('likePost', (_id) => {
        io.emit('like', _id)
    })
    socket.on('unLike', (_id) => {
        io.emit('unLikePost', _id)
    })
    socket.on('addComment', ({ content, author }) => {
        io.emit('addComment', {
            content, author
        })
    })
    socket.on('delComment', (_id) => {
        io.emit('delComment', _id)
    })
    //})
})

const UserRouter = require('./controller/userController')
const PostRouter = require('./controller/postController')
const authRouter = require('./controller/authController')
const CommentRounter = require('./controller/commentController')
const SpaceRouter = require('./controller/spaceController')
var mongoDB = 'mongodb+srv://Doanvu176:Doanvu176@cluster0.cy95w.mongodb.net/MinForum?retryWrites=true&w=majority';

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));    
//Ép Mongoose sử dụng thư viện promise toàn cục
mongoose.Promise = global.Promise;
//Lấy kết nối mặc định
var db = mongoose.connection;
app.use('/', authRouter)
app.use('/user',middleware.authenticateJWT ,UserRouter)
app.use('/post',middleware.authenticateJWT , PostRouter)
app.use('/comment', CommentRounter)
//app.use('/space', SpaceRouter)
app.use('/main', SpaceRouter )
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

http.listen(PORT, () => { console.log("Server started on http://localhost:" + PORT) })
module.exports = app;
