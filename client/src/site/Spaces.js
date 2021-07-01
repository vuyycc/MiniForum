import React, { useEffect, useState } from 'react'
import {
    useParams,
    Link
} from "react-router-dom";
import Footer from '../pages/footer'
import Header from '../pages/header'
import { getSpaceByPage, getPostBySpace, searchByTitle, searchByAuthor } from '../axios'
import '../css/Spaces.css'

export default function Spaces() {
    const [dataPosts, setDataPosts] = useState([])
    const [nameSpace, setNameSpace] = useState('')
    const [pages, setPages] = useState('')
    const [current, setCurrent] = useState('')
    const [listPages, setListPages] = useState([])
    const [term, setTerm] = useState()
    const [searchValue, setSearchValue] = useState('everything')
    const params = useParams()

    useEffect(() => {
        getPostBySpace(params.id).then(res => {
            console.log(res.data.data);
            setDataPosts(res.data.data.list_posts)
            setNameSpace(res.data.data.name)
            setPages(res.data.pages)
            setCurrent(res.data.current)
            let arrPages = []
            for (let i = 1; i <= 3 && i <= res.data.pages; i++) {
                console.log(i);
                arrPages.push(i)
            }
            setListPages(arrPages)
        })
    },[])


    const renderPage = (item, index) => {

        return (
            <div class={current == item ? "pagination:number isPages" : "pagination:number"} onClick={() => { toPages(item)}}>
                {item}
            </div>)
    }

    const toPages = (name) => {
        getSpaceByPage(params.id,name).then(res => {
            setDataPosts(res.data.data.list_posts)
            setCurrent(res.data.current)
            if (Number(name) == listPages[2] && Number(name) != res.data.pages) {
                let i = Number(name)
                let max = i + 2
                let arrPages = []
                for (i; i <= max && i <= res.data.pages; i++) {
                    arrPages.push(i)
                }
                setListPages(arrPages)
            }

        })
    }

    const toPagesF = (name) => {
        getSpaceByPage(params.id,name).then(res => {
            setDataPosts(res.data.data.list_posts)
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



    const renderPost = (item, index) => {
        console.log(item);
        return (
            <div class="table-row">
                <div class="status"><i class="fa fa-fire"></i></div>
                <div class="subjects">
                    <a href="#"><Link to={'/post/' + item._id}>{item.title}</Link></a>
                    <br />
                    <span>Posted by <b><a href="#">{item.author?.name}</a></b>.</span>
                </div>
                <div class="replies">
                    {item.like?.length} Like <br /> {item.comment?.length} Comment
                </div>
                <div class="last-reply">
                    <p>
                    {item.comment.length != 0 ? new Date(item.comment[0].created).toDateString() : new Date(item.created).toDateString() }
                    </p>
                    {item.comment.length != 0 ? new Date(item.comment[0].created).toLocaleTimeString() : new Date(item.created).toLocaleTimeString() }
                    <br />
                    By <b><a href="#">{item.comment.length != 0 ? item.comment[0]?.author?.name: item.author?.name}</a></b>
                </div>
            </div>
        )
    }

    const renderNull = () => {
        return (
            <div class="table-row">
                <div class="subjects" style={
                    {textAlign: "center"}
                }>
                    Buồn quá chưa có bài viết nào :((
                </div>
            </div>
        )
    }

    const handleChangeSearchValue = (e) => {
        if (e.target.value == "everything") {
            setSearchValue('')
        }
        setSearchValue(e.target.value)
        console.log(searchValue);
    }

    const handleChangeTerm = (event) => {
        setTerm(event.target.value)
    }


    const searchPostByTitle = () => {
        if (term) {
            searchByTitle(term).then(res => {
                console.log(res.data);
                setDataPosts(res.data.data)
                setPages('')
            })
        } else {
            window.location.reload()
        }
    }

    const searchPostByAuthor = () => {
        if (term) {
            searchByAuthor(term).then(res => {
                console.log(res.data);
                setDataPosts(res.data.data)
                setPages('')
            })
        } else {
            window.location.reload()
        }
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
                    <input type="text" name="" id="" class={searchValue == 'everything' ? "offSearch" : ""} placeholder="Search ..." onChange={handleChangeTerm} />
                    <button onClick={searchValue == 'titles' ? searchPostByTitle : searchPostByAuthor}><i class="fa fa-search"></i></button>
                </div>
            </div>

            <main>
                <div class="main-container">
                    <div class="navigate">
                        <span><a href="/main">TIE - Forums</a> &gt;&gt; <a href="#">{nameSpace}</a></span>
                    </div>

                    <div class="post-table">
                        <div class="table-head">
                            <div class="status">Status</div>
                            <div class="subjects">Subjects</div>
                            <div class="replies">
                                Replies/
                                <br />
                                Views
                            </div>
                            <div class="last-reply">Last Reply</div>
                        </div>

                    {dataPosts.length != 0 ? dataPosts?.map(renderPost) : renderNull()}

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
            </main>


            <Footer />


        </div>


    )
}