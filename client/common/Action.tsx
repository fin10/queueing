import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import CommentIcon from '@material-ui/icons/Comment';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    info: {
      display: 'inline-flex',
      alignItems: 'center',
    },
    icon: {
      ...theme.typography.caption,
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
      padding: theme.spacing(0.5),
      marginRight: 6,
      borderRadius: '50%',
    },
  }),
);

export function CommentAction(props: { comments: number }): React.ReactElement {
  const { comments } = props;
  const classes = useStyles();

  return (
    <Typography variant="subtitle1" className={classes.info}>
      <CommentIcon className={classes.icon} /> {comments}
    </Typography>
  );
}

export function LikeAction(props: { likes: number }): React.ReactElement {
  const { likes } = props;
  const classes = useStyles();

  return (
    <Typography variant="subtitle1" className={classes.info}>
      <ThumbUpIcon className={classes.icon} /> {likes}
    </Typography>
  );
}

export function DislikeAction(props: { dislikes: number }): React.ReactElement {
  const { dislikes } = props;
  const classes = useStyles();

  return (
    <Typography variant="subtitle1" className={classes.info}>
      <ThumbDownIcon className={classes.icon} /> {dislikes}
    </Typography>
  );
}
