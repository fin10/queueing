import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container, createStyles, makeStyles, Theme } from '@material-ui/core';
import Header from 'client/common/Header';
import ArticleSummaryContainer from 'client/features/articleSummary/ArticleSummaryContainer';
import ArticleDetailContainer from 'client/features/articleDetail/ArticleDetailContainer';
import EditArticleDetailContainer from 'client/features/articleDetail/EditArticleDetailContainer';

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
              <EditArticleDetailContainer />
            </Route>
            <Route path="/article/:id">
              <ArticleDetailContainer />
            </Route>
            <Route path="/">
              <ArticleSummaryContainer />
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
};

export default App;
