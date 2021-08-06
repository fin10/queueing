import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import ArticleCard from 'client/features/articleDetail/ArticleCard';
import { fetchArticleDetail } from './articleDetailSlice';
import { useAppDispatch } from 'client/app/store';
import { Logger } from 'client/utils/Logger';
import { CommentsContainer } from '../comments/CommentsContainer';
import { fetchReportTypes } from '../reporting/reportingSlice';

export default function ArticleDetailContainer() {
  const { id } = useParams<{ id: string }>();

  const [isAlertOpened, openAlert] = useState(false);

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

      <Snackbar open={isAlertOpened} autoHideDuration={10000} onClose={() => openAlert(false)}>
        <Alert severity="success">{Resources.getString(StringID.REPORT_SUCCEED)}</Alert>
      </Snackbar>
    </>
  );
}
