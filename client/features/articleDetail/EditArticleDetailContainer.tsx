import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'client/app/store';
import { createArticle, fetchArticleDetail, updateArticle } from './articleDetailSlice';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import InputTopic from 'client/components/InputTopic';
import { ArticleBodyEntity } from './articleDetailAPI';
import ErrorDialog from 'client/common/ErrorDialog';
import { BODY_MAX_LENGTH, TITLE_MAX_LENGTH } from 'client/constants';
import { MaxLengthTextField } from 'client/common/MaxLengthTextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

function convertArticleBodyToString(body: ArticleBodyEntity[]) {
  return body.map((entity) => entity.value).join('');
}

export default function EditArticleDetailContainer() {
  const query = new URLSearchParams(useLocation().search);
  const id = query.get('id');

  const classes = useStyles();
  const [title, updateTitle] = useState('');
  const [topic, updateTopic] = useState('');
  const [body, updateBody] = useState('');
  const [errorDialogState, setErrorDialogState] = useState<{ open: boolean; message?: string }>({ open: false });

  const history = useHistory();
  const dispatch = useAppDispatch();

  if (id) {
    useEffect(() => {
      dispatch(fetchArticleDetail(id))
        .then(unwrapResult)
        .then((article) => {
          updateTitle(article.title);
          updateTopic(article.topic);
          updateBody(convertArticleBodyToString(article.body));
        })
        .catch((rejectedValue) => setErrorDialogState({ open: true, message: rejectedValue }));
    }, [dispatch]);
  }

  const handleTopicChange = (_event: unknown, newValue: string | null) => {
    updateTopic(newValue || '');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case 'title':
        updateTitle(event.target.value);
        break;
      case 'body':
        updateBody(event.target.value);
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const action = id ? updateArticle({ id, topic, title, body }) : createArticle({ topic, title, body });

    dispatch(action)
      .then(unwrapResult)
      .then((updated) => history.push(`/article/${updated.id}`))
      .catch((rejectedValue) => setErrorDialogState({ open: true, message: rejectedValue }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputTopic className={classes.margin} value={topic} onInputChange={handleTopicChange} />

      <MaxLengthTextField
        className={classes.margin}
        id="title"
        variant="outlined"
        required
        fullWidth
        onChange={handleChange}
        value={title}
        label={Resources.getString(StringID.EDIT_ARTICLE_TITLE)}
        maxLength={TITLE_MAX_LENGTH}
      />

      <MaxLengthTextField
        className={classes.margin}
        id="body"
        variant="outlined"
        fullWidth
        required
        multiline
        rows={20}
        onChange={handleChange}
        value={body}
        label={Resources.getString(StringID.EDIT_ARTICLE_BODY)}
        maxLength={BODY_MAX_LENGTH}
      />

      <Button variant="contained" size="large" color="primary" type="submit" fullWidth>
        {id ? Resources.getString(StringID.ACTION_UPDATE) : Resources.getString(StringID.ACTION_SUBMIT)}
      </Button>

      <ErrorDialog
        open={errorDialogState.open}
        onClose={() => setErrorDialogState({ open: false })}
        errorMessage={errorDialogState.message}
      />
    </form>
  );
}
