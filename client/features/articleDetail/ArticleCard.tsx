import React from 'react';
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
import { Resources } from 'client/resources/Resources';
import { StringID } from 'client/resources/StringID';
import { DislikeAction, LikeAction } from 'client/components/Action';
import { ExpireTime } from 'client/components/ExpireTime';
import ArticleDetailBody from './ArticleDetailBody';
import { ArticleDetail } from './articleDetailAPI';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

interface PropTypes {
  readonly note: ArticleDetail;
  readonly onActionClick?: (action: string, id: string) => void;
}

const ArticleCard = ({ note, onActionClick }: PropTypes): React.ReactElement => {
  const classes = useStyles();

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
          <ArticleDetailBody body={note.body} />
        </CardContent>
        <CardActions className={classes.actions}>
          <ButtonGroup size="small" color="primary">
            <Button className={classes.button} onClick={() => onActionClick && onActionClick('REPORT', note.id)}>
              {Resources.getString(StringID.ACTION_REPORT)}
            </Button>

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

            <Button className={classes.button} onClick={() => onActionClick && onActionClick('UPDATE', note.id)}>
              {Resources.getString(StringID.ACTION_UPDATE)}
            </Button>
            <Button className={classes.button} onClick={() => onActionClick && onActionClick('DELETE', note.id)}>
              {Resources.getString(StringID.ACTION_DELETE)}
            </Button>
          </ButtonGroup>
        </CardActions>
      </Card>
    </>
  );
};

export default ArticleCard;
