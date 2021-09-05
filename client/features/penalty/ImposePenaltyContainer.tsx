import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import { fetchPenalties } from './penaltySlice';
import { useAppDispatch } from 'client/app/store';
import { unwrapResult } from '@reduxjs/toolkit';
import ErrorDialog from 'client/common/ErrorDialog';
import { Penalty } from './penaltyAPI';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

export default function ImposePenaltyContainer() {
  const { userId } = useParams<{ userId: string }>();

  const classes = useStyles();

  const [penalties, updatePenalties] = useState<Penalty[]>([]);
  const [errorDialogState, setErrorDialogState] = useState<{ open: boolean; message?: string }>({ open: false });

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPenalties(userId))
      .then(unwrapResult)
      .then((penalties) => updatePenalties(penalties))
      .catch((rejectedValue) => setErrorDialogState({ open: true, message: rejectedValue }));
  }, [dispatch]);

  return (
    <>
      <form>
        <TextField id="user" label="User ID" required value={userId} />
      </form>

      <ErrorDialog
        open={errorDialogState.open}
        onClose={() => setErrorDialogState({ open: false })}
        errorMessage={errorDialogState.message}
      />
    </>
  );
}
