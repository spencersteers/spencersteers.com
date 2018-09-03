import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';

import {
  ARCADE_CABINET_ASPECT_RATIO,
  ARCADE_CABINET_WIDTH,
  ARCADE_CABINET_HEIGHT,
  SIDE_PANEL_WIDTH_RATIO,
  SIDE_PANEL_WIDTH,
  TOP_PANEL_HEIGHT_RATIO,
} from './layoutConstants';
import { rhythm } from '../../utils/typography';
import Controls from './Controls';

class FullCabinet extends React.Component {
  static defaultProps = {
    screenAspectRatio: 3 / 4,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    let width = this.containerRef.current.offsetWidth;
    let height = width / this.props.screenAspectRatio;

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
    window._arcadeScreen.unmount();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    let arcadePadding = 20;
    let arcadePaddingBottom = 90;

    let screenOversizeWidth = 15;
    let screenOversizeHeight = 20;

    let arcadePanelPaddingX = SIDE_PANEL_WIDTH_RATIO * ARCADE_CABINET_WIDTH - screenOversizeWidth;
    let arcadePanelPaddingTop =
      (TOP_PANEL_HEIGHT_RATIO * ARCADE_CABINET_WIDTH) / ARCADE_CABINET_ASPECT_RATIO -
      screenOversizeHeight;
    let arcadePanelPaddingBottom =
      (TOP_PANEL_HEIGHT_RATIO * ARCADE_CABINET_WIDTH) / ARCADE_CABINET_ASPECT_RATIO;

    let outerWidth = ARCADE_CABINET_WIDTH + arcadePadding * 2;
    let screenWidth = outerWidth - arcadePadding * 2 - arcadePanelPaddingX * 2;
    let screenHeight = screenWidth / this.props.screenAspectRatio;
    return (
      <div
        className="arcade-cabinet"
        style={{
          height: '100%',
          width: outerWidth,
          backgroundColor: '#262931',
          paddingLeft: arcadePadding,
          paddingRight: arcadePadding,
          paddingTop: arcadePadding,
          paddingBottom: arcadePaddingBottom,
          margin: '0 auto',
          marginTop: 1,
        }}
      >
        <Img
          fluid={this.props.arcadeCabinetImg}
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
              minWidth: screenWidth,
              minHeight: screenHeight,
            }}
          />
          <Controls
            buttonWidth={this.props.buttonWidth}
            buttonHeight={this.props.buttonHeight}
            spriteSheetSrc={this.props.buttonSpriteSheetSrc}
            onButtonLeft={() => window._arcadeScreen.previousPallette()}
            onButtonRight={() => window._arcadeScreen.nextPallette()}
          />
        </div>
      </div>
    );
  }
}

FullCabinet.propTypes = {
  arcadeCabinetImg: PropTypes.object.isRequired,
  buttonSpriteSheetSrc: PropTypes.string.isRequired,
  buttonWidth: PropTypes.number.isRequired,
  buttonHeight: PropTypes.number.isRequired,
};

export default FullCabinet;
