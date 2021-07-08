import React from 'react';
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
import { DislikeAction, LikeAction } from 'client/components/Action';
import { ExpireTime } from 'client/components/ExpireTime';
import ArticleDetailBody from './ArticleDetailBody';
import { RootState, useAppDispatch } from 'client/app/store';
import { useSelector } from 'react-redux';
import { likeArticle, selectArticleDetailById } from './articleDetailSlice';
import { AsyncThunkAction, unwrapResult } from '@reduxjs/toolkit';
import { Logger } from 'client/utils/Logger';

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
}

interface PropTypes {
  readonly id: string;
}

export default function ArticleCard({ id }: PropTypes): React.ReactElement {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const article = useSelector((state: RootState) => selectArticleDetailById(state, id));

  const handlActionClick = (elm: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let action: AsyncThunkAction<unknown, string, unknown> = null;

    switch (elm.currentTarget.id) {
      case ActionType.REPORT:
        break;
      case ActionType.LIKE:
        action = likeArticle(id);
        break;
      case ActionType.DISLIKE:
        break;
      case ActionType.UPDATE:
        break;
      case ActionType.DELETE:
        break;
    }

    if (!action) return;

    dispatch(action)
      .then(unwrapResult)
      .catch((err) => Logger.error(err));
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
              <LikeAction likes={article.like} />
            </Button>
            <Button
              id={ActionType.DISLIKE}
              className={classes.button}
              aria-label={Resources.getString(StringID.ACTION_DISLIKE)}
              onClick={handlActionClick}
            >
              <DislikeAction dislikes={article.dislike} />
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
    </>
  );
}
