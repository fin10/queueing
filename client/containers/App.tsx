import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
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

export default (): React.ReactElement => {
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
    </div>
  );
};
