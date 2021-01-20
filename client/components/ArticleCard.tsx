import React, { useState } from 'react';
import qs from 'query-string';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Chip,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { Resources } from '../resources/Resources';
import { StringID } from '../resources/StringID';
import { NoteWithBody } from '../types';
import { DislikeAction, LikeAction } from './Action';
import { ExpireTime } from './ExpireTime';
import ConfirmDialog from './ConfirmDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      whiteSpace: 'pre-wrap',
    },
    topic: {
      marginBottom: theme.spacing(1),
    },
    actions: {
      justifyContent: 'center',
    },
    button: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    margin: {
      marginBottom: theme.spacing(2),
    },
  }),
);

const ArticleCard = (props: { note: NoteWithBody; onDelete: () => void }): React.ReactElement => {
  const { note, onDelete } = props;
  const classes = useStyles();

  const [isOpened, openConfirmDialog] = useState(false);

  return (
    <>
      <Chip label={note.topic} variant="outlined" className={classes.topic} />
      <Card className={classes.margin}>
        <CardContent>
          <div className={classes.margin}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {note.user}
            </Typography>
            <Typography variant="h5">{note.title}</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <ExpireTime expireTime={note.expireTime} />
            </Typography>
          </div>
          <Typography className={classes.body}>{note.body}</Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          <ButtonGroup size="small" color="primary">
            <Button className={classes.button} aria-label={Resources.getString(StringID.ACTION_LIKE)}>
              <LikeAction likes={note.like} />
            </Button>
            <Button className={classes.button} aria-label={Resources.getString(StringID.ACTION_DISLIKE)}>
              <DislikeAction dislikes={note.dislike} />
            </Button>

            <Button className={classes.button} href={`/article/new?` + qs.stringify({ id: note.id })}>
              {Resources.getString(StringID.ACTION_UPDATE)}
            </Button>
            <Button className={classes.button} onClick={() => openConfirmDialog(true)}>
              {Resources.getString(StringID.ACTION_DELETE)}
            </Button>
          </ButtonGroup>
        </CardActions>

        <ConfirmDialog
          open={isOpened}
          onClose={() => openConfirmDialog(false)}
          contentText={Resources.getString(StringID.DIALOG_QUESTION_REMOVE_ARTICLE)}
          positiveText={Resources.getString(StringID.ACTION_DELETE)}
          onPositiveClick={onDelete}
        />
      </Card>
    </>
  );
};

export default ArticleCard;
