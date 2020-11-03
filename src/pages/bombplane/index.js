import React from 'react';
import { Link } from "react-router-dom";

function BombPlane() {
  return (
    <ul>
      <li>
        <Link to='/bombplane/single'>单人模式</Link>
      </li>
      <li>
        <Link to='/bombplane/multi/hall'>多人模式</Link>
      </li>
    </ul>
  );
}

export default BombPlane;
