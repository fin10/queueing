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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      whiteSpace: 'pre-wrap',
    },
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

const ArticleCard = (props: { note: NoteWithBody }): React.ReactElement => {
  const { note } = props;
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
          <Typography className={classes.body}>{note.body}</Typography>
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
    </>
  );
};

export default ArticleCard;
