import React from 'react';
import { scale } from '../utils/typography';

const Nav = (props) => {
  return (
    <nav {...props} css={{
      ...scale(1 / 6),
      textAlign: 'center',
      '& a, & a:active, & a:visited': {
        color: 'inherit',
        padding: '0 10px',
        textDecoration: 'none'
      }
    }}>
      <a href="https://github.com/spencersteers">GitHub</a>
      •
      <a href="https://twitter.com/spencersteers">Twitter</a>
      •
      <a href="mailto:spencersteers@gmail.com">Email</a>
    </nav>
  );
};

export default Nav;
