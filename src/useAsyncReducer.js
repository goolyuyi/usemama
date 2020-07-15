import React, {useReducer} from "react";

function passThroughReducer(states, action) {
    return action;
}

export default function useAsyncReducer(asyncReducer, initState, initialAction) {
    const [states, dispatch] = useReducer(passThroughReducer, initState, initialAction);
    const awaitDispatch = async (action) => {
        const res = await asyncReducer(states, action);
        dispatch(res);
    }
    return [states, awaitDispatch]
}
