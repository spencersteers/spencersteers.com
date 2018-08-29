import React from 'react';
import PropTypes from 'prop-types';
import Img from "gatsby-image";

import { rhythm } from '../../utils/typography';
import { ArcadeScreenController } from './ArcadeScreenRenderer';

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
        width: width,
        height: height,
        aspectRatio: aspectRatio,
      });
    });
  }

  componentWillUnmount() {
    this.controller.destroy();
    this.controller = null;
  }

  render() {
    let arcadePadding = 20;//rhythm(2 / 3);
    let arcadePaddingBottom = 90;//rhythm(3);
    let cabinetAspectRatio = this.props.arcadeCabinet.aspectRatio;
    let cabinetImageWidth = 212;
    let cabinetWidthSideRatio = 212 / 1624;
    let cabinetHeightSideRatio = 266 / 2132;

    let cabinetPanelLeftSize = cabinetWidthSideRatio * this.props.width;
    let cabinetPanelBottomSize = cabinetHeightSideRatio * this.props.width / cabinetAspectRatio;

    let screenOversizeWidth = 15;
    let screenOversizeHeight = 20;

    let fullWidth = this.props.arcadeCabinet.width + arcadePadding + arcadePadding;
    let arcadePanelPaddingX = (cabinetWidthSideRatio * this.props.arcadeCabinet.width) - screenOversizeWidth;
    let arcadePanelPaddingTop = (cabinetHeightSideRatio * this.props.arcadeCabinet.width / cabinetAspectRatio) - screenOversizeHeight;
    let arcadePanelPaddingBottom = (cabinetHeightSideRatio * this.props.arcadeCabinet.width / cabinetAspectRatio);

    let canvasWidth = (fullWidth - arcadePadding * 2) - arcadePanelPaddingX * 2;
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
            borderRadius: '5px 5px 0 0'
          }}
        >
        <Img fluid={this.props.arcadeCabinet} outerWrapperClassName='arcade-mask-outer-wrapper' />
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
              display: 'inline-block'
            }}
          />
          <div style={{position: 'relative', top: '-15px', width: '100%', padding: '0 45px'}}>
            <div
              style={{
                backgroundImage: `url(${this.props.buttonLeftUp.src})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: this.props.buttonLeftUp.width,
                height: this.props.buttonLeftUp.height,
                float: 'left'
              }}
            />
            <div
              style={{
                backgroundImage: `url(${this.props.buttonRightUp.src})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: this.props.buttonRightUp.width,
                height: this.props.buttonRightUp.height,
                float: 'right',
              }}
            />
          </div>
      </div>
    </div>
    );
  }
}


const imageShape = PropTypes.shape({
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  aspectRatio: PropTypes.number.isRequired
}).isRequired;

ArcadeScreen.propTypes = {
  arcadeCabinet: imageShape,
  buttonLeftUp: imageShape,
  buttonRightUp: imageShape,
};

export default ArcadeScreen;


// <div
//   style={{
//     height: '100%',
//     backgroundColor: '#262931',
//     paddingLeft: arcadePadding,
//     paddingRight: arcadePadding,
//     paddingTop: arcadePadding,
//     paddingBottom: arcadePaddingBottom,
//     display: 'inline-block',
//     margin: '0 auto',
//     marginTop: 1,
//     borderLeft: '1px solid rgb(23, 25, 29)',
//     borderTop: '1px solid rgb(23, 25, 29)',
//     borderRight: '1px solid rgb(23, 25, 29)',
//     borderRadius: '5px 5px 0 0'
//   }}
// >
//   <div
//     style={{
//       backgroundImage: `url(${this.props.arcadeCabinet.src})`,
//       height: this.props.arcadeCabinet.height,
//       width: this.props.arcadeCabinet.width,
//       backgroundSize: 'cover',
//       backgroundRepeat: 'no-repeat',
//       backgroundColor: '#262931',
//       paddingLeft: (cabinetWidthSideRatio * this.props.width),
//       paddingRight: (cabinetWidthSideRatio * this.props.width),
//       paddingTop: (cabinetHeightSideRatio * this.props.width / cabinetAspectRatio),
//       paddingBottom: (cabinetHeightSideRatio * this.props.width / cabinetAspectRatio),
//     }}
//   >
//     <div style={{position: 'relative'}}>
//       <div
//         style={{
//           backgroundImage: `url(${this.props.buttonLeftUp.src})`,
//           backgroundSize: 'contain',
//           backgroundRepeat: 'no-repeat',
//           width: this.props.buttonLeftUp.width,
//           height: this.props.buttonLeftUp.height,
//           position: 'absolute',
//           display: 'inline-block',
//           marginTop: this.props.arcadeCabinet.height - (cabinetPanelBottomSize * 2) + this.props.buttonLeftUp.height / 2,
//           left: 28
//         }}
//       />
//       <div
//         style={{
//           backgroundImage: `url(${this.props.buttonRightUp.src})`,
//           backgroundSize: 'contain',
//           backgroundRepeat: 'no-repeat',
//           width: this.props.buttonRightUp.width,
//           height: this.props.buttonRightUp.height,
//           position: 'absolute',
//           display: 'inline-block',
//           marginTop: this.props.arcadeCabinet.height - (cabinetPanelBottomSize * 2) + this.props.buttonRightUp.height / 2,
//           // marginTop: '137.067797%',
//           right: 28
//         }}
//       />
//   </div>
//     <div
//       id="arcade-screen-container"
//       ref={this.containerRef}
//       style={{
//         width: '100%',
//         height: '100%',
//         display: 'inline-block',
//         marginLeft: -10,
//         marginTop: -8,
//       }}
//     />
//   </div>
// </div>
