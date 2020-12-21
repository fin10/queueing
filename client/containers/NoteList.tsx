import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, Fab } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';
import { Logger } from '../utils/Logger';
import { Note } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    fab: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      margin: theme.spacing(2),
    },
  }),
);

const NoteList = (): React.ReactElement => {
  const [notes, updateNotes] = useState<Note[]>([]);
  const classes = useStyles();

  const fetchNotes = async () => {
    try {
      const res = await axios.get<Note[]>('/api/notes');
      updateNotes(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className={classes.root}>
      <h2>Queueing</h2>
      <List>
        {notes.map((note) => (
          <ListItem key={note.id} button component={Link} to={`/notes/${note.id}`}>
            <ListItemText primary={note.title} />
          </ListItem>
        ))}
      </List>
      <Fab className={classes.fab} color="primary" aria-label="create" href="/notes/new">
        <CreateIcon />
      </Fab>
    </div>
  );
};

export default NoteList;
