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
import { NoteWithBody } from '../types';
import React from 'react';
import { DislikeAction, LikeAction } from './Action';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      whiteSpace: 'pre-wrap',
    },
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
  const classes = useStyles();
  const { note } = props;

  return (
    <Card className={classes.margin} variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="subtitle2" color="textSecondary">
          {note.user}
        </Typography>
        <Typography className={classes.body} variant="body2">
          {note.body}
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <ButtonGroup size="small" color="primary">
          <Button className={classes.button} aria-label={Resources.getString(StringID.ACTION_LIKE)}>
            <LikeAction likes={note.like} />
          </Button>
          <Button className={classes.button} aria-label={Resources.getString(StringID.ACTION_DISLIKE)}>
            <DislikeAction dislikes={note.dislike} />
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default CommentCard;
