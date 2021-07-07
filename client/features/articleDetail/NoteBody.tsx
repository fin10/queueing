import { createStyles, Link, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { ArticleBodyEntity, EntityType } from './articleDetailAPI';

const useStyles = makeStyles(() =>
  createStyles({
    fullWidth: {
      width: '100%',
    },
    youtubeContainer: {
      position: 'relative',
      width: '100%',
      paddingBottom: '56.25%',
    },
    youtube: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none',
    },
    text: {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  }),
);

const ArticleDetailBody = (props: { body: ArticleBodyEntity[] }): React.ReactElement => {
  const { body } = props;
  const classes = useStyles();

  return (
    <>
      {body.map((entity, idx) => {
        switch (entity.type) {
          case EntityType.IMAGE:
            return <img key={idx} className={classes.fullWidth} src={entity.value} />;
          case EntityType.VIDEO:
            return (
              <video key={idx} className={classes.fullWidth} controls>
                <source src={entity.value} />
              </video>
            );
          case EntityType.YOUTUBE:
            return (
              <div key={idx} className={classes.youtubeContainer}>
                <iframe className={classes.youtube} src={entity.value} allowFullScreen />
              </div>
            );
          case EntityType.LINK:
            return (
              <Link key={idx} href={entity.value}>
                {entity.value}
              </Link>
            );
          default:
            return (
              <Typography key={idx} className={classes.text}>
                {entity.value}
              </Typography>
            );
        }
      })}
    </>
  );
};

export default ArticleDetailBody;
