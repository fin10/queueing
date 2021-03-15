import React from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Chip,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import { NoteWithBody } from '../types';
import { DislikeAction, LikeAction } from './Action';
import { ExpireTime } from './ExpireTime';
import NoteBody from './NoteBody';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topic: {
      marginBottom: theme.spacing(1),
    },
    actions: {
      justifyContent: 'center',
    },
    button: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

interface PropTypes {
  readonly note: NoteWithBody;
  readonly onActionClick: (action: string, id: string) => void;
}

const ArticleCard = (props: PropTypes): React.ReactElement => {
  const { note, onActionClick } = props;
  const classes = useStyles();

  return (
    <>
      <Chip label={note.topic} variant="outlined" className={classes.topic} />
      <Card className={classes.margin}>
        <CardContent>
          <div className={classes.margin}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {note.user}
            </Typography>
            <Typography variant="h5">{note.title}</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <ExpireTime expireTime={note.expireTime} />
            </Typography>
          </div>
          <NoteBody body={note.body} />
        </CardContent>
        <CardActions className={classes.actions}>
          <ButtonGroup size="small" color="primary">
            <Button className={classes.button} onClick={() => onActionClick('REPORT', note.id)}>
              {Resources.getString(StringID.ACTION_REPORT)}
            </Button>

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

            <Button className={classes.button} onClick={() => onActionClick('UPDATE', note.id)}>
              {Resources.getString(StringID.ACTION_UPDATE)}
            </Button>
            <Button className={classes.button} onClick={() => onActionClick('DELETE', note.id)}>
              {Resources.getString(StringID.ACTION_DELETE)}
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>
    </>
  );
};

export default ArticleCard;
