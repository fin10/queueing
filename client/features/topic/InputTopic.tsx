import React, { useState, useEffect } from 'react';
import { Resources } from '../../resources/Resources';
import { StringID } from '../../resources/StringID';
import Autocomplete, { AutocompleteInputChangeReason, createFilterOptions } from '@material-ui/lab/Autocomplete';
import { Typography } from '@material-ui/core';
import { Logger } from '../../utils/Logger';
import { MaxLengthTextField } from 'client/common/MaxLengthTextField';
import { TOPIC_NAME_MAX_LENGTH } from 'client/constants';
import { fetchTopic, selectTopics } from './topicSlice';
import { Topic } from './topicAPI';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'client/app/store';
import { useSelector } from 'react-redux';

interface PropTypes {
  readonly className?: string;
  readonly value?: string;
  readonly onInputChange?: (
    event: React.ChangeEvent<unknown>,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void;
}

const filterOptions = createFilterOptions<Topic>({
  matchFrom: 'start',
  stringify: (option) => option.name,
});

const InputTopic = (props: PropTypes): React.ReactElement => {
  const [loading, updateLoading] = useState(true);

  const topics = useSelector(selectTopics);
  const dispatch = useAppDispatch();

  useEffect(() => {
    updateLoading(true);
    dispatch(fetchTopic())
      .then(unwrapResult)
      .catch((err) => Logger.error(err))
      .finally(() => updateLoading(false));
  }, []);

  const count = topics.find(({ name }) => props.value === name)?.count;

  return (
    <Autocomplete
      freeSolo
      options={topics}
      value={props.value ? { name: props.value, count } : null}
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
        <div className={props.className} ref={params.InputProps.ref}>
          <MaxLengthTextField
            {...params.inputProps}
            label={Resources.getString(StringID.EDIT_ARTICLE_TOPIC)}
            variant="outlined"
            size="small"
            fullWidth
            required
            maxLength={TOPIC_NAME_MAX_LENGTH}
          />
        </div>
      )}
    />
  );
};

export default InputTopic;
