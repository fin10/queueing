import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NoteList from './NoteList';

const App = (): React.ReactElement => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <NoteList />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
