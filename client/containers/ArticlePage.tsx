import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArticleState, NoteWithBody } from '../types';
import ArticleCard from '../components/ArticleCard';
import InputComment from '../components/InputComment';
import CommentCard from '../components/CommentCard';
import * as Comment from '../app/Comment';
import { fetchArticle } from '../redux/article';

const ArticlePage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  const { article, removed, error } = useSelector<{ article: ArticleState }, ArticleState>((state) => state.article);
  const dispatch = useDispatch();

  const [comments, updateComments] = useState<NoteWithBody[]>([]);

  useEffect(() => {
    dispatch(fetchArticle(id));
  }, [dispatch]);

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

  if (error) {
    console.error(error.stack);
  }

  if (removed) {
    window.location.assign('/');
    return <div />;
  }

  if (!article) {
    return <div />;
  }

  return (
    <>
      <ArticleCard note={article} />

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
