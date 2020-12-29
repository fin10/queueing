import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import NewNote from './NewNote';
import NoteList from './NoteList';
import Note from './Note';
import Header from '../components/Header';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      height: '100%',
    },
  }),
);

const App = (): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <Container maxWidth="md">
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
      </Container>
    </div>
  );
};

export default App;
