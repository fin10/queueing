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
import { DislikeAction, LikeAction } from './Action';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import NoteBody from './NoteBody';
import { NoteWithBody } from '../types';

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
  readonly note: NoteWithBody;
  readonly onActionClick: (action: string, id: string) => void;
}

const CommentCard = (props: PropTypes): React.ReactElement => {
  const { note, onActionClick } = props;
  const classes = useStyles();

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
            onClick={() => onActionClick('LIKE', note.id)}
          >
            <LikeAction likes={note.like} />
          </Button>
          <Button
            className={classes.button}
            aria-label={Resources.getString(StringID.ACTION_DISLIKE)}
            onClick={() => onActionClick('DISLIKE', note.id)}
          >
            <DislikeAction dislikes={note.dislike} />
          </Button>

          <Button className={classes.button} onClick={() => onActionClick('DELETE', note.id)}>
            {Resources.getString(StringID.ACTION_DELETE)}
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default CommentCard;
