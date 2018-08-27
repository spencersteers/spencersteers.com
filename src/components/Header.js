import React from 'react';
import { Link } from 'gatsby';
import { rhythm, scale } from '../utils/typography';

import Layout from '../components/Layout';
import ArcadeScreen from '../components/ArcadeScreen';

const headerStyles = {
  height: 500,
  width: '100%',
  background: '#1f2228',
  borderBottom: '1px solid #17191d',
};

const Header = () => {
  return (
    <header style={{ ...headerStyles, ...{ height: 540, paddingTop: 20 } }}>
      {/* <Layout> */}
        <ArcadeScreen />
      {/* </Layout> */}
    </header>
  );
};
export default Header;

export const CompactHeader = () => {
  let styles = { ...headerStyles, height: 200 };

  return (
    <header style={styles}>
      <Layout>
        <Link to="/" rel="home">
          Home
        </Link>
      </Layout>
    </header>
  );
};
