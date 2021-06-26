import {
    GET_USER
} from "../actions/types"


const initialState = {
    User: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_USER: {
            return {
                ...state,
                User: action.payload
            }
        }
        default:
            return state
    }
}
