import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import './bootstrap.min.css';
import './index.css';
import App from './App';
import './mobile-header-fixes.css';
import './preview-qa-fixes.css';
import './heat-strip-reference-fix.css';
import './block-11a-loading-fixes.css';
import './block-11b-navigation-heat-fixes.css';
import * as serviceWorker from './serviceWorker';

// <---- REDUX STORE ---->
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
