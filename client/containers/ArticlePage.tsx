import _ from 'underscore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NoteWithBody } from '../types';
import ArticleCard from '../components/ArticleCard';
import InputComment from '../components/InputComment';
import CommentCard from '../components/CommentCard';
import * as Article from '../app/Article';
import * as Comment from '../app/Comment';

const ArticlePage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  const [note, updateNote] = useState<NoteWithBody>();
  const [comments, updateComments] = useState<NoteWithBody[]>([]);

  useEffect(() => {
    Article.fetch(id).then((note) => updateNote(note));
  }, []);

  useEffect(() => {
    Comment.fetchComments(id).then((comments) => updateComments(comments));
  }, []);

  const likeArticle = async (id: string) => {
    await Article.like(id);
    updateNote(await Article.fetch(id));
  };

  const likeComment = async (id: string) => {
    await Comment.like(id);
    const updated = await Comment.fetch(id);
    updateComments(comments.map((c) => (c.id === id ? updated : c)));
  };

  const deleteArticle = async () => {
    await Article.remove(id);
    window.location.assign('/');
  };

  const deleteComment = async (comment: NoteWithBody) => {
    await Comment.remove(comment.id);
    updateComments(_.without(comments, comment));
  };

  if (!note) {
    return <div />;
  }

  return (
    <>
      <ArticleCard note={note} onLike={() => likeArticle(id)} onDelete={deleteArticle} />

      {comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <CommentCard note={comment} onLike={() => likeComment(comment.id)} onDelete={() => deleteComment(comment)} />
        </React.Fragment>
      ))}

      <InputComment parentId={id} />
    </>
  );
};

export default ArticlePage;
