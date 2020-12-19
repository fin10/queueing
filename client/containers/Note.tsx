import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Note } from '../types';

const Note = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [note, updateNote] = useState<Note>();

  const fetchNote = async () => {
    try {
      const res = await axios.get<Note>(`/api/notes/${id}`);
      updateNote(res.data);
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  return (
    <div>
      {note && (
        <div>
          <p>{note.body}</p>
        </div>
      )}
    </div>
  );
};

export default Note;
