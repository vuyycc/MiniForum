import axios from "axios";


let instantAxios = axios.create({
    timeout: 20000,
    baseURL: 'http://localhost:8797'
})

instantAxios.interceptors.request.use((request) => {
    let token = localStorage.getItem('accessToken')
    request.headers['Authorization'] = 'Bearer ' + token
    return request
})


export const login = (body) => {
    return instantAxios.post('/login', body)
}

export const signup = (body) => {
    return instantAxios.post('/signup', body)
}

export const getUserById = (id) => {
    return instantAxios.get('/user/' + id)
}

export const updateUser = (body) => {
    return instantAxios.put('/user/update', body)
}

export const updateImgUser = (formData) => {
    return instantAxios.post('/user/avatar', formData)
}

export const updatePassword = (body) => {
    return instantAxios.post('/user/password', body)
}

export const getAllPost = () => {
    return instantAxios.get('/post')
}



export const deletePost = (id) => {
    return instantAxios.delete('/post/' + id)
}

export const getPostById = (id) => {
    return instantAxios.get('/post/' + id)
}


export const getAllUser = (body) => {
    return instantAxios.get('/user/all')
}

// export const addPost = (body) => {
//     return instantAxios.post('/post/add-post',body)
// }

export const deleteUser = (id) => {
    return instantAxios.delete('/user/' + id)
}


export const getSpace = () => {
    return instantAxios.get('/main')
}

export const newPOst = (body) => {
    return instantAxios.post('/post/add-post', body)
}

export const likePost = (id, body) => {
    return instantAxios.post('/post/like/' + id, body)
}

export const unLikePost = (id, body) => {
    return instantAxios.post('/post/unlike/' + id, body)
}

export const addComment = (id, body) => {
    return instantAxios.post('/post/' + id, body)
}

export const deleteComment = (id, body) => {
    return instantAxios.delete('/comment/' + id, body)
}

export const getPostBySpace = (id) => {
    return instantAxios.get('/main/' +id)
}

export const getPostByPage = (id) => {
    return instantAxios.get('/main/pages/'+id)  
}

export const getSpaceByPage = (id,page) => {
    return instantAxios.get('/main/spaces/'+id+'/'+page)
}

export const getCommentByPage = (id,page) => {
    return instantAxios.get('/post/'+id+'/'+page)
}

export const searchByTitle = (value) => {
    return instantAxios.get('/main/search-title/'+value)
}


export const searchByAuthor = (value) => {
    return instantAxios.get('/main/search-author/' + value)
}

export const getPostTop = () => {
    return instantAxios.get('/main/post/top/1')
}