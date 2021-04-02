import React from 'react';
import createRoutes from './routes';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import { ThemeProvider } from '@material-ui/core/styles';
import defaultTheme from './themes/DefaultTheme/DefaultTheme';

const App = () => {
  const { store, persistor } = configureStore();

  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <PersistGate loading={null} persistor={persistor}>
          {createRoutes()}
        </PersistGate>
      </ThemeProvider>
    </Provider>
  );
};

export default App;