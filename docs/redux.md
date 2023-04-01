# Dispatching actions and getting state

## Client Side

Use the `useSelector` and `useDispatch` hooks to get the state and dispatch actions. Example:

```js
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState, setAuthState } from '@/redux/slices/authSlice';

export default function Home() {
  const authState = useSelector(selectAuthState);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Auth State: {authState ? 'true' : 'false'}</h1>
      <button onClick={() => dispatch(setAuthState(!authState))}>
        Toggle Auth State
      </button>
    </div>
  );
}
```

## Server Side

Use the `wrapper` to get the state and dispatch actions. Example:

```js
import { wrapper } from '@/redux/store';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      // we can set the initial state from here
      // we are setting to false but you can run your custom logic here
      await store.dispatch(setAuthState(true));
      console.log('State on server', store.getState());
      return {
        props: {
          authState: false,
        },
      };
    }
);
```

# Creating a slice

## 1. Create a slice file

Create a file in the `redux/slices` folder with the name of the slice. Example: `authSlice.js`.
The file should contain the following:

```js
import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

// Actual Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authState: false,
  },
  reducers: {
    // Action to set the authentication status
    setAuthState(state, action) {
      state.authState = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const selectAuthState = (state) => state.auth.authState;
export default authSlice.reducer;
```

## 2. Add the slice to the store

Add the slice to the store in the `redux/store.js` file.

```js
import { authSlice } from './slices/authSlice';

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
});
```

# Presisting the state

## 1. Create a slice file

Create a file in the `redux/slices` folder with the name of the slice. See [Creating a slice](#creating-a-slice) for more details.

## 2. Tell the store to persist the state

Add the slice's name to the whitelist of persistConfig in the `redux/store.js` file. Example:

```js
const persistConfig = {
  key: 'nextjs',
  whitelist: ['auth'], // make sure it does not clash with server keys
  storage,
};
```
