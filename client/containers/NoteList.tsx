import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, Fab } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';
import { Note } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 16,
    },
  }),
);

const fetchNotes = async (update: React.Dispatch<React.SetStateAction<Note[]>>) => {
  try {
    const res = await axios.get<Note[]>('/api/notes');
    update(res.data);
  } catch (err) {
    console.error(err);
  }
};

const NoteList = (): React.ReactElement => {
  const [notes, updateNotes] = useState<Note[]>([]);
  const classes = useStyles();

  useEffect(() => {
    fetchNotes(updateNotes);
  }, []);

  return (
    <div className={classes.root}>
      <h2>Queueing</h2>
      <List>
        {notes.map((note) => {
          return (
            <ListItem key={note._id}>
              <ListItemText primary={note.title} />
            </ListItem>
          );
        })}
      </List>
      <Fab className={classes.fab} color="primary" aria-label="create" href="/new">
        <CreateIcon />
      </Fab>
    </div>
  );
};

export default NoteList;
