// Stylesheet
import '@/styles/globals.css';

// Redux
import { wrapper } from '@/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export default wrapper.withRedux(({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <PersistGate persistor={store.__persistor} loading={<div>Loading</div>}>
        <Component {...props.pageProps} />
      </PersistGate>
    </Provider>
  );
});
