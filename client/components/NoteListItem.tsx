import { createStyles, ListItem, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { Link } from 'react-router-dom';
import { Note } from '../types';
import React from 'react';

interface PropTypes {
  note: Note;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBlock: theme.spacing(1),
    },
    info: {
      ...theme.typography.subtitle1,
      marginRight: theme.spacing(2),
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

const NoteListItem = (props: PropTypes): React.ReactElement => {
  const { note } = props;
  const classes = useStyles();

  return (
    <ListItem button component={Link} to={`/notes/${note.id}`} divider={true}>
      <ListItemText
        primary={
          <>
            <Typography className={classes.title}>{note.title}</Typography>

            <Typography className={classes.info}>
              <CommentIcon className={classes.icon} /> {note.like}
            </Typography>

            <Typography className={classes.info}>
              <ThumbUpIcon className={classes.icon} /> {note.like}
            </Typography>

            <Typography className={classes.info}>
              <ThumbDownIcon className={classes.icon} /> {note.dislike}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
};

export default NoteListItem;
