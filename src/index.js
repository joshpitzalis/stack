import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CommentsProvider from './context/CommentsContext';
import VoteProvider from './context/VoteContext';
import './index.css';
import Discussions from './pages/Chat';
import NoMatch from './pages/NoMatch';
import Projects from './pages/Project';
import Tasks from './pages/Tasks';
import Votes from './pages/Votes';
import * as serviceWorker from './serviceWorker';

const Routes = () => {
  return (
    <BrowserRouter>
    <React.StrictMode>
      <div className="sans-serif pa4">
        <Switch>
          <Route
            exact
            path="/"
            component={Projects}
          />
          <Route
            exact
            path="/discussion/:discussionId"
            component={Discussions}
          />
           <Route
            exact
            path="/task/:taskId"
            component={Tasks}
          />
           <Route
            exact
            path="/vote/:voteId"
            component={Votes}
          />
          <Route component={NoMatch} />
        </Switch>
      </div>
      </React.StrictMode>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <VoteProvider>
    <CommentsProvider>
      <Routes />
    </CommentsProvider>
  </VoteProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

