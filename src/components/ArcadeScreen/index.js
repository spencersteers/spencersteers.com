import React from 'react';
import { rhythm } from '../../utils/typography';

import { ArcadeScreenController } from './ArcadeScreenRenderer';

import ArcadeMask from './ArcadeCabinet.png';
import ArcadeButtonLeft from './ArcadeButtUp_Left.png';
import ArcadeButtonRight from './ArcadeButtUp_Right.png';

class ArcadeScreen extends React.Component {
  static defaultProps = {
    width: 300,
    height: 320
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      let aspectRatio = (3 / 4);
      let width = this.containerRef.current.offsetWidth;
      let height = width / aspectRatio;
      this.controller = new ArcadeScreenController({
        rootElement: this.containerRef.current,
        width: width + 10,
        height: height + 18,
        aspectRatio: aspectRatio,
      });
    });
  }

  componentWillUnmount() {
    this.controller.destroy();
    this.controller = null;
  }


  render() {
    let arcadePadding = rhythm(2 / 3);
    let arcadePaddingBottom = rhythm(3);
    let cabinetAspectRatio = (1624 / 2132);
    let cabinetImageWidth = 212;
    let cabinetWidthSideRatio = 212 / 1624;
    let cabinetHeightSideRatio = 266 / 2132;
    return (
      <div
        style={{
          height: '100%',
          backgroundColor: '#262931',
          paddingLeft: arcadePadding,
          paddingRight: arcadePadding,
          paddingTop: arcadePadding,
          paddingBottom: arcadePaddingBottom,
          display: 'inline-block',
          margin: '0 auto',
          marginTop: 1,
          borderLeft: '1px solid rgb(23, 25, 29)',
          borderTop: '1px solid rgb(23, 25, 29)',
          borderRight: '1px solid rgb(23, 25, 29)',
          borderRadius: '5px 5px 0 0'
        }}
      >
        <div
          style={{
            backgroundImage: `url(${ArcadeMask})`,
            height: this.props.width / cabinetAspectRatio,
            width: this.props.width,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#262931',
            paddingLeft: (cabinetWidthSideRatio * this.props.width),
            paddingRight: (cabinetWidthSideRatio * this.props.width),
            paddingTop: (cabinetHeightSideRatio * this.props.width / cabinetAspectRatio),
            paddingBottom: (cabinetHeightSideRatio * this.props.width / cabinetAspectRatio),
          }}
        >
          <div style={{position: 'relative'}}>
            <div
              style={{
                backgroundImage: `url(${ArcadeButtonLeft})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: 40,
                height: 24.154589372,
                position: 'absolute',
                display: 'inline-block',
                marginTop: '137.067797%',
                left: 28
              }}
            />
            <div
              style={{
                backgroundImage: `url(${ArcadeButtonRight})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: 40,
                height: 24.154589372,
                position: 'absolute',
                display: 'inline-block',
                marginTop: '137.067797%',
                right: 28
              }}
            />
        </div>
          <div
            id="arcade-screen-container"
            ref={this.containerRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'inline-block',
              marginLeft: -10,
              marginTop: -8,
            }}
          />
        </div>
      </div>
    );
  }
}

export default ArcadeScreen;
