import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import Autocomplete, { AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { Topic } from '../types';
import { Logger } from '../utils/Logger';

interface PropTypes {
  className?: string;
  value?: string;
  onInputChange?: (event: React.ChangeEvent<unknown>, value: string, reason: AutocompleteInputChangeReason) => void;
}

const InputTopic = (props: PropTypes): React.ReactElement => {
  const [loading, updateLoading] = useState(true);
  const [topics, updateTopics] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/topic');
        const topics = res.data;
        updateTopics(topics.map((topic: Topic) => topic.name));
        updateLoading(false);
      } catch (err) {
        Logger.error(err);
      }
    })();
  }, []);

  return (
    <Autocomplete
      size="small"
      freeSolo
      fullWidth
      options={topics}
      value={props.value}
      loading={loading}
      loadingText={Resources.getString(StringID.EDIT_ARTICLE_LOADING_TOPICS)}
      onInputChange={props.onInputChange}
      getOptionLabel={(option) => option}
      renderInput={(params) => (
        <TextField
          {...params}
          className={props.className}
          label={Resources.getString(StringID.EDIT_ARTICLE_TOPIC)}
          variant="outlined"
        />
      )}
    />
  );
};

export default InputTopic;
