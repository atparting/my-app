import React, { PureComponent } from 'react';
import './index.css';

export default class Checkerboard extends PureComponent {

  state = {
    checkerboard: [],
    direction: 2,
  }

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
    this.init();
    const keyCode = {ArrowUp: 1, ArrowRight: 2, ArrowDown: 3, ArrowLeft: 4};
    const { onChangeDirection } = this.props;
    document.onkeydown = ev => {
      const direction = keyCode[ev.key];
      if (direction) {
        onChangeDirection(direction);
      }
    }
  }

  componentWillUnmount() {
    document.onkeydown = undefined;
  }

  init = () => {
    const checkerboard = [];
    for (let i = 0; i < 20; i++) {
      const row = [];
      for (let j = 0; j < 20; j++) {
        // 0:无标记 1:蛇头 2:蛇身
        row.push({ status: 0, food: false })
      }
      checkerboard.push(row);
    }
    this.setState({
      checkerboard,
    })
  }

  getCellColor = cell => {
    const { status } = cell;
    if (status === 1) {
      return '#f44336';
    }
    if (status === 2) {
      return '#0000ff';
    }
    return '';
  }

  getCellContent = cell => {
    const { status, food } = cell;
    const { direction } = this.state;
    const directionShow = ['↑', '→', '↓', '←'];
    if (status === 1) {
      return directionShow[direction - 1];
    }
    if (food) {
      return '💩';
    }
  }

  renderCell = (cell, row, col) => {
    return (
      <div
        key={`${row}-${col}`}
        className={'checkerboard-cell'}
        style={{ background: this.getCellColor(cell) }}
      >
        {this.getCellContent(cell)}
      </div>
    )
  }

  changePosition = (points, nextDirection) => {
    const { checkerboard, direction } = this.state;
    if (this.points) {
      this.points.forEach(point => {
        const { x, y } = point;
        checkerboard[y][x].status = 0;
      })
    }
    points.forEach((point, index) => {
      const { x, y } = point;
      checkerboard[y][x].status = index === 0 ? 1 : 2;
    })
    this.points = points;
    this.setState({
      checkerboard: [...checkerboard],
      direction: nextDirection || direction,
    })
  }

  changeFood = (row, col) => {
    const { checkerboard } = this.state;
    if (this.food) {
      const { x, y } = this.food;
      checkerboard[y][x].food = false;
    }
    checkerboard[row][col].food = true;
    this.food = {x: col, y: row};
    this.setState({
      checkerboard: [...checkerboard],
    })
  }

  render() {

    const { style, className, id } = this.props;
    const { checkerboard } = this.state;

    return (
      <div
        id={id || ""}
        className={`${className || ""} checkerboard`}
        style={style || {}}
      >
        {checkerboard.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`}>
            {row.map((cell, index) => this.renderCell(cell, rowIndex, index))}
          </div>
        ))}
      </div>
    )
  }
}
