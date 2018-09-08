import React from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import { StaticQuery, graphql } from 'gatsby';

import {
  ARCADE_CABINET_ASPECT_RATIO,
  ARCADE_CABINET_WIDTH,
  ARCADE_CABINET_HEIGHT,
  SIDE_PANEL_WIDTH_RATIO,
  SIDE_PANEL_WIDTH,
  TOP_PANEL_HEIGHT_RATIO,
  BUTTON_WIDTH,
  BUTTON_HEIGHT,
} from './layoutConstants';
import { rhythm } from '../../utils/typography';
import Controls from './Controls';
import { ArcadeScreenContext } from '../ArcadeScreen';

class FullCabinet extends React.Component {
  static defaultProps = {
    screenAspectRatio: 3 / 4,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  handleImageLoad() {
    let width = this.containerRef.current.offsetWidth;
    let height = width / this.props.screenAspectRatio;

    if (ArcadeScreenContext.exists()) {
      this.containerRef.current.classList.remove('fade');
      ArcadeScreenContext.getContext().mount(this.containerRef.current, width, height);
    } else {
      ArcadeScreenContext.createContext(width, height);
      ArcadeScreenContext.getContext().mount(this.containerRef.current, width, height, () => {
        this.containerRef.current.classList.add('show');
      });
    }
  }

  componentWillUnmount() {
    ArcadeScreenContext.getContext().unmount();
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
    let screenWidth = Math.ceil(outerWidth - arcadePadding * 2 - arcadePanelPaddingX * 2);
    let screenHeight = Math.ceil(screenWidth / this.props.screenAspectRatio);
    return (
      <div
        aria-label="Arcade Cabinet"
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
          fadeIn={true}
          onLoad={() => this.handleImageLoad()}
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
            className="fade"
            ref={this.containerRef}
            style={{
              minWidth: screenWidth,
              minHeight: screenHeight,
            }}
          />
          <Controls
            buttonWidth={BUTTON_WIDTH}
            buttonHeight={BUTTON_HEIGHT}
            spriteSheetSrc={this.props.buttonSpriteSheetSrc}
            onButtonLeft={() => ArcadeScreenContext.getContext().previousPallette()}
            onButtonRight={() => ArcadeScreenContext.getContext().nextPallette()}
          />
        </div>
      </div>
    );
  }
}

FullCabinet.propTypes = {
  arcadeCabinetImg: PropTypes.object.isRequired,
  buttonSpriteSheetSrc: PropTypes.string.isRequired,
};

export default props => {
  return (
    <StaticQuery
      query={graphql`
        query {
          arcadeCabinet: file(relativePath: { eq: "ArcadeCabinet_RoundedRoughSmall.png" }) {
            childImageSharp {
              fluid(maxWidth: 300) {
                base64
                aspectRatio
                src
                srcSet
                sizes
              }
            }
          }
          buttonSpriteSheet: file(relativePath: { eq: "ArcadeButton_SpriteSheet.png" }) {
            childImageSharp {
              fixed(height: 69, width: 456) {
                src
              }
            }
          }
        }
      `}
      render={data => {
        return (
          <FullCabinet
            arcadeCabinetImg={data.arcadeCabinet.childImageSharp.fluid}
            buttonSpriteSheetSrc={data.buttonSpriteSheet.childImageSharp.fixed.src}
            {...props}
          />
        );
      }}
    />
  );
};
