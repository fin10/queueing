import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { Logger } from '../utils/Logger';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import InputTopic from '../components/InputTopic';
import { NoteWithBody } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const EditArticlePage = (): React.ReactElement => {
  const query = new URLSearchParams(useLocation().search);
  const id = query.get('id');

  const classes = useStyles();
  const [title, updateTitle] = useState('');
  const [topic, updateTopic] = useState('');
  const [body, updateBody] = useState('');

  if (id) {
    useEffect(() => {
      (async () => {
        try {
          const res = await axios.get<NoteWithBody>(`/api/article/${id}`);
          updateTitle(res.data.title);
          updateTopic(res.data.topic);
          updateBody(res.data.body);
        } catch (err) {
          Logger.error(err);
        }
      })();
    }, []);
  }

  const handleTopicChange = (event: unknown, newValue: string | null) => {
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await axios.post<string>('/api/article', { id, topic, title, body });
      window.location.assign(`/article/${res.data}`);
    } catch (err) {
      Logger.error(err);
    }
  };

  const submitText = id ? Resources.getString(StringID.ACTION_UPDATE) : Resources.getString(StringID.ACTION_SUBMIT);

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
        {submitText}
      </Button>
    </form>
  );
};

export default EditArticlePage;
