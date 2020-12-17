import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NewNote from './NewNote';
import NoteList from './NoteList';
import Note from './Note';

const App = (): React.ReactElement => {
  return (
    <Router>
      <Switch>
        <Route path="/notes/new">
          <NewNote />
        </Route>
        <Route path="/notes/:id">
          <Note />
        </Route>
        <Route path="/">
          <NoteList />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
