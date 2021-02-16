import axios from 'axios';
import qs from 'query-string';
import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, Fab, Paper } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Logger } from '../utils/Logger';
import { ArticlesResponse, Note } from '../types';
import ArticleListItem from '../components/ArticleListItem';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import { Link, useLocation } from 'react-router-dom';

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

const parsePage = (): number => {
  try {
    const query = new URLSearchParams(useLocation().search);
    const page = query.get('page');
    if (page) return Number.parseInt(page);
  } catch (err) {
    Logger.error(err);
  }

  return 1;
};

const ArticleListPage = (): React.ReactElement => {
  const page = parsePage();

  const [notes, updateNotes] = useState<Note[]>([]);
  const [totalPages, updateTotalPages] = useState<number>(0);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      try {
        const query = qs.stringify({ page });
        const res = await axios.get<ArticlesResponse>(`/api/article?${query}`);
        updateNotes(res.data.notes);
        updateTotalPages(res.data.totalPages);
      } catch (err) {
        Logger.error(err);
      }
    })();
  }, [page]);

  return (
    <>
      <Paper>
        <List dense={true} disablePadding={true}>
          {notes.map((note) => (
            <React.Fragment key={note.id}>
              <ArticleListItem note={note} />
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
      {totalPages > 0 && (
        <Pagination
          className={classes.pagination}
          page={page}
          count={totalPages}
          renderItem={(item) => <PaginationItem component={Link} to={`?page=${item.page}`} {...item} />}
        />
      )}
    </>
  );
};

export default ArticleListPage;
