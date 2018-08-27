import React from 'react';
import { ArcadeScreenController } from './ArcadeScreenRenderer';
// import ArcadeMask from './TESTIE6-2.png'; black good
import ArcadeMask from './arcadeCab_2.png';

class ArcadeScreen extends React.Component {
  static defaultProps = {
    width: 240,
    height: 340
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
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: 332,
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
            // position: 'absolute',
            marginTop: 63,
            marginLeft: 44
          }}
        />
      </div>
    );
  }
}

export default ArcadeScreen;
