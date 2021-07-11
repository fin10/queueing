import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'client/app/store';
import { fetchArticleDetail, updateArticle } from './articleDetailSlice';
import { Logger } from 'client/utils/Logger';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import InputTopic from 'client/components/InputTopic';
import { ArticleBodyEntity } from './articleDetailAPI';

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
        .catch((err) => Logger.error(err));
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

    dispatch(updateArticle({ id, topic, title, body }))
      .then(unwrapResult)
      .then((updated) => history.push(`/article/${updated.id}`))
      .catch((err) => Logger.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputTopic className={classes.margin} value={topic} onInputChange={handleTopicChange} />

      <TextField
        className={classes.margin}
        id="title"
        variant="outlined"
        fullWidth
        onChange={handleChange}
        value={title}
        label={Resources.getString(StringID.EDIT_ARTICLE_TITLE)}
      />

      <TextField
        className={classes.margin}
        id="body"
        variant="outlined"
        fullWidth
        multiline
        rows={20}
        onChange={handleChange}
        value={body}
        label={Resources.getString(StringID.EDIT_ARTICLE_BODY)}
      />

      <Button variant="contained" size="large" color="primary" type="submit" fullWidth>
        {id ? Resources.getString(StringID.ACTION_UPDATE) : Resources.getString(StringID.ACTION_SUBMIT)}
      </Button>
    </form>
  );
}
