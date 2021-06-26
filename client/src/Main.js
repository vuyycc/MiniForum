import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import { deletePost, getAllPost, getSpace, newPOst, getPostBySpace } from './axios'
import io from 'socket.io-client'
import Footer from './pages/footer'
import './css/homscreen.css'

const socket = io('http://localhost:8797', { transport: ['websocket'] })

export default function Main() {
    let location = useLocation()
    const history = useHistory()
    const profileBtn = () => {
        history.push('/userprofile')
    }
    //const [currentPost, setCurrentPost] = useState([])
    const [postData, setPostData] = useState([])
    const getUserReducer = useSelector(state => state.getUserReducer)
    const [newPost, setNewPost] = useState()
    const [title, setTitle] = useState()
    const [described, setDescribed] = useState()
    const [author, setAuthor] = useState()
    const [space, setSpace] = useState([])
    const [spaceId, setSpaceId] = useState()
    const [file, setFile] = useState()
    const [postDele, setPostDele] = useState('alo')
    const [term, setTerm] = useState()
    const [liked, setLiked] = useState()
    const [unLiked, setUnliked] = useState()
    const [newComment, setNewComment] = useState()
    const [delId, setDelId] = useState()
    const [searchValue, setSearchValue] = useState('')
    useEffect(() => {
        socket.on("getPost", data => {
            console.log(data);
            setNewPost({
                title: data.title,
                imgVideo: data.imgVideo,
                described: data.described,
                like: data.like,
                comment: data.comment,
                author: data.author,
                space: data.space
            })
        })
        socket.on('like', (id) => {
            console.log(id);
            setLiked(id)
        })
        socket.on('unLikePost', (id) => {
            setUnliked(id)
        })
        socket.on('delete', (id) => {
            console.log(id);
            setPostDele(id)
        })
        socket.on('addComment', data => {
            console.log(data);
            setNewComment(data)
        })
        socket.on('delComment', (id) => {
            setDelId(id)
        })
    }, [])
    useEffect(() => {
        setUnliked('')
        setLiked('')
        setNewComment('')
        setDelId('')
    }, [postData])
    useEffect(() => {
        getSpace().then(res => {
            setSpace(res.data)
        }).catch(err => alert(err))
    }, [])
    useEffect(() => {
        getAllPost().then(res => {
            const newArray = [...res.data].reverse()
            setPostData(newArray)
            console.log(res.data);
        })
    }, [newPost, postDele, liked, unLiked, newComment, delId])
    const deletePostBtn = async (item, index) => {
        let id = item._id
        console.log(id);
        await deletePost(item._id).then(res => {
            console.log("Da xoa");
            socket.emit('deletePost', id)

        })
        socket.emit('deletePost', id)

    }
    const logoutBtn = () => {
        localStorage.clear();
        window.location.reload()

    }
    //console.log(socket);
    const submitBtn = async () => {
        let data = new FormData()
        data.append('title', title)
        if (file) {
            data.append('imgVideo', file, file.name)
        }
        data.append('described', described)
        data.append('like', '')
        data.append('comment', '')
        data.append('space', spaceId)
        data.append('author', getUserReducer.User._id)
        await newPOst(data).then((res) => {
            console.log('hola');
        })
        socket.emit('newPost', {
            data
        })
    }
    const handleChangeTitle = (event) => {
        setTitle(event.target.value)
    }
    const handleChangeDescribed = (event) => {
        setDescribed(event.target.value)
    }
    const handleChangeSpaceId = (event) => {
        setSpaceId(event.target.value)
    }
    const goToAminPage = () => {
        history.push('/admin')
    }
    // const handleChangeFile = (event) => {
    //     setFile(event.target.files[0])
    // }
    const handleChangeTerm = (event) => {
        setTerm(event.target.value)
    }


    const searchPostByTitle = (item) => {
        console.log(searchValue);
        if (term == null) {
            return item
        } else if (item.title.toLowerCase().includes(term.toLowerCase()) ) {
            return item
        }
    }

    const searchPostByAuthor = (item) => {
        if (term == null) {
            return item
        } else if (item.author?.name.toLowerCase().includes(term.toLowerCase())) {
            return item
        }
    }

    const toSpace = (name) => {
        getPostBySpace(name).then(res => {
            setPostData(res.data.list_posts)
        })
    }

    const handleChangeFile = (event) => {

        //const  getSize = 
        if (event.target.files[0].size > 40000000) {
            alert('Max size is 40mb')
            setFile('')
        } else {
            setFile(event.target.files[0])
        }
    }

    const renderSpace = (item, index) => {
        return (
            <a onClick={()=>{toSpace(item._id)}}>
              {item.name}
            </a>
        )
    }
    //console.log(postData)
    const renderPost2 = (item, index) => {
        return (
            <p className="box-post" key={index}>
                <Link to={'/post/' + item._id}>
                    <img src={item.author ? item.author.avatar ? 'http://localhost:8797/' + item.author.avatar : null : null} height="30px" width="30px"></img>
                    {item.author ? item.author.name : 'User đã bị xóa'}
                    <div>{item.title}</div>
                    <div>{item.like?.length} Like</div>
                    <div>{item.comment?.length} Comment</div>

                </Link>
                {getUserReducer.User.role === 'admin' || getUserReducer.User._id == item.author?._id ?
                    (<><button onClick={() => { deletePostBtn(item, index) }}>Delete Post</button></>) : null}

            </p>
        )
    }

    const handleChangeSearchValue = (e) => {
        if (e.target.value == "everything"){
            setSearchValue('')
        }
        setSearchValue(e.target.value)
        console.log(searchValue);
    }

    const renderPost = (item, index) => {
        return (
            <div class="subforum-row">
                <div class="subforum-icon subforum-column center">
                    <i class="fa fa-car"></i>
                </div>

                <div class="subforum-description subforum-column">
                    <h1><a href="#"><Link to={'/post/' + item._id}>{item.title}</Link></a></h1>
                    <h2>Description content:</h2>
                    <p>{item.described}</p>
                </div>

                <div class="subforum-stats subforum-column center">
                    <span>{item.like?.length} Like | {item.comment?.length} Comment</span>
                </div>

                <div class="subforum-info subforum-column">
                    <b><a href="">Last Post</a></b> by <a href="">{item.author.name}</a>
                    <br />
                    on <small>22 Dec 2021</small>
                </div>
            </div>
        )
    }
    //console.log(spaceId);
    return (
        <div class="container">
            <header>
                <a href="/main"><img src="/assets/images/Logo.png" class="logo" alt="Logo" /></a>
                <div class="menu">
                    <input type="checkbox" id="check" />
                    <label for="check" class="check-btn">
                        <i class="fa fa-bars"></i>
                    </label>
                    <ul>
                        <li><a href="./index.html">Feed</a></li>
                        <li><a href="/userprofile">Account</a></li>
                        <li><a href="#section@">Feedback</a></li>
                        <li><a onClick={logoutBtn}>Sign Out</a></li>
                    </ul>
                </div>
            </header>

            <div class="search-box">
                <div>
                    <select name="" id="" onChange={handleChangeSearchValue}>
                        <option value="everything">Everything</option>
                        <option value="titles" >Titles</option>
                        <option value="author" >Author</option>
                    </select>
                    <input type="text" name="" id="" class={searchValue == ''?"offSearch":""} placeholder="Search ..." onChange={handleChangeTerm} />
                    <button><i class="fa fa-search"></i></button>
                </div>
            </div>

            <div id="add-post">
                <input placeholder="Title" onChange={handleChangeTitle} />
                <input placeholder="Description" onChange={handleChangeDescribed} />
                <select value={spaceId} onChange={handleChangeSpaceId} >
                    <option disabled selected  >Select space</option>
                    {space?.map((item, index) => {
                        return <option key={index} value={item._id}>{item.name}</option>
                    })}
                </select>
                <input type='file' onChange={handleChangeFile} />
                <button onClick={submitBtn}>Submit</button>
            </div>

            <main>
                <div class="main-container">
                    <div class="list-container">
                        <div class="list-title">
                            <h1>Space:</h1>
                        </div>

                        <div class="list-content">
                            {space.map(renderSpace)}
                        </div>
                    </div>
                    <div class="post-container">
                        <div class="subforum">
                            <div class="subforum-title">
                                <h1>HOT Information</h1>
                            </div>

                            <div class="subforum-row">
                                <div class="subforum-icon subforum-column center">
                                    <i class="fa fa-car"></i>
                                </div>

                                <div class="subforum-description subforum-column">
                                    <h1><a href="#">Description Title</a></h1>
                                    <h2>Description content:</h2>
                                    <p>Mot con vit xoe ra hai cai canh</p>
                                </div>

                                <div class="subforum-stats subforum-column center">
                                    <span>2x posts | 1x Topics</span>
                                </div>

                                <div class="subforum-info subforum-column">
                                    <b><a href="">Last Post</a></b> by <a href="">User X</a>
                                    <br />
                                    on <small>22 Dec 2021</small>
                                </div>
                            </div>

                        </div>


                        <div class="subforum">

                            <div class="subforum-title">
                                <h1>General Information</h1>
                            </div>
                            
                            
                            <hr class="subforum-devider" />
                            {searchValue === 'titles' ? postData.filter(searchPostByTitle).map(renderPost) : postData.filter(searchPostByAuthor).map(renderPost)}
                            
                        </div>
                    </div>
                </div>
            </main>

        <Footer />
        </div>


    )
}
