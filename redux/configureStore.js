import { createStore,applyMiddleware } from "redux";
import rootReducers from "./reducer/index";


import thunk from "redux-thunk";


export default function configureStore(){
    let store =createStore(rootReducers,applyMiddleware(thunk))
    return store;
}