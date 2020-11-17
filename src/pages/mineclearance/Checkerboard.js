import React, { PureComponent } from 'react';
import './index.css';

export default class Checkerboard extends PureComponent {

  state = {
    checkerboard: [],
  }

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) {
      onRef(this);
    }
    this.init();
  }

  init = () => {
    const checkerboard = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        // 0:无标记 1:旗子 2:问号 3:已点开
        row.push({ status: 0 })
      }
      checkerboard.push(row);
    }
    this.setState({
      checkerboard,
    })
  }

  getCellContent = cell => {
    const { mine, mineNum, status } = cell;
    if (mine) {
      return '💣';
    }
    if (status === 3) {
      const color = ['#2196f3', '#8bc34a', '#f44336', '#3f51b5',
        '#795548', '#00bcd4', '#607d8b', '#9e9e9e'];
      return mineNum ? <span style={{ color: color[mineNum - 1] }}>{mineNum}</span> : '';
    }
    const view = ['', '🚩', '❓'];
    return view[status];
  }

  renderCell = (cell, row, col) => {
    const { onClickCell } = this.props;
    const { status } = cell;
    return (
      <div
        key={`${row}-${col}`}
        className={status === 3 ? 'checkerboard-cell' : 'checkerboard-cell-clickable'}
        onMouseDown={e => {
          e.preventDefault();
          if (status === 3) {
            if (e.button === 1) {
              onClickCell(row, col, e.button);
            }
          } else {
            if (e.button === 0 || e.button === 2) {
              onClickCell(row, col, e.button);
            }
          }
        }}
        onContextMenu={e => {
          e.preventDefault();
        }}
      >
        {this.getCellContent(cell)}
      </div>
    )
  }

  showPoints = (points) => {
    const { checkerboard } = this.state;
    points.forEach(point => {
      const { x, y, mineNum, mine } = point;
      const checkerPoint = checkerboard[y][x];
      if (mine) {
        checkerPoint.mine = true;
      } else {
        checkerPoint.mineNum = mineNum;
      }
      checkerPoint.status = 3;
    })
    this.setState({
      checkerboard: [...checkerboard],
    })
  }

  showAllMinePoint = (points) => {
    const { checkerboard } = this.state;
    points.forEach(point => {
      const { x, y } = point;
      const checkerPoint = checkerboard[y][x];
      checkerPoint.mine = true;
    })
    this.setState({
      checkerboard: [...checkerboard],
    })
  }

  changePointStatus = (row, col, status) => {
    const { checkerboard } = this.state;
    const checkerPoint = checkerboard[row][col];
    checkerPoint.status = status;
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
