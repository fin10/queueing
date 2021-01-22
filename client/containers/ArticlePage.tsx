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

  const fetchArticle = async () => {
    try {
      const res = await axios.get<NoteWithBody>(`/api/article/${id}`);
      updateNote(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchArticle();
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

  const handleLikeAction = async () => {
    try {
      if (note) {
        await axios.post<{ state: boolean; count: number }>(`/api/action/like/${id}`);
        await fetchArticle();
      }
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
      <ArticleCard note={note} onLike={() => handleLikeAction()} onDelete={deleteArticle} />

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
