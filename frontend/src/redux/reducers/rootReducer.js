// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import auth from './auth'
import navbar from './navbar'
import layout from './layout'

const rootReducer = combineReducers({
  auth,
  navbar,
  layout
})

export default rootReducer
