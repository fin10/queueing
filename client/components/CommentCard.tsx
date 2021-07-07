import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { DislikeAction, LikeAction } from './Action';
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import ArticleDetailBody from 'client/features/articleDetail/NoteBody';
import { NoteWithBody } from 'client/types';
import { ArticleBodyEntity } from 'client/features/articleDetail/articleDetailAPI';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      justifyContent: 'center',
    },
    button: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    margin: {
      marginBottom: theme.spacing(1),
    },
  }),
);

interface PropTypes {
  readonly note: NoteWithBody;
  readonly onActionClick: (action: string, id: string) => void;
}

const CommentCard = (props: PropTypes): React.ReactElement => {
  const { note, onActionClick } = props;
  const classes = useStyles();

  return (
    <Card className={classes.margin} variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="subtitle2" color="textSecondary">
          {note.user}
        </Typography>
        <ArticleDetailBody body={(note.body as unknown) as ArticleBodyEntity[]} />
      </CardContent>
      <CardActions className={classes.actions}>
        <ButtonGroup size="small" color="primary">
          <Button
            className={classes.button}
            aria-label={Resources.getString(StringID.ACTION_LIKE)}
            onClick={() => onActionClick('LIKE', note.id)}
          >
            <LikeAction likes={note.like} />
          </Button>
          <Button
            className={classes.button}
            aria-label={Resources.getString(StringID.ACTION_DISLIKE)}
            onClick={() => onActionClick('DISLIKE', note.id)}
          >
            <DislikeAction dislikes={note.dislike} />
          </Button>

          <Button className={classes.button} onClick={() => onActionClick('DELETE', note.id)}>
            {Resources.getString(StringID.ACTION_DELETE)}
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default CommentCard;
