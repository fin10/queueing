import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, Fab, Paper } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';
import { Logger } from '../utils/Logger';
import { Note } from '../types';
import ArticleListItem from '../components/ArticleListItem';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      right: 0,
      bottom: 0,
      margin: theme.spacing(2),
    },
  }),
);

const ArticleListPage = (): React.ReactElement => {
  const [notes, updateNotes] = useState<Note[]>([]);
  const classes = useStyles();

  const fetchNotes = async () => {
    try {
      const res = await axios.get<Note[]>('/api/article');
      updateNotes(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
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
  );
};

export default ArticleListPage;
