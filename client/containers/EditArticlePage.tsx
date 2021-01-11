import axios from 'axios';
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import { Logger } from '../utils/Logger';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import InputTopic from '../components/InputTopic';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const EditArticlePage = (): React.ReactElement => {
  const classes = useStyles();
  const [title, updateTitle] = useState('');
  const [topic, updateTopic] = useState('');
  const [body, updateBody] = useState('');

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
      const res = await axios.post<string>('/api/article', { topic, title, body });
      window.location.assign(`/article/${res.data}`);
    } catch (err) {
      Logger.error(err);
    }
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
        {Resources.getString(StringID.EDIT_ARTICLE_SUBMIT)}
      </Button>
    </form>
  );
};

export default EditArticlePage;
