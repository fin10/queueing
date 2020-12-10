import React from 'react';
import './App.css';

export default class App extends React.Component {
  render(): React.ReactElement {
    return (
      <fast-design-system-provider use-defaults>
        <fast-card>
          <h2>FAST React</h2>
          <fast-button appearance="accent" onClick={() => console.log('clicked')}>
            Click Me
          </fast-button>
        </fast-card>
      </fast-design-system-provider>
    );
  }
}
