import React from 'react';
import { Link } from "react-router-dom";

function Home() {
  return (
    <ul>
      <li>
        <Link to='/'>首页</Link>
      </li>
      <li>
        <Link to='/music'>MP3封面提取</Link>
      </li>
      <li>
        <Link to='/bombplane'>炸飞机</Link>
      </li>
    </ul>
  );
}

export default Home;
