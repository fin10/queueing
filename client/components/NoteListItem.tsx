import { Chip, createStyles, Grid, ListItem, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
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
    info: {
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
    user: {
      float: 'right',
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
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography>{note.title}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1" className={classes.info}>
                <CommentIcon className={classes.icon} /> {note.like}
              </Typography>

              <Typography variant="subtitle1" className={classes.info}>
                <ThumbUpIcon className={classes.icon} /> {note.like}
              </Typography>

              <Typography variant="subtitle1" className={classes.info}>
                <ThumbDownIcon className={classes.icon} /> {note.dislike}
              </Typography>
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

export default NoteListItem;
