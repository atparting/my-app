import React, { PureComponent } from 'react';
import './index.css';

class Game extends PureComponent {

  state = {
    step: 0,
    checkerboard: [],
    gameOver: false,
    planes: [],
  }

  componentDidMount() {
    this.startNewGame();
  }

  initCheckerboard = () => {
    const checkerboard = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        // 0:unknown 1:empty 2:body 3:head
        row.push({type: 0})
      }
      checkerboard.push(row);
    }
    this.setState({
      step: 0,
      gameOver: false,
      checkerboard,
      planes: [],
    })
  }

  onMessage = (msg) => {
    const command = JSON.parse(msg);
    const { code } = command;
    if (code === 0) {
      this.onError(command);
    } else if (code === 5) {
      this.onPlacePlaneOver(command);
    } else if (code === 8) {
      this.onBombPoint(command);
    } else if (code === 9) {
      this.onGameOver(command);
    }
  }

  onError = (command) => {
    alert(command.message)
  }

  onPlacePlaneOver = (command) => {
    this.initCheckerboard();
  }

  onBombPoint = (command) => {
    const { x, y, type } = command;
    const { checkerboard, step } = this.state;
    const point = checkerboard[y][x];
    point.type = type;
    this.setState({
      step: step + 1,
      checkerboard,
    })
  }

  onGameOver = (command) => {
    alert("GameOver")
    this.setState({
      gameOver: true,
      planes: command.planes,
    })
  }

  startNewGame = () => {
    if (this.ws) {
      this.sendPlacePlaneCommand();
    } else {
      this.connectServer();
    }
  }

  connectServer = () => {
    const ws = new WebSocket(`ws:localhost:8080/plane/single/1/guest`);
    ws.onopen = () => {
      this.sendPlacePlaneCommand();
    }
    ws.onmessage = evt => {
      this.onMessage(evt.data);
    }
    ws.onclose = () => {
      this.ws = null;
      alert("连接已断开");
    }
    this.ws = ws;
  }

  sendPlacePlaneCommand = () => {
    this.ws.send(JSON.stringify({code: 3}));
  }

  sendBombPointCommand = (x, y) => {
    const { gameOver } = this.state;
    if (!gameOver) {
      this.ws.send(JSON.stringify({code: 5, x, y}));
    }
  }

  renderCell = (cell, row, col) => {
    const { type } = cell;
    if (type === 0) {
      return (
        <div key={`${row}-${col}`} className='cell cell-clickable' onClick={() => this.sendBombPointCommand(col, row)} />
      )
    }
    if (type === 1) {
      return (
        <div key={`${row}-${col}`} className='cell' />
      )
    }
    if (type === 2) {
      return (
        <div key={`${row}-${col}`} className='cell'>o</div>
      )
    }
    if (type === 3) {
      return (
        <div key={`${row}-${col}`} className='cell'>x</div>
      )
    }
    return (
      <div key={`${row}-${col}`} className='cell'>?</div>
    )
  }

  showAllPoint = () => {
    const { checkerboard, planes } = this.state;
    planes.forEach(plane => {
      const { allPoint } = plane;
      for (let i = 0; i < allPoint.length; i++) {
        const { x, y } = allPoint[i];
        checkerboard[y][x].type = i === 0 ? 3 : 2;
      }
    })
    this.setState({
      checkerboard: [...checkerboard],
    })
  }

  render() {

    const { checkerboard, step, gameOver } = this.state;

    return (
      <div>
        <div style={{ marginBottom: 8 }}>
          <button style={{ marginRight: 4 }} onClick={this.startNewGame}>重新开始</button>
          <span>已用步数：{step}</span>
          {gameOver && <button style={{marginLeft: 4}} onClick={this.showAllPoint}>显示所有飞机位置</button>}
        </div>
        <div>
          {checkerboard.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`}>
              {row.map((cell, index) => this.renderCell(cell, rowIndex, index))}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Game;
