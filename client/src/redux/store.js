import { configureStore } from '@reduxjs/toolkit'

// export default, we can rename to userReducer
import userReducer from './user/userSlice.js'

export const store = configureStore({
    reducer: {user: userReducer},
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializeableCheck: false,
        }),
})