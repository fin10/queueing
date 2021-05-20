import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import EditArticlePage from './EditArticlePage';
import ArticleListContainer from '../features/articleList/ArticleListContainer';
import ArticlePage from './ArticlePage';
import Header from '../components/Header';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'unset',
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
            <Route exact path="/article/new">
              <EditArticlePage />
            </Route>
            <Route path="/article/:id">
              <ArticlePage />
            </Route>
            <Route path="/">
              <ArticleListContainer />
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
};

export default App;
