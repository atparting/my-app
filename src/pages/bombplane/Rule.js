import React from 'react';
import "./index.css";

export default function (props) {

  const { onClose } = props;

  return (
    <div className="rule">
      <button onClick={onClose}>x</button>
      <h> 炸飞机规则</h>
      <p>一共三架飞机，飞机形状如下</p>
      <div>
        <pre>    x</pre>
        <pre>o o o o o</pre>
        <pre>    o</pre>
        <pre>  o o o</pre>
      </div>
      <p>x代表机头，o代表机身，击中机头后飞机被击毁，击毁三架飞机获得胜利。</p>
      <p>飞机有上下左右四种朝向。</p>
    </div>
  )
}