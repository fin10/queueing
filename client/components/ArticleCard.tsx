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
import { NoteWithBody } from 'client/types';
import React from 'react';
import { DislikeAction, LikeAction } from './Action';

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
      marginBottom: theme.spacing(2),
    },
  }),
);

const ArticleCard = (props: { note: NoteWithBody }): React.ReactElement => {
  const classes = useStyles();
  const { note } = props;

  return (
    <Card className={classes.margin}>
      <CardContent>
        <Typography gutterBottom variant="subtitle1" color="textSecondary">
          {note.user}
        </Typography>

        <Typography className={classes.body}>{note.body}</Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        <ButtonGroup size="small" color="primary">
          <Button className={classes.button}>
            <LikeAction likes={note.like} />
          </Button>
          <Button className={classes.button}>
            <DislikeAction dislikes={note.dislike} />
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default ArticleCard;
