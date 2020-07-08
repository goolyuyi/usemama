import React, {useReducer} from "react";

function passThroughReducer(states, action) {
    return action;
}

export  default  function useAsyncReducer(asyncReducer,initState,initialAction) {
    const [reducer, dispatch] = useReducer(passThroughReducer, initState, initialAction);
    const awaitDispatch = async (action) => {
        const res = await asyncReducer(reducer, action);
        dispatch(res);
    }
    return [reducer,awaitDispatch()]
}
