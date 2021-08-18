import { Chip, createStyles, Grid, ListItem, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { CommentAction, LikeAction, DislikeAction } from 'client/common/Action';
import { ExpireTime } from 'client/common/ExpireTime';
import { selectArticleSummaryById } from './articleSummarySlice';

interface PropTypes {
  readonly id: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginRight: {
      marginRight: theme.spacing(2),
    },
  }),
);

export default function ArticleSummaryItem(props: PropTypes) {
  const { id } = props;
  const summary = useSelector((state: RootState) => selectArticleSummaryById(state, id));
  const classes = useStyles();

  return (
    <ListItem button component={Link} to={`/article/${summary.id}`} divider={true}>
      <ListItemText
        primary={
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <Chip variant="outlined" size="small" label={summary.topic} />
            </Grid>

            <Grid item xs={4}>
              <Typography align="right" color="textSecondary" variant="body2">
                <ExpireTime expireTime={summary.expireTime} />
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>{summary.title}</Typography>
            </Grid>

            <Grid item xs={6}>
              <span className={classes.marginRight}>
                <CommentAction comments={summary.children} />
              </span>
              <span className={classes.marginRight}>
                <LikeAction likes={summary.likes} />
              </span>
              <span>
                <DislikeAction dislikes={summary.dislikes} />
              </span>
            </Grid>

            <Grid item xs={6}>
              <Typography align="right" color="textSecondary" variant="body2">
                {summary.creator}
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </ListItem>
  );
}
