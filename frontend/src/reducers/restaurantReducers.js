import { RESTAURANT_LIST_FAIL,
    RESTAURANT_LIST_REQUEST, 
    RESTAURANT_LIST_SUCCESS,
    RESTAURANT_DETAILS_REQUEST, 
    RESTAURANT_DETAILS_SUCCESS,
    RESTAURANT_DETAILS_FAIL} 
    from '../constants/restaurantConstant';

export const restaurantListReducer =(state={ loading: true, restaurants: [] },action)=>{
switch(action.type){
    case RESTAURANT_LIST_REQUEST:
        return {loading:true};
        case RESTAURANT_LIST_SUCCESS:
            return {loading:false, restaurant: action.payload};
            case RESTAURANT_LIST_FAIL:
                return {loading:false, error: action.payload};
                default:
                    return state
}
}
export const restaurantDetailsReducer =(state={restaurants:[],loading: true},action)=>{
    switch(action.type){
        case RESTAURANT_DETAILS_REQUEST:
            return {loading:true};
            case RESTAURANT_DETAILS_SUCCESS:
                return {loading:false, restaurant: action.payload};
                case RESTAURANT_DETAILS_FAIL:
                    return {loading:false, error: action.payload};
                    default:
                        return state
    }
    }