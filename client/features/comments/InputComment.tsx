import React, { useState } from 'react';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { addComment } from './commentsSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'client/app/store';
import { MaxLengthTextField } from 'client/common/MaxLengthTextField';
import { BODY_MAX_LENGTH } from 'client/constants';
import ErrorDialog from 'client/common/ErrorDialog';

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
  const [errorDialogState, setErrorDialogState] = useState<{ open: boolean; message?: string }>({ open: false });

  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(addComment({ articleId, body: comment }))
      .then(unwrapResult)
      .then(() => updateComment(''))
      .catch((rejectedValue) => setErrorDialogState({ open: true, message: rejectedValue }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <MaxLengthTextField
        className={classes.margin}
        id="comment"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        onChange={(e) => updateComment(e.target.value)}
        value={comment}
        maxLength={BODY_MAX_LENGTH}
      />

      <Button variant="contained" size="large" color="primary" type="submit" fullWidth>
        {Resources.getString(StringID.INPUT_COMMENT_SUBMIT)}
      </Button>

      <ErrorDialog
        open={errorDialogState.open}
        onClose={() => setErrorDialogState({ open: false })}
        errorMessage={errorDialogState.message}
      />
    </form>
  );
}
