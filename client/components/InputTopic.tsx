import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import Autocomplete, { AutocompleteInputChangeReason, createFilterOptions } from '@material-ui/lab/Autocomplete';
import { Typography } from '@material-ui/core';
import { Topic } from '../types';
import { Logger } from '../utils/Logger';
import { MaxLengthTextField } from 'client/common/MaxLengthTextField';
import { TOPIC_NAME_MAX_LENGTH } from 'client/constants';

interface PropTypes {
  className?: string;
  value?: string;
  onInputChange?: (event: React.ChangeEvent<unknown>, value: string, reason: AutocompleteInputChangeReason) => void;
}

const filterOptions = createFilterOptions<Topic>({
  matchFrom: 'start',
  stringify: (option) => option.name,
});

const InputTopic = (props: PropTypes): React.ReactElement => {
  const [loading, updateLoading] = useState(true);
  const [topics, updateTopics] = useState<Topic[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/topic');
        const topics = res.data;
        updateTopics(topics);
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
      value={props.value ? { name: props.value } : null}
      loading={loading}
      loadingText={Resources.getString(StringID.EDIT_ARTICLE_LOADING_TOPICS)}
      onInputChange={props.onInputChange}
      getOptionLabel={(option) => option.name}
      filterOptions={filterOptions}
      renderOption={(option) => (
        <Typography>
          {option.name}{' '}
          <Typography component="span" color="textSecondary">
            ({option.count})
          </Typography>
        </Typography>
      )}
      renderInput={(params) => (
        <MaxLengthTextField
          {...params}
          className={props.className}
          label={Resources.getString(StringID.EDIT_ARTICLE_TOPIC)}
          variant="outlined"
          required
          maxLength={TOPIC_NAME_MAX_LENGTH}
        />
      )}
    />
  );
};

export default InputTopic;
