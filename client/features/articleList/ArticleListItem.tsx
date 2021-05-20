import { Chip, createStyles, Grid, ListItem, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { CommentAction, LikeAction, DislikeAction } from '../../components/Action';
import { ExpireTime } from '../../components/ExpireTime';
import { selectArticleById } from './articleListSlice';

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

export default function ArticleListItem(props: PropTypes) {
  const { id } = props;
  const article = useSelector((state: RootState) => selectArticleById(state, id));
  const classes = useStyles();

  return (
    <ListItem button component={Link} to={`/article/${article.id}`} divider={true}>
      <ListItemText
        primary={
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <Chip variant="outlined" size="small" label={article.topic} />
            </Grid>

            <Grid item xs={4}>
              <Typography align="right" color="textSecondary" variant="body2">
                <ExpireTime expireTime={article.expireTime} />
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>{article.title}</Typography>
            </Grid>

            <Grid item xs={6}>
              <span className={classes.marginRight}>
                <CommentAction comments={article.children} />
              </span>
              <span className={classes.marginRight}>
                <LikeAction likes={article.like} />
              </span>
              <span>
                <DislikeAction dislikes={article.dislike} />
              </span>
            </Grid>

            <Grid item xs={6}>
              <Typography align="right" color="textSecondary" variant="body2">
                {article.user}
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </ListItem>
  );
}
