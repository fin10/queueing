import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import ArticleCard from 'client/features/articleDetail/ArticleCard';
import ConfirmDialog from 'client/components/ConfirmDialog';
import InputComment from 'client/components/InputComment';
import ReportDialog from 'client/components/ReportDialog';
import { fetchArticleDetail } from './articleDetailSlice';
import { useAppDispatch } from 'client/app/store';
import { Logger } from 'client/utils/Logger';

export default function ArticleDetailContainer() {
  const { id } = useParams<{ id: string }>();

  const [isRemoveDialogOpened, openRemoveDialog] = useState(false);
  const [isReportDialogOpened, openReportDialog] = useState(false);
  const [isAlertOpened, openAlert] = useState(false);
  const [, updateLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    updateLoading(true);
    dispatch(fetchArticleDetail(id))
      .then(unwrapResult)
      .catch((err) => Logger.error(err))
      .finally(() => updateLoading(false));
  }, [dispatch]);

  const dummyFunction = () => {
    return;
  };

  return (
    <>
      <ArticleCard id={id} />

      <InputComment parentId={id} />

      <ConfirmDialog
        open={isRemoveDialogOpened}
        onClose={() => openRemoveDialog(false)}
        contentText={Resources.getString(StringID.DIALOG_QUESTION_REMOVE_ARTICLE)}
        positiveText={Resources.getString(StringID.ACTION_DELETE)}
        onPositiveClick={dummyFunction}
      />

      <ReportDialog open={isReportDialogOpened} onClose={() => openReportDialog(false)} onReportClick={dummyFunction} />

      <Snackbar open={isAlertOpened} autoHideDuration={10000} onClose={() => openAlert(false)}>
        <Alert severity="success">{Resources.getString(StringID.REPORT_SUCCEED)}</Alert>
      </Snackbar>
    </>
  );
}
