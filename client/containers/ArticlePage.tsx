import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logger } from '../utils/Logger';
import { NoteWithBody } from '../types';
import { Button, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import ArticleCard from '../components/ArticleCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const ArticlePage = (): React.ReactElement => {
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
      <ArticleCard note={note} />

      {comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <ArticleCard note={comment} />
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

export default ArticlePage;
