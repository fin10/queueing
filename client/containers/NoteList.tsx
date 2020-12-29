import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, Fab, Paper } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';
import { Logger } from '../utils/Logger';
import { Note } from '../types';
import NoteListItem from '../components/NoteListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(2),
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
    <Paper className={classes.paper}>
      <List dense={true}>
        {notes.map((note) => (
          <React.Fragment key={note.id}>
            <NoteListItem note={note} />
          </React.Fragment>
        ))}
      </List>
      <Fab className={classes.fab} color="primary" aria-label="create" href="/notes/new">
        <CreateIcon />
      </Fab>
    </Paper>
  );
};

export default NoteList;
