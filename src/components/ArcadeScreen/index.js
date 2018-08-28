import React from 'react';
import { ArcadeScreenController } from './ArcadeScreenRenderer';
import ArcadeMask from './ArcadeSTARS_4.png';

import ArcadeButtonLeft from './ArcadeButtUp_Left.png';
import ArcadeButtonRight from './ArcadeButtUp_Right.png';

class ArcadeScreen extends React.Component {
  static defaultProps = {
    width: 238,
    height: 320
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this.controller = new ArcadeScreenController({
        rootElement: this.containerRef.current,
        width: this.props.width,
        height: this.props.height,
        aspectRatio: 3 / 4,
      });
    });
  }

  componentWillUnmount() {
    this.controller.destroy();
    this.controller = null;
  }

  render() {
    return (
      <div
        style={{
          backgroundImage: `url(${ArcadeMask})`,
          height: '100%',
          backgroundSize: '88%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#262931',
          backgroundPositionX: 20,
          backgroundPositionY: 20,
          width: 352,
          margin: '0 auto',
          marginTop: 1,
          borderLeft: '1px solid rgb(23, 25, 29)',
          borderTop: '1px solid rgb(23, 25, 29)',
          borderRight: '1px solid rgb(23, 25, 29)',
          borderRadius: '5px 5px 0 0'
        }}
      >
        <div
          id="arcade-screen-container"
          ref={this.containerRef}
          style={{
            width: this.props.width,
            height: this.props.height,
            display: 'inline-block',
            marginTop: 63,
            marginLeft: 55
          }}
        />
        <div style={{position: 'relative'}}>
          <div
            style={{
              backgroundImage: `url(${ArcadeButtonLeft})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              width: 40,
              height: 40,
              position: 'absolute',
              display: 'inline-block',
              bottom: -31,
              left: 90
            }}
          />
          <div
            style={{
              backgroundImage: `url(${ArcadeButtonRight})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              width: 40,
              height: 40,
              position: 'absolute',
              display: 'inline-block',
              bottom: -31,
              right: 91
            }}
          />
        </div>
      </div>
    );
  }
}

export default ArcadeScreen;
