import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ArticleState, CommentState } from '../types';
import ArticleCard from 'client/features/articleDetail/ArticleCard';
import { InputComment } from 'client/features/comments/InputComment';
import { CommentCard } from 'client/features/comments/CommentCard';
import { dislikeArticle, fetchArticle, likeArticle, removeArticle } from 'client/redux/article';
import { dislikeComment, fetchComments, likeComment } from 'client/redux/comment';
import { Resources } from 'client/resources/Resources';
import ConfirmDialog from 'client/common/ConfirmDialog';
import ReportDialog from 'client/features/reporting/ReportDialog';
import { StringID } from 'client/resources/StringID';
import { postReport } from 'client/redux/report';

const ArticlePage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  const [isRemoveDialogOpened, openRemoveDialog] = useState(false);
  const [isReportDialogOpened, openReportDialog] = useState(false);
  const [isAlertOpened, openAlert] = useState(false);

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

  const handleArticleAction = (action: string, id: string, type?: string) => {
    switch (action) {
      case 'UPDATE':
        window.location.assign(`/article/new?${qs.stringify({ id })}`);
        break;
      case 'REPORT':
        openReportDialog(true);
        break;
      case 'REPORT_CONFIRMED':
        if (type) {
          dispatch(
            postReport(id, type, () => {
              openReportDialog(false);
              openAlert(true);
            }),
          );
        }
        break;
      case 'LIKE':
        dispatch(likeArticle(id));
        break;
      case 'DISLIKE':
        dispatch(dislikeArticle(id));
        break;
      case 'DELETE':
        openRemoveDialog(true);
        break;
      case 'DELETE_CONFIRMED':
        dispatch(removeArticle(id));
        break;
    }
  };

  const handleCommentAction = (action: string, id: string) => {
    switch (action) {
      case 'LIKE':
        dispatch(likeComment(id));
        break;
      case 'DISLIKE':
        dispatch(dislikeComment(id));
        break;
      case 'DELETE':
        break;
    }
  };

  return (
    <>
      <ArticleCard id={id} />

      {commentState.comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <CommentCard id={comment.id} />
        </React.Fragment>
      ))}

      <InputComment articleId={id} />

      <ConfirmDialog
        open={isRemoveDialogOpened}
        onClose={() => openRemoveDialog(false)}
        contentText={Resources.getString(StringID.DIALOG_QUESTION_REMOVE_ARTICLE)}
        positiveText={Resources.getString(StringID.ACTION_DELETE)}
        onPositiveClick={() => handleArticleAction('DELETE_CONFIRMED', id)}
      />

      <ReportDialog
        open={isReportDialogOpened}
        onClose={() => openReportDialog(false)}
        onReportClick={(type?: string) => handleArticleAction('REPORT_CONFIRMED', id, type)}
      />

      <Snackbar open={isAlertOpened} autoHideDuration={10000} onClose={() => openAlert(false)}>
        <Alert severity="success">{Resources.getString(StringID.REPORT_SUCCEED)}</Alert>
      </Snackbar>
    </>
  );
};

export default ArticlePage;
