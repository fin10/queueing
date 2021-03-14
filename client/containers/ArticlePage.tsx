import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArticleState, CommentState } from '../types';
import ArticleCard from '../components/ArticleCard';
import InputComment from '../components/InputComment';
import CommentCard from '../components/CommentCard';
import { fetchArticle } from '../redux/article';
import { fetchComments } from '../redux/comment';

const ArticlePage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  const articleState = useSelector<{ article: ArticleState }, ArticleState>((state) => state.article);
  const commentState = useSelector<{ comment: CommentState }, CommentState>((state) => state.comment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArticle(id));
    dispatch(fetchComments(id));
  }, [dispatch]);

  if (articleState.error) console.error(articleState.error.stack);
  if (commentState.error) console.error(commentState.error.stack);

  if (articleState.removed) {
    window.location.assign('/');
    return <div />;
  }

  if (!articleState.article) {
    return <div />;
  }

  return (
    <>
      <ArticleCard note={articleState.article} />

      {commentState.comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <CommentCard note={comment} />
        </React.Fragment>
      ))}

      <InputComment parentId={id} />
    </>
  );
};

export default ArticlePage;
