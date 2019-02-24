import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'expose-loader?videojs!video.js/dist/video.min';
import 'video.js/dist/video-js.min.css';

import io from 'socket.io-client';

import SubjectsManager from './SubjectsManager';
import WebSocketClient from './WebSocketClient';
import AppController from './AppController';

import './app.css';

const subjectsManager = new SubjectsManager();
const webSocketClient = new WebSocketClient(io(), subjectsManager);

new AppController(webSocketClient, subjectsManager, window.videojs);
