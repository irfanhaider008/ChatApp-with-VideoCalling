export const userData = (user)=>{

    return {
        type:'USER_DATA',
        payload:user
    }
}


export const currentUserData = (user)=>{

    return {
        type:'CURRENT_USER',
        payload:user
    }
}