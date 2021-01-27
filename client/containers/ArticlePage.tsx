import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NoteWithBody } from '../types';
import ArticleCard from '../components/ArticleCard';
import InputComment from '../components/InputComment';
import CommentCard from '../components/CommentCard';
import * as Article from '../app/Article';
import * as Comment from '../app/Comment';

const ArticlePage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  const [note, updateNote] = useState<NoteWithBody>();
  const [comments, updateComments] = useState<NoteWithBody[]>([]);

  useEffect(() => {
    Article.fetch(id).then((note) => updateNote(note));
  }, []);

  const likeArticle = async (id: string) => {
    const updated = await Article.like(id);
    updateNote(updated);
  };

  const dislikeArticle = async (id: string) => {
    const updated = await Article.dislike(id);
    updateNote(updated);
  };

  const deleteArticle = async (id: string) => {
    await Article.remove(id);
    window.location.assign('/');
  };

  useEffect(() => {
    Comment.fetchComments(id).then((comments) => updateComments(comments));
  }, []);

  const likeComment = async (id: string) => {
    const updated = await Comment.like(id);
    updateComments(comments.map((c) => (c.id === id ? updated : c)));
  };

  const dislikeComment = async (id: string) => {
    const updated = await Comment.dislike(id);
    updateComments(comments.map((c) => (c.id === id ? updated : c)));
  };

  const deleteComment = async (id: string) => {
    await Comment.remove(id);
    updateComments(comments.filter((c) => c.id !== id));
  };

  if (!note) {
    return <div />;
  }

  return (
    <>
      <ArticleCard note={note} onLike={likeArticle} onDislike={dislikeArticle} onDelete={deleteArticle} />

      {comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <CommentCard note={comment} onLike={likeComment} onDislike={dislikeComment} onDelete={deleteComment} />
        </React.Fragment>
      ))}

      <InputComment parentId={id} />
    </>
  );
};

export default ArticlePage;
