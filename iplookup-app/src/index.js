import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './components/serviceWorker';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/css/animate.min.css';
import './components/css/toastr.min.css';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
