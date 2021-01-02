import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logger } from '../utils/Logger';
import { NoteWithBody } from '../types';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  createStyles,
  makeStyles,
  TextField,
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
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const Note = (): React.ReactElement => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();

  const [note, updateNote] = useState<NoteWithBody>();
  const [comments, updateComments] = useState<NoteWithBody[]>([]);
  const [comment, updateComment] = useState('');

  const fetchNote = async () => {
    try {
      const res = await axios.get<NoteWithBody>(`/api/article/${id}`);
      updateNote(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get<NoteWithBody[]>(`/api/comment/${id}`);
      updateComments(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  if (!note) {
    return <div />;
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case 'comment':
        updateComment(event.target.value);
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post<string>('/api/comment', { body: comment, parentId: id });
      window.location.reload();
    } catch (err) {
      Logger.error(err);
    }
  };

  return (
    <>
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

      {comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <Card className={classes.margin}>
            <CardContent>
              <Typography gutterBottom variant="subtitle1" color="textSecondary">
                {comment.user}
              </Typography>

              <Typography className={classes.body}>{comment.body}</Typography>
            </CardContent>
            <CardActions className={classes.actions}>
              <ButtonGroup size="small" color="primary">
                <Button className={classes.button}>
                  <LikeAction likes={comment.like} />
                </Button>
                <Button className={classes.button}>
                  <DislikeAction dislikes={comment.dislike} />
                </Button>
              </ButtonGroup>
            </CardActions>
          </Card>
        </React.Fragment>
      ))}

      <form onSubmit={handleSubmit}>
        <TextField
          className={classes.margin}
          id="comment"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          onChange={handleCommentChange}
          value={comment}
        />

        <Button variant="contained" size="large" color="primary" type="submit" fullWidth>
          Submit
        </Button>
      </form>
    </>
  );
};

export default Note;
