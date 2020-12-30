import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logger } from '../utils/Logger';
import { Note } from '../types';
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
import { DislikeAction, LikeAction } from '../components/Action';

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
  }),
);

const Note = (): React.ReactElement => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const [note, updateNote] = useState<Note>();

  const fetchNote = async () => {
    try {
      const res = await axios.get<Note>(`/api/notes/${id}`);
      updateNote(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  if (!note) {
    return <div />;
  }

  return (
    <>
      <Card>
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
    </>
  );
};

export default Note;
