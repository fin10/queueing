import axios from 'axios';
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Logger } from '../utils/Logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const NewNote = (): React.ReactElement => {
  const classes = useStyles();
  const [title, updateTitle] = useState('');
  const [topic, updateTopic] = useState('');
  const [body, updateBody] = useState('');

  const handleTopicChange = (event: unknown, newValue: string | null) => {
    updateTopic(newValue || '');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case 'title':
        updateTitle(event.target.value);
        break;
      case 'body':
        updateBody(event.target.value);
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await axios.post<string>('/api/notes', { topic, title, body });
      window.location.assign(`/notes/${res.data}`);
    } catch (err) {
      Logger.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Autocomplete
        id="topic"
        size="small"
        freeSolo
        fullWidth
        options={[]}
        value={topic}
        onInputChange={handleTopicChange}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField {...params} className={classes.margin} id="topic" label="Topic" variant="outlined" />
        )}
      />

      <TextField
        className={classes.margin}
        id="title"
        variant="outlined"
        fullWidth
        onChange={handleChange}
        value={title}
      />

      <TextField
        className={classes.margin}
        id="body"
        variant="outlined"
        fullWidth
        multiline
        rows={20}
        onChange={handleChange}
        value={body}
      />

      <Button variant="contained" size="large" color="primary" type="submit" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default NewNote;
