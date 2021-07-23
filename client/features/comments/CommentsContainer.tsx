import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'client/app/store';
import { Logger } from 'client/utils/Logger';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CommentCard } from './CommentCard';
import { fetchComments, selectCommentIds } from './commentsSlice';
import { InputComment } from './InputComment';

interface PropTypes {
  readonly articleId: string;
}

export function CommentsContainer({ articleId }: PropTypes) {
  const commentIds = useSelector(selectCommentIds);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchComments(articleId))
      .then(unwrapResult)
      .catch((err) => Logger.error(err.stack));
  }, [dispatch]);

  return (
    <>
      {commentIds.map((id) => (
        <React.Fragment key={id}>
          <CommentCard id={id} />
        </React.Fragment>
      ))}

      <InputComment articleId={articleId} />
    </>
  );
}
