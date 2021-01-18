import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { Logger } from '../utils/Logger';
import { NoteWithBody } from '../types';
import ArticleCard from '../components/ArticleCard';
import InputComment from '../components/InputComment';
import CommentCard from '../components/CommentCard';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      textAlign: 'right',
      marginBottom: theme.spacing(2),
    },
  }),
);

const ArticlePage = (): React.ReactElement => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();

  const [note, updateNote] = useState<NoteWithBody>();
  const [comments, updateComments] = useState<NoteWithBody[]>([]);

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

  const deleteArticle = async () => {
    try {
      await axios.delete(`/api/article/${id}`);
      window.location.assign('/');
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

  return (
    <>
      <ArticleCard note={note} />

      <div className={classes.actions}>
        <Button variant="contained" disableElevation onClick={deleteArticle}>
          {Resources.getString(StringID.ACTION_DELETE)}
        </Button>
      </div>

      {comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <CommentCard note={comment} />
        </React.Fragment>
      ))}

      <InputComment parentId={id} />
    </>
  );
};

export default ArticlePage;
