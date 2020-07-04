import React from 'react';
import ReactDOM from 'react-dom';

import './css/general.css';
import './css/header.css';
import './css/footer.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
