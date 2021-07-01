import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import { deletePost, getAllPost, getSpace, newPOst, getPostBySpace, getPostByPage, searchByTitle, searchByAuthor, getPostTop } from './axios'
import io from 'socket.io-client'
import Footer from './pages/footer'
import Header from './pages/header'
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
    //const [author, setAuthor] = useState()
    const [space, setSpace] = useState([])
    const [spaceId, setSpaceId] = useState()
    const [file, setFile] = useState()
    const [postDele, setPostDele] = useState('alo')
    const [term, setTerm] = useState()
    const [liked, setLiked] = useState()
    const [unLiked, setUnliked] = useState()
    const [newComment, setNewComment] = useState()
    const [delId, setDelId] = useState()
    const [searchValue, setSearchValue] = useState('everything')
    const [pages, setPages] = useState('')
    const [current, setCurrent] = useState('')
    const [listPages, setListPages] = useState([])
    const [postTop, setPostTop] = useState({})
    const [checkShow, setCheckShow] = useState(false)
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
            console.log(res.data);
            setPostData(res.data.data)
            setPages(res.data.pages)
            setCurrent(res.data.current)
            let arrPages = []
            for(let i = 1; i <= 3 && i <= res.data.pages;i++){
                arrPages.push(i)
            }
            setListPages(arrPages)

        })
    }, [newPost, postDele, liked, unLiked, newComment, delId])
    useEffect( async ()=> {
        await getPostTop().then(res => {
            console.log(res.data[0]?.comment.length);
            let a = {}
            a = res.data[0]
            for(let i = 1; i < res.data.length; i++){
                if(a.comment.length < res.data[i].comment.length){
                    a = res.data[i]
                }
            }
            setPostTop(a)
        })
    },[])

    const deletePostBtn = async (item, index) => {
        let id = item._id
        console.log(id);
        await deletePost(item._id).then(res => {
            console.log("Da xoa");
            socket.emit('deletePost', id)

        })
        socket.emit('deletePost', id)

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
            setTitle('')
            setDescribed('')
            setCheckShow(false)
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


    const searchPostByTitle = () => {
        if(term){
        searchByTitle(term).then(res => {
            console.log(res.data);
            setPostData(res.data.data)
            setPages('')
        })} else {
            window.location.reload()
        }
    }

    const searchPostByAuthor = () => {
        if(term){
        searchByAuthor(term).then(res => {
            console.log(res.data);
            setPostData(res.data.data)
            setPages('')
        })} else {
            window.location.reload()
        }
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
            <a href={"/main/spaces/"+item._id}>
              {item.name}
            </a>
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
                    <b><a href="">Last Post</a></b> by <a href="">{item.comment?.length != 0 ? item.comment[0]?.author?.name : item.author?.name} </a>
                  
                    on
                    <small >
                        <p style={{ marginTop: "10px" }}>
                            {item.comment.length != 0 ? new Date(item.comment[0].created).toDateString() : new Date(item.created).toDateString()}
                        </p>
                        {item.comment.length != 0 ? new Date(item.comment[0].created).toLocaleTimeString() : new Date(item.created).toLocaleTimeString()}
                        <br />
                    </small>
                </div>
            </div>
        )
    }
    //console.log(spaceId);
    const toPages = (name) => {
        getPostByPage(name).then(res => {
            setPostData(res.data.data)
            setCurrent(res.data.current)
            if(Number(name) == listPages[2] && Number(name) != res.data.pages){
                let i = Number(name)
                let max = i + 2
                let arrPages = []
                for (i; i <= max && i <= res.data.pages; i++) {
                    arrPages.push(i)
                }
                setListPages(arrPages)
            }
           
        })
        console.log(listPages);
    }

    const toPagesF = (name) => {
        getPostByPage(name).then(res => {
            setPostData(res.data.data)
            setCurrent(res.data.current)
            if (Number(name) == listPages[0] || Number(name) < listPages[0]) {
                let i = listPages[0] - 2
                let max = listPages[0]
                let arrPages = []
                for (i; i <= max && i <= res.data.pages; i++) {
                    arrPages.push(i)
                }
                setListPages(arrPages)
            }
        })
    }

    const renderPage = (item, index) => {

        return (
            <div class={current == item ? "pagination:number isPages" : "pagination:number"} onClick={()=>{toPages(item)}}>
                    {item}
                </div>)


    }
    //useEffect(()=>{
      //  if(!term){
        //    setResult(postData)
        //}else{
          //  setResult(postData.filter(searchPost))
        //}
    //},[term,postData])

    const showPost = () => {
        let a = checkShow ? false : true
        console.log(a);
        setCheckShow(a)
    }

    const dismissPost = () => {
        setCheckShow(false)
    }

    return (
        <div class="container">
           <Header />

            <div class="search-box">
                <div>
                    <select name="" id="" onChange={handleChangeSearchValue}>
                        <option value="everything">Everything</option>
                        <option value="titles" >Titles</option>
                        <option value="author" >Author</option>
                    </select>
                    <input type="text" name="" id="" class={searchValue == 'everything'?"offSearch":""} placeholder="Search ..." onChange={handleChangeTerm} />
                    <button onClick={searchValue == 'titles' ? searchPostByTitle : searchPostByAuthor}><i class="fa fa-search"></i></button>
                </div>
            </div>


            <div class="post-button">
                <button onClick={showPost}>Post something</button>
            </div>
            
            <div class={checkShow ? "post-area b-block": 'b-none'} id="post-area">
                <div class="post-wrapper">
                    <div class="post-title">
                        <h3>Title:</h3>
                        <input type="text" onChange={handleChangeTitle} placeholder="Title ..."/>
                </div>

                        <div class="post-description">
                            <h3>Description:</h3>
                        <input type="text" onChange={handleChangeDescribed} placeholder="Description ..."/>
                </div>

                            <div class="post-space">
                                <h3>Space:</h3>
                        <select value={spaceId} onChange={handleChangeSpaceId} id="">
                                    <option value="everything">Everything</option>
                            {space?.map((item, index) => {
                                return <option key={index} value={item._id}>{item.name}</option>
                            })}
                                </select>
                            </div>

                            <div class="post-file">
                        <input type='file' onChange={handleChangeFile} />
                            </div>

                            <div class="post-submit">
                        <input type="button" name="" id="" value="submit" onClick={submitBtn}/>
                                    <button class="post-dismiss" onclick={dismissPost}>Dismiss</button>
                </div>

                            </div>
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
                                    <h1><a href="#"><Link to={'/post/'+postTop?._id}>{postTop?.title}</Link></a></h1>
                                    <h2>Description content:</h2>
                                    <p>{postTop?.described}</p>
                                </div>

                                <div class="subforum-stats subforum-column center">
                                    <span>{postTop?.like?.length} Like | {postTop?.comment?.length} Comment</span>
                                </div>

                                <div class="subforum-info subforum-column">
                                    <b><a href="">Last Post</a></b> by <a href="">{postTop?.comment ? postTop?.comment[0]?.author?.name : postTop?.author?.name} </a>

                                    on
                                    <small >
                                        <p style={{ marginTop: "10px" }}>
                                            {postTop?.comment? new Date(postTop?.comment[0]?.created).toDateString() : new Date(postTop?.created).toDateString()}
                                        </p>
                                        {postTop?.comment ? new Date(postTop?.comment[0]?.created).toLocaleTimeString() : new Date(postTop?.created).toLocaleTimeString()}
                                        <br />
                                    </small>
                                </div>
                            </div>

                        </div>


                        <div class="subforum">

                            <div class="subforum-title">
                                <h1>General Information</h1>
                            </div>
                            
                            
                            <hr class="subforum-devider" />
                            {postData?.map(renderPost)}
                        </div>


                    
                            <div class={Number(pages) > 0 ? "pagination:container" : "disableOff"}>
                            <div class={current != 1 && current > 2 ? "pagination:number arrow" : "pagination:number arrow disableOff"} onClick={() => { toPagesF(Number(current) - 1) }}>
                                    <svg width="18" height="18">
                                        <use href="#left" />
                                    </svg>
                                     <span class="arrow:text">First</span>

                                </div>
                                <div class={current > 2 ? "pagination:number" : "pagination:number disableOff"}>
                                    ...
                                </div>
                                {listPages.map(renderPage)}
                                <div class={current < pages - 2 ? "pagination:number" : "pagination:number disableOff"}>
                                    ...
                                </div>
                            <div class={current != pages && pages > 3 ? "pagination:number arrow" : "pagination:number arrow disableOff"} onClick={() => { toPages(Number(current) + 1) }} >
                                    <span class="arrow:text">Last</span>
                                    <svg width="18" height="18">
                                        <use href="#right" />
                                    </svg>
                                </div>
                            </div>

                    
                        
                        <svg class="hide">
                            <symbol id="left" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></symbol>
                            <symbol id="right" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></symbol>
                        </svg>




                    </div>
                </div>
            </main>

        <Footer />
        </div>


    )
}
