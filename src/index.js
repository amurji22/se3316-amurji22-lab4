import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Title from './Title'
import Login from './login';
import About from './About';
import Search from './Search'
import Create_lists from './Create_lists'
import View_lists from './view_lists'
import Delete_lists from './Delete_lists.js'
import reportWebVitals from './reportWebVitals';
import 'tachyons';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Title />
    <Login />
    <About />
    <Search />
    <Create_lists />
    <View_lists />
    <Delete_lists />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
