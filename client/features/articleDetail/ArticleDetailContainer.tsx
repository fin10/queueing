import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from 'client/features/articleDetail/ArticleCard';
import { fetchArticleDetail } from './articleDetailSlice';
import { useAppDispatch } from 'client/app/store';
import { Logger } from 'client/utils/Logger';
import { CommentsContainer } from '../comments/CommentsContainer';
import { fetchReportTypes } from '../reporting/reportingSlice';

export default function ArticleDetailContainer() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticleDetail(id))
      .then(unwrapResult)
      .catch((err) => Logger.error(err));

    dispatch(fetchReportTypes())
      .then(unwrapResult)
      .catch((err) => Logger.error(err));
  }, [dispatch]);

  return (
    <>
      <ArticleCard id={id} />
      <CommentsContainer articleId={id} />
    </>
  );
}
