import { unwrapResult } from '@reduxjs/toolkit';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, Fab, Paper, Backdrop, CircularProgress } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';
import { Pagination, PaginationItem } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Logger } from '../../utils/Logger';
import ArticleSummaryItem from './ArticleSummaryItem';
import { Resources } from '../../resources/Resources';
import { StringID } from '../../resources/StringID';
import { fetchArticleSummaries, selectArticleSummaryIds, selectTotalPages } from './articleSummarySlice';
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
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

export default function ArticleSummaryContainer() {
  const classes = useStyles();
  const articleIds = useSelector(selectArticleSummaryIds);
  const totalPages = useSelector(selectTotalPages);
  const dispatch = useAppDispatch();

  const [loading, updateLoading] = useState(true);

  const page = parsePage();

  useEffect(() => {
    updateLoading(true);
    dispatch(fetchArticleSummaries(page))
      .then(unwrapResult)
      .catch((err) => Logger.error(err))
      .finally(() => updateLoading(false));
  }, [page]);

  return (
    <>
      <Paper>
        <List dense={true} disablePadding={true}>
          {articleIds.map((id) => (
            <React.Fragment key={id}>
              <ArticleSummaryItem id={id} />
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
      {totalPages && (
        <Pagination
          className={classes.pagination}
          page={page}
          count={totalPages}
          renderItem={(item) => <PaginationItem component={Link} to={`?page=${item.page}`} {...item} />}
        />
      )}

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
