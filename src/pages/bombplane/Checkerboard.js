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
        // 0:unknown 1:empty 2:body 3:head
        row.push({type: 0})
      }
      checkerboard.push(row);
    }
    this.setState({
      checkerboard,
    })
  }

  renderCell = (cell, row, col) => {
    const { onClickCell } = this.props;
    const { type } = cell;
    if (type === 0) {
      return (
        <div
          key={`${row}-${col}`}
          className='checkerboard-cell-clickable'
          onClick={() => {
            if (onClickCell) {
              onClickCell(row, col);
            }
          }}
        />
      )
    }
    const view = ['', ' ', 'o', 'x'];
    return (
      <div key={`${row}-${col}`} className='checkerboard-cell'>{view[type] || '?'}</div>
    )
  }

  showAllPoint = () => {
    const { checkerboard } = this.state;
    const { planes } = this.props;
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

  showPoint = (row, col, type) => {
    const { checkerboard } = this.state;
    checkerboard[row][col].type = type;
    this.setState({
      checkerboard: [...checkerboard],
    })
  }

  render() {

    const { style, className, id } = this.props;
    const { checkerboard } = this.state;

    return (
      <div id={id || ""} className={`${className || ""} checkerboard`} style={style || {}}>
        {checkerboard.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`}>
            {row.map((cell, index) => this.renderCell(cell, rowIndex, index))}
          </div>
        ))}
      </div>
    )
  }
}
