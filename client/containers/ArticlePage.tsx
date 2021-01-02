import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logger } from '../utils/Logger';
import { NoteWithBody } from '../types';
import ArticleCard from '../components/ArticleCard';
import InputComment from '../components/InputComment';

const ArticlePage = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();

  const [note, updateNote] = useState<NoteWithBody>();
  const [comments, updateComments] = useState<NoteWithBody[]>([]);

  const fetchNote = async () => {
    try {
      const res = await axios.get<NoteWithBody>(`/api/article/${id}`);
      updateNote(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get<NoteWithBody[]>(`/api/comment/${id}`);
      updateComments(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  if (!note) {
    return <div />;
  }

  return (
    <>
      <ArticleCard note={note} />

      {comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <ArticleCard note={comment} />
        </React.Fragment>
      ))}

      <InputComment parentId={id} />
    </>
  );
};

export default ArticlePage;
