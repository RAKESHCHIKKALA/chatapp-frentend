import { messageAction} from "../actions/messageActions";

export const messageActionCreater=(messagedata)=>{
    messageAction.payload=messagedata
    return messageAction;
};