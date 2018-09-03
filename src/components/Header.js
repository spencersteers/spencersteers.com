import React from 'react';
import { rhythm } from '../utils/typography';
import { FullCabinet } from '../components/ArcadeCabinet';

const Header = props => {
  return (
    <header
      style={{
        height: 540,
        paddingTop: rhythm(1),
        background: '#1f2228',
        borderBottom: '1px solid #17191d',
        textAlign: 'center',
      }}
    >
      <h1 className="hidden-title">spencersteers.com</h1>
      <FullCabinet />
    </header>
  );
};

export default Header;
