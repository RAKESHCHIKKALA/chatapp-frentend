import { chatAction } from "../actions/chatActions";
export const chatActionCreater=(chatdata)=>{
    chatAction.payload=chatdata
    return chatAction;
}