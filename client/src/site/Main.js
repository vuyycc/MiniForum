import React,{useState, useEffect} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {getListPost} from '../axios'

export default function Main() {
    let location = useLocation()
    const [listPost, setListPost] = useState([])
    const [title, setTitle] = useState('')
    const [described, setDescribed] = useState('')
    const [space, setSpace] = useState('')
    const [author, setAuthor] = useState('')

    useEffect(() => {
        getListPost().then(res => {
            setListPost(res.data)
        })
    },[])

    const renderItem = (item, index) => {
        return (
            <div className="boxPost" key={index}>
                <div>{item.title}</div>
                <div>{item.imgVideo}</div>
                <div>{item.described}</div>
                <div>{item.space}</div>
            </div>
        )
    }
    return (
        <div>
            <div id="my-body">
                <div>
                    <form action="/ post/add-post" method="POST" id="submit-post">
                        <input value={title} placeholder='Title' onChange={(e)=>setTitle(e.target.value)}></input>
                        <input value={described} placeholder='Described' onChange={(e)=>setDescribed(e.target.value)}></input>
                        <input value={space} placeholder='Space' onChange={(e)=>setSpace(e.target.value)}></input>
                        <input value={author} placeholder='Author' onChange={(e)=>setAuthor(e.target.value)}></input>
                        <input type="submit" value="Submit"></input>
                    </form>
                </div>
            {listPost.map(renderItem)}
            </div>
        </div>
    )
}
