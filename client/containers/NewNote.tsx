import axios from 'axios';
import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    contents: {
      display: 'block',
    },
    submit: {},
  }),
);

const NewNote = (): React.ReactElement => {
  const classes = useStyles();
  const [contents, updateContents] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateContents(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post('/api/notes', { body: contents });
      window.location.assign('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.contents}
          id="contents"
          label="Contents"
          multiline
          rows={10}
          onChange={handleChange}
          value={contents}
        />
        <Button className={classes.submit} variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default NewNote;
