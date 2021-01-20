import _ from 'underscore';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logger } from '../utils/Logger';
import { NoteWithBody } from '../types';
import ArticleCard from '../components/ArticleCard';
import InputComment from '../components/InputComment';
import CommentCard from '../components/CommentCard';

const ArticlePage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  const [note, updateNote] = useState<NoteWithBody>();
  const [comments, updateComments] = useState<NoteWithBody[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<NoteWithBody>(`/api/article/${id}`);
        updateNote(res.data);
      } catch (err) {
        Logger.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<NoteWithBody[]>(`/api/comment/${id}`);
        updateComments(res.data);
      } catch (err) {
        Logger.error(err);
      }
    })();
  }, []);

  const deleteArticle = async () => {
    try {
      await axios.delete(`/api/article/${id}`);
      window.location.assign('/');
    } catch (err) {
      Logger.error(err);
    }
  };

  const deleteComment = async (comment: NoteWithBody) => {
    try {
      await axios.delete(`/api/comment/${comment.id}`);
      updateComments(_.without(comments, comment));
    } catch (err) {
      Logger.error(err);
    }
  };

  if (!note) {
    return <div />;
  }

  return (
    <>
      <ArticleCard note={note} onDelete={deleteArticle} />

      {comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <CommentCard note={comment} onDelete={() => deleteComment(comment)} />
        </React.Fragment>
      ))}

      <InputComment parentId={id} />
    </>
  );
};

export default ArticlePage;
