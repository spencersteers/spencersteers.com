import React from 'react';
import { Link } from 'gatsby';
import { rhythm } from '../utils/typography';

class Layout extends React.Component {
  render() {
    const { location, children } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    return (
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: rhythm(28),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {children}
      </div>
    );
  }
}

export default Layout;
