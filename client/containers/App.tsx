import axios from 'axios';
import React from 'react';
import './App.css';

export default class App extends React.Component {
  readonly state: {
    readonly notes: Note[];
  } = {
    notes: [],
  };

  async componentDidMount(): Promise<void> {
    try {
      const res = await axios.get<Note[]>('/api/notes');
      console.log(res);
      this.setState({ notes: res.data });
    } catch (err) {
      console.error(err);
    }
  }

  render(): React.ReactElement {
    const { notes = [] } = this.state;

    return (
      <fast-design-system-provider use-defaults>
        <fast-card>
          <h2>Queueing</h2>
          <ul>
            {notes.map((note) => (
              <li key={note._id}>{note.title}</li>
            ))}
          </ul>
        </fast-card>
      </fast-design-system-provider>
    );
  }
}
