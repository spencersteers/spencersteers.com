import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

import { rhythm } from '../../utils/typography';

class ArcadeScreen extends React.Component {
  static defaultProps = {
    width: 300,
    height: 320,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    let aspectRatio = 3 / 4;
    let width = this.containerRef.current.offsetWidth;
    let height = width / aspectRatio;

    if (window._arcadeScreen.isInitialized()) {
      window._arcadeScreen.mount(this.containerRef.current, width, height);
    } else {
      this.containerRef.current.classList.add('fade');
      window._arcadeScreen.mount(this.containerRef.current, width, height, () => {
        this.containerRef.current.classList.add('show');
      });
    }
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    window._arcadeScreen.unmount();
  }

  shouldComponentUpdate() {
    return false;
  }

  handleButtonLeft() {
    window._arcadeScreen.previousPallette();
  }

  handleButtonRight() {
    window._arcadeScreen.nextPallette();
  }

  render() {
    let arcadePadding = 20; //rhythm(2 / 3);
    let arcadePaddingBottom = 90; //rhythm(3);
    let cabinetAspectRatio = this.props.arcadeCabinet.aspectRatio;
    let cabinetImageWidth = 212;
    let cabinetWidthSideRatio = 212 / 1624;
    let cabinetHeightSideRatio = 266 / 2132;

    let cabinetPanelLeftSize = cabinetWidthSideRatio * this.props.width;
    let cabinetPanelBottomSize = (cabinetHeightSideRatio * this.props.width) / cabinetAspectRatio;

    let screenOversizeWidth = 15;
    let screenOversizeHeight = 20;

    let fullWidth = this.props.arcadeCabinet.width + arcadePadding + arcadePadding;
    let arcadePanelPaddingX =
      cabinetWidthSideRatio * this.props.arcadeCabinet.width - screenOversizeWidth;
    let arcadePanelPaddingTop =
      (cabinetHeightSideRatio * this.props.arcadeCabinet.width) / cabinetAspectRatio -
      screenOversizeHeight;
    let arcadePanelPaddingBottom =
      (cabinetHeightSideRatio * this.props.arcadeCabinet.width) / cabinetAspectRatio;

    let canvasWidth = fullWidth - arcadePadding * 2 - arcadePanelPaddingX * 2;
    let canvasHeight = canvasWidth / (3 / 4);
    return (
      <div
        style={{
          height: '100%',
          width: fullWidth,
          backgroundColor: '#262931',
          paddingLeft: arcadePadding,
          paddingRight: arcadePadding,
          paddingTop: arcadePadding,
          paddingBottom: arcadePaddingBottom,
          display: 'inline-block',
          margin: '0 auto',
          marginTop: 2,
          borderLeft: '1px solid rgb(23, 25, 29)',
          borderTop: '1px solid rgb(23, 25, 29)',
          borderRight: '1px solid rgb(23, 25, 29)',
          borderRadius: '5px 5px 0 0',
        }}
      >
        <Img
          fluid={this.props.arcadeCabinet}
          outerWrapperClassName="arcade-mask-outer-wrapper"
          fadeIn={false}
        />
        <div
          className="arcade-panel-padding"
          style={{
            paddingLeft: arcadePanelPaddingX,
            paddingRight: arcadePanelPaddingX,
            paddingTop: arcadePanelPaddingTop,
            paddingBottom: arcadePanelPaddingBottom,
          }}
        >
          <div
            id="arcade-screen-container"
            ref={this.containerRef}
            style={{
              minWidth: canvasWidth,
              minHeight: canvasHeight,
              display: 'inline-block',
            }}
          />
          <ArcadeScreenControls
            buttonWidth={this.props.buttonWidth}
            buttonHeight={this.props.buttonHeight}
            spriteSheetSrc={this.props.buttonSpriteSheetSrc}
            onButtonLeft={this.handleButtonLeft}
            onButtonRight={this.handleButtonRight}
          />
        </div>
      </div>
    );
  }
}

const imageShape = PropTypes.shape({
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  aspectRatio: PropTypes.number.isRequired,
}).isRequired;

ArcadeScreen.propTypes = {
  arcadeCabinet: imageShape,
  buttonSpriteSheetSrc: PropTypes.string.isRequired,
  buttonWidth: PropTypes.number.isRequired,
  buttonHeight: PropTypes.number.isRequired,
};

class ArcadeScreenControls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ position: 'relative', top: '-20px', width: '100%', padding: '0 40px' }}>
        <button
          className="arcade-button left"
          aria-label="Arcade Machine Left Button"
          onClick={this.props.onButtonLeft}
          style={{
            backgroundImage: `url(${this.props.spriteSheetSrc})`,
            width: this.props.buttonWidth,
            height: this.props.buttonHeight,
            float: 'left',
          }}
        />
        <button
          className="arcade-button right"
          aria-label="Arcade Machine Right Button"
          onClick={this.props.onButtonRight}
          style={{
            backgroundImage: `url(${this.props.spriteSheetSrc})`,
            width: this.props.buttonWidth,
            height: this.props.buttonHeight,
            float: 'right',
          }}
        />
      </div>
    );
  }
}

ArcadeScreenControls.propTypes = {
  buttonWidth: PropTypes.number.isRequired,
  buttonHeight: PropTypes.number.isRequired,
  spriteSheetSrc: PropTypes.string.isRequired,
  onButtonLeft: PropTypes.func,
  onButtonRight: PropTypes.func,
};

export default ArcadeScreen;
