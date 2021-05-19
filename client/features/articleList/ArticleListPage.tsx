import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, Fab, Paper } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Logger } from '../../utils/Logger';
import ArticleListItem from './ArticleListItem';
import { Resources } from '../../resources/Resources';
import { StringID } from '../../resources/StringID';
import { fetchArticles, selectArticleList } from './articleListSlice';
import { useAppDispatch } from '../../app/store';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      right: 0,
      bottom: 0,
      margin: theme.spacing(2),
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
);

const parsePage = () => {
  try {
    const query = new URLSearchParams(useLocation().search);
    const page = query.get('page');
    if (page) return Number.parseInt(page);
  } catch (err) {
    Logger.error(err);
  }

  return 1;
};

export default function ArticleListPage() {
  const classes = useStyles();
  const articleListState = useSelector(selectArticleList);
  const dispatch = useAppDispatch();

  const page = parsePage();

  useEffect(() => {
    dispatch(fetchArticles(page));
  }, [page]);

  if (articleListState.error) {
    console.error(articleListState.error.stack);
  }

  return (
    <>
      <Paper>
        <List dense={true} disablePadding={true}>
          {articleListState.articles.map((article) => (
            <React.Fragment key={article.id}>
              <ArticleListItem note={article} />
            </React.Fragment>
          ))}
        </List>

        <Fab
          className={classes.fab}
          color="primary"
          aria-label={Resources.getString(StringID.ARTICLE_LIST_NEW_ARTICLE)}
          href="/article/new"
        >
          <CreateIcon />
        </Fab>
      </Paper>
      {articleListState.totalPages && (
        <Pagination
          className={classes.pagination}
          page={page}
          count={articleListState.totalPages}
          renderItem={(item) => <PaginationItem component={Link} to={`?page=${item.page}`} {...item} />}
        />
      )}
    </>
  );
}
