import React from 'react';
import PropTypes from 'prop-types';

class Controls extends React.Component {
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

Controls.propTypes = {
  buttonWidth: PropTypes.number.isRequired,
  buttonHeight: PropTypes.number.isRequired,
  spriteSheetSrc: PropTypes.string.isRequired,
  onButtonLeft: PropTypes.func,
  onButtonRight: PropTypes.func,
};

export default Controls;
