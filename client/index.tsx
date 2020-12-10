import React from 'react';
import ReactDOM from 'react-dom';
import { FASTDesignSystemProvider, FASTCard, FASTButton } from '@microsoft/fast-components';
import App from './containers/App';

FASTDesignSystemProvider;
FASTCard;
FASTButton;

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
