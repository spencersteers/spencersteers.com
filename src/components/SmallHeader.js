import React from 'react';
import { rhythm } from '../utils/typography';
import { SmallCabinet } from '../components/ArcadeCabinet';

const SmallHeader = props => {
  return (
    <header
      style={{
        paddingTop: rhythm(1),
        background: '#1f2228',
        borderBottom: '1px solid #17191d',
      }}
    >
      <SmallCabinet />
    </header>
  );
};

export default SmallHeader;
