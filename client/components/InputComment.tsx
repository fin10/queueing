import axios from 'axios';
import React, { useState } from 'react';
import { Logger } from '../utils/Logger';
import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const InputComment = (props: { parentId: string }): React.ReactElement => {
  const { parentId } = props;
  const classes = useStyles();
  const [comment, updateComment] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post<string>('/api/comment', { body: comment, parentId });
      window.location.reload();
    } catch (err) {
      Logger.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        className={classes.margin}
        id="comment"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        onChange={(e) => updateComment(e.target.value)}
        value={comment}
      />

      <Button variant="contained" size="large" color="primary" type="submit" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default InputComment;
