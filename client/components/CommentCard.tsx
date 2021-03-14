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
import { useDispatch } from 'react-redux';
import { DislikeAction, LikeAction } from './Action';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import ConfirmDialog from './ConfirmDialog';
import NoteBody from './NoteBody';
import { NoteWithBody } from '../types';
import { dislikeComment, likeComment, removeComment } from '../redux/comment';

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

const CommentCard = (props: { note: NoteWithBody }): React.ReactElement => {
  const { note } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isOpened, openConfirmDialog] = useState(false);

  return (
    <Card className={classes.margin} variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="subtitle2" color="textSecondary">
          {note.user}
        </Typography>
        <NoteBody body={note.body} />
      </CardContent>
      <CardActions className={classes.actions}>
        <ButtonGroup size="small" color="primary">
          <Button
            className={classes.button}
            aria-label={Resources.getString(StringID.ACTION_LIKE)}
            onClick={() => dispatch(likeComment(note.id))}
          >
            <LikeAction likes={note.like} />
          </Button>
          <Button
            className={classes.button}
            aria-label={Resources.getString(StringID.ACTION_DISLIKE)}
            onClick={() => dispatch(dislikeComment(note.id))}
          >
            <DislikeAction dislikes={note.dislike} />
          </Button>

          <Button className={classes.button} onClick={() => openConfirmDialog(true)}>
            {Resources.getString(StringID.ACTION_DELETE)}
          </Button>
        </ButtonGroup>
      </CardActions>

      <ConfirmDialog
        open={isOpened}
        onClose={() => openConfirmDialog(false)}
        contentText={Resources.getString(StringID.DIALOG_QUESTION_REMOVE_cOMMENT)}
        positiveText={Resources.getString(StringID.ACTION_DELETE)}
        onPositiveClick={() => dispatch(removeComment(note.id))}
      />
    </Card>
  );
};

export default CommentCard;
