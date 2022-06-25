const istate={
    
    user:123456,
    currentUser:["12345"]
}
const userReducer =(state=istate,action) =>{

    
    if(action.type==='USER_DATA'){
        return{
            ...state,
            user:action.payload,

        }

    }

    if(action.type==='CURRENT_USER'){
        return{
            ...state,
            currentUser:action.payload,

        }

    }

return state;


}

export default userReducer;