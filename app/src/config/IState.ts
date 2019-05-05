import {IReducerLoginState} from "../component/login/reducerLogin";
import {IReducerOnlineUsers} from "../component/home/onlineUsers/reducerOnlineUsers";
import {IReducerActivity} from "../component/home/activity/reducerActivity";
import {IReducerErrorMessage} from "../component/errorMessage/reducerErrorMessage";


export interface IState {
    loginInfo: IReducerLoginState,
    users: IReducerOnlineUsers,
    activity: IReducerActivity,
    errors: IReducerErrorMessage
}