import React from 'react';
import { rhythm, scale } from '../../utils/typography';

import waveSVG from './wave.svg';
import './index.css';

const Divider = ({ style, width }) => {
  var styles = {
    height: rhythm(1 / 3),
    width: width,
    backgroundImage: `url(${waveSVG})`,
    ...style,
  };
  return <div style={styles} />;
};

Divider.defaultProps = { width: '100%' };

export default Divider;
