import React from 'react'
import ReactDOM from 'react-dom'
import { Router as BrowserRouter } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import ReactGA from 'react-ga';
ReactGA.initialize('UA-124050572-1');
const history = createHistory()
history.listen((location, action) => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
});

ReactGA.set({ page: window.location.pathname });
ReactGA.pageview(window.location.pathname);

ReactDOM.render(<BrowserRouter history={history}><App /></BrowserRouter>, document.getElementById('root'))
registerServiceWorker()
