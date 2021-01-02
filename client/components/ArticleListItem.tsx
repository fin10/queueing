import { Chip, createStyles, Grid, ListItem, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import { Note } from '../types';
import { CommentAction, LikeAction, DislikeAction } from './Action';

interface PropTypes {
  note: Note;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    marginRight: {
      marginRight: theme.spacing(2),
    },
    user: {
      float: 'right',
    },
  }),
);

const ArticleListItem = (props: PropTypes): React.ReactElement => {
  const { note } = props;
  const classes = useStyles();

  return (
    <ListItem button component={Link} to={`/notes/${note.id}`} divider={true}>
      <ListItemText
        primary={
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>{note.title}</Typography>
            </Grid>

            <Grid item xs={6}>
              <span className={classes.marginRight}>
                <CommentAction comments={note.children} />
              </span>
              <span className={classes.marginRight}>
                <LikeAction likes={note.like} />
              </span>
              <span>
                <DislikeAction dislikes={note.dislike} />
              </span>
            </Grid>

            <Grid item xs={6}>
              <Chip variant="outlined" size="small" label={note.user} className={classes.user} />
            </Grid>
          </Grid>
        }
      />
    </ListItem>
  );
};

export default ArticleListItem;
