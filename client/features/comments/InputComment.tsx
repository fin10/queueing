import React, { useState } from 'react';
import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { addComment } from './commentsSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'client/app/store';
import { Logger } from 'client/utils/Logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

interface PropTypes {
  readonly articleId: string;
}

export function InputComment({ articleId }: PropTypes) {
  const classes = useStyles();
  const [comment, updateComment] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(addComment({ articleId, body: comment }))
      .then(unwrapResult)
      .then(() => updateComment(''))
      .catch((err) => Logger.error(err.stack));
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
        {Resources.getString(StringID.INPUT_COMMENT_SUBMIT)}
      </Button>
    </form>
  );
}
