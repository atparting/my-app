import React, { PureComponent } from 'react';

class Hall extends PureComponent {

  state = {
    rooms: [],
  }

  componentDidMount() {

  }

  render() {

    const { rooms } = this.state;

    return (
      <div>

        <ul>
          {rooms.map(room => (
            <li>
              {`id: ${room.id}`}
            </li>
            )
          )}
        </ul>
      </div>
    )
  }
}

export default Hall;
