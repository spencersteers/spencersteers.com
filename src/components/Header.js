import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import { rhythm, scale } from '../utils/typography';
import get from 'lodash/get';

import Layout from '../components/Layout';
import ArcadeScreen from '../components/ArcadeScreen';

const headerStyles = {
  height: 500,
  width: '100%',
  background: '#1f2228',
  borderBottom: '1px solid #17191d',
};

const Header = props => {
  let cabSrc = get(props, 'data.arcadeCabinet.childImageSharp.fixed.src');
  let cabB64 = get(props, 'data.arcadeCabinet.childImageSharp.fixed.base64');
  let images = {
    arcadeCabinet: get(props, 'data.arcadeCabinet.childImageSharp.fluid'),
    buttonLeftUp: get(props, 'data.buttonLeftUp.childImageSharp.fixed'),
    buttonRightUp: get(props, 'data.buttonRightUp.childImageSharp.fixed')
  };
  images.arcadeCabinet['width'] = 300;
  images.arcadeCabinet['height'] = 300 / images.arcadeCabinet.aspectRatio;
  return (
    <header style={{ ...headerStyles, ...{ height: 540, paddingTop: rhythm(1), textAlign: 'center' } }}>
        <ArcadeScreen
          arcadeCabinet={images.arcadeCabinet}
          buttonLeftUp={images.buttonLeftUp}
          buttonRightUp={images.buttonRightUp}
        />
    </header>
  );
};

export default props => {
  return <StaticQuery
    query={graphql`
      query {
        arcadeCabinet: file(relativePath: { eq: "ArcadeCabinet_RoundedRough.png" }) {
          childImageSharp {
            fluid(maxWidth: 300) {
              base64
              aspectRatio
              src
              srcSet
              sizes
            }
          }
        },
        buttonLeftUp: file(relativePath: { eq: "ArcadeButtUp_Left.png" }) {
          childImageSharp {
            fixed(width: 38) {
              base64
              aspectRatio
              src
              width
              height
            }
          }
        },
        buttonRightUp: file(relativePath: { eq: "ArcadeButtUp_Right.png" }) {
          childImageSharp {
            fixed(width: 38) {
              base64
              aspectRatio
              src
              width
              height
            }
          }
        }
      }
    `}
    render={data => <Header data={data} {...props} />}
  />
};

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
