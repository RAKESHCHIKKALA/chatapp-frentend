import {userAction} from "../actions/userActions.js"
export const userActionCreater=(userdata)=>{
    userAction.payload=userdata
    return userAction;

}