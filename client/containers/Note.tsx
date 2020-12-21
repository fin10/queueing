import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Logger } from '../utils/Logger';
import { Note } from '../types';

const Note = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [note, updateNote] = useState<Note>();

  const fetchNote = async () => {
    try {
      const res = await axios.get<Note>(`/api/notes/${id}`);
      updateNote(res.data);
    } catch (err) {
      Logger.error(err);
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  return (
    <div>
      {note && (
        <div>
          <pre>{note.body}</pre>
        </div>
      )}
    </div>
  );
};

export default Note;
