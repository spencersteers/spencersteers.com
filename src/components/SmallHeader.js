import React from 'react';
import Link from 'gatsby-link';
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
      <Link to={'/'} title="spencersteers.com">
        <SmallCabinet />
      </Link>
    </header>
  );
};

export default SmallHeader;
