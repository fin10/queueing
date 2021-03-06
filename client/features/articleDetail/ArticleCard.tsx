import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Chip,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import ConfirmDialog from 'client/common/ConfirmDialog';
import { DislikeAction, LikeAction } from 'client/components/Action';
import { ExpireTime } from 'client/components/ExpireTime';
import ArticleDetailBody from './ArticleDetailBody';
import { RootState, useAppDispatch } from 'client/app/store';
import { useSelector } from 'react-redux';
import { dislikeArticle, likeArticle, removeArticle, selectArticleDetailById } from './articleDetailSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { Logger } from 'client/utils/Logger';
import ErrorDialog from 'client/common/ErrorDialog';
import { useHistory } from 'react-router-dom';
import qs from 'query-string';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topic: {
      marginBottom: theme.spacing(1),
    },
    actions: {
      justifyContent: 'center',
    },
    button: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const enum ActionType {
  REPORT = 'action-type-report',
  LIKE = 'action-type-like',
  DISLIKE = 'action-type-dislike',
  UPDATE = 'action-type-update',
  DELETE = 'action-type-delete',
  DELETE_CONFIRMED = 'action-type-delete-confirmed',
}

interface PropTypes {
  readonly id: string;
}

export default function ArticleCard({ id }: PropTypes) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [errorDialogState, setErrorDialogState] = useState<{ open: boolean; message?: string }>({ open: false });
  const [isRemoveDialogOpened, openRemoveDialog] = useState(false);

  const article = useSelector((state: RootState) => selectArticleDetailById(state, id));

  const handlActionClick = (elm: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switch (elm.currentTarget.id) {
      case ActionType.REPORT:
        break;
      case ActionType.LIKE:
        dispatch(likeArticle(id))
          .then(unwrapResult)
          .catch((err) => Logger.error(err));
        break;
      case ActionType.DISLIKE:
        dispatch(dislikeArticle(id))
          .then(unwrapResult)
          .catch((err) => Logger.error(err));
        break;
      case ActionType.UPDATE:
        history.push(`/article/new?${qs.stringify({ id })}`);
        break;
      case ActionType.DELETE:
        openRemoveDialog(true);
        break;
      case ActionType.DELETE_CONFIRMED:
        dispatch(removeArticle(id))
          .then(unwrapResult)
          .then(() => history.push('/'))
          .catch((rejectedValue) => {
            openRemoveDialog(false);
            setErrorDialogState({ open: true, message: rejectedValue });
          });
        break;
      default:
        throw new Error(`Not supported action type: ${elm.currentTarget.id}`);
    }
  };

  if (!article) return <div />;

  return (
    <>
      <Chip label={article.topic} variant="outlined" className={classes.topic} />
      <Card className={classes.margin}>
        <CardContent>
          <div className={classes.margin}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {article.user}
            </Typography>
            <Typography variant="h5">{article.title}</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <ExpireTime expireTime={article.expireTime} />
            </Typography>
          </div>
          <ArticleDetailBody body={article.body} />
        </CardContent>
        <CardActions className={classes.actions}>
          <ButtonGroup size="small" color="primary">
            <Button id={ActionType.REPORT} className={classes.button} onClick={handlActionClick}>
              {Resources.getString(StringID.ACTION_REPORT)}
            </Button>

            <Button
              id={ActionType.LIKE}
              className={classes.button}
              aria-label={Resources.getString(StringID.ACTION_LIKE)}
              onClick={handlActionClick}
            >
              <LikeAction likes={article.likes} />
            </Button>
            <Button
              id={ActionType.DISLIKE}
              className={classes.button}
              aria-label={Resources.getString(StringID.ACTION_DISLIKE)}
              onClick={handlActionClick}
            >
              <DislikeAction dislikes={article.dislikes} />
            </Button>

            <Button id={ActionType.UPDATE} className={classes.button} onClick={handlActionClick}>
              {Resources.getString(StringID.ACTION_UPDATE)}
            </Button>
            <Button id={ActionType.DELETE} className={classes.button} onClick={handlActionClick}>
              {Resources.getString(StringID.ACTION_DELETE)}
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>

      <ConfirmDialog
        id={ActionType.DELETE_CONFIRMED}
        open={isRemoveDialogOpened}
        onClose={() => openRemoveDialog(false)}
        contentText={Resources.getString(StringID.DIALOG_QUESTION_REMOVE_ARTICLE)}
        positiveText={Resources.getString(StringID.ACTION_DELETE)}
        onPositiveClick={handlActionClick}
      />

      <ErrorDialog
        open={errorDialogState.open}
        onClose={() => setErrorDialogState({ open: false })}
        errorMessage={errorDialogState.message}
      />
    </>
  );
}
