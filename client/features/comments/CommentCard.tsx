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
import React from 'react';
import { DislikeAction, LikeAction } from '../../components/Action';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { NoteBody } from 'client/features/body/NoteBody';
import { RootState } from 'client/app/store';
import { useSelector } from 'react-redux';
import { selectCommentById } from './commentsSlice';

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

  const comment = useSelector((state: RootState) => selectCommentById(state, id));

  return (
    <Card className={classes.margin} variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="subtitle2" color="textSecondary">
          {comment.creator}
        </Typography>
        <NoteBody entities={comment.body} />
      </CardContent>
      <CardActions className={classes.actions}>
        <ButtonGroup size="small" color="primary">
          <Button className={classes.button} aria-label={Resources.getString(StringID.ACTION_LIKE)}>
            <LikeAction likes={comment.likes} />
          </Button>
          <Button className={classes.button} aria-label={Resources.getString(StringID.ACTION_DISLIKE)}>
            <DislikeAction dislikes={comment.dislikes} />
          </Button>

          <Button className={classes.button}>{Resources.getString(StringID.ACTION_DELETE)}</Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}
