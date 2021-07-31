import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { DislikeAction, LikeAction } from '../../components/Action';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { NoteBody } from 'client/features/body/NoteBody';
import { RootState, useAppDispatch } from 'client/app/store';
import { useSelector } from 'react-redux';
import { dislikeComment, likeComment, removeComment, selectCommentById } from './commentsSlice';
import ConfirmDialog from 'client/common/ConfirmDialog';
import { ActionType } from 'client/features/action/ActionType';
import { unwrapResult } from '@reduxjs/toolkit';
import ErrorDialog from 'client/common/ErrorDialog';
import { Logger } from 'client/utils/Logger';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      justifyContent: 'center',
    },
    button: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    margin: {
      marginBottom: theme.spacing(1),
    },
  }),
);

interface PropTypes {
  readonly id: string;
}

export function CommentCard({ id }: PropTypes) {
  const classes = useStyles();

  const [isRemoveDialogOpened, openRemoveDialog] = useState(false);
  const [errorDialogState, setErrorDialogState] = useState<{ open: boolean; message?: string }>({ open: false });

  const comment = useSelector((state: RootState) => selectCommentById(state, id));
  const dispatch = useAppDispatch();

  const handlActionClick = (elm: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switch (elm.currentTarget.id) {
      case ActionType.LIKE:
        dispatch(likeComment(id))
          .then(unwrapResult)
          .catch((err) => Logger.error(err));
        break;
      case ActionType.DISLIKE:
        dispatch(dislikeComment(id))
          .then(unwrapResult)
          .catch((err) => Logger.error(err));
        break;
      case ActionType.DELETE:
        openRemoveDialog(true);
        break;
      case ActionType.DELETE_CONFIRMED:
        dispatch(removeComment(id))
          .then(unwrapResult)
          .catch((rejectedValue) => {
            openRemoveDialog(false);
            setErrorDialogState({ open: true, message: rejectedValue });
          });
        break;
      default:
        throw new Error(`Not supported action type: ${elm.currentTarget.id}`);
    }
  };

  return (
    <>
      <Card className={classes.margin} variant="outlined">
        <CardContent>
          <Typography gutterBottom variant="subtitle2" color="textSecondary">
            {comment.creator}
          </Typography>
          <NoteBody entities={comment.body} />
        </CardContent>
        <CardActions className={classes.actions}>
          <ButtonGroup size="small" color="primary">
            <Button
              id={ActionType.LIKE}
              className={classes.button}
              aria-label={Resources.getString(StringID.ACTION_LIKE)}
            >
              <LikeAction likes={comment.likes} />
            </Button>
            <Button
              id={ActionType.LIKE}
              className={classes.button}
              aria-label={Resources.getString(StringID.ACTION_DISLIKE)}
            >
              <DislikeAction dislikes={comment.dislikes} />
            </Button>

            <Button id={ActionType.DELETE} className={classes.button} onClick={handlActionClick}>
              {Resources.getString(StringID.ACTION_DELETE)}
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>

      <ConfirmDialog
        id={ActionType.DELETE_CONFIRMED}
        open={isRemoveDialogOpened}
        onClose={() => openRemoveDialog(false)}
        contentText={Resources.getString(StringID.DIALOG_QUESTION_REMOVE_COMMENT)}
        positiveText={Resources.getString(StringID.ACTION_DELETE)}
        onPositiveClick={handlActionClick}
      />

      <ErrorDialog
        open={errorDialogState.open}
        onClose={() => setErrorDialogState({ open: false })}
        errorMessage={errorDialogState.message}
      />
    </>
  );
}
