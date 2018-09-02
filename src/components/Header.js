import React from 'react';
import { Link, StaticQuery, graphql } from 'gatsby';
import { rhythm, scale } from '../utils/typography';
import get from 'lodash/get';

import Layout from '../components/Layout';
import ArcadeScreen from '../components/ArcadeScreen';

const Header = props => {
  let cabSrc = get(props, 'data.arcadeCabinet.childImageSharp.fixed.src');
  let cabB64 = get(props, 'data.arcadeCabinet.childImageSharp.fixed.base64');
  let images = {
    arcadeCabinet: get(props, 'data.arcadeCabinet.childImageSharp.fluid'),
    buttonSpriteSheet: get(props, 'data.buttonSpriteSheet.childImageSharp.fixed'),
  };
  images.arcadeCabinet['width'] = 300;
  images.arcadeCabinet['height'] = 300 / images.arcadeCabinet.aspectRatio;
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
      <ArcadeScreen
        arcadeCabinet={images.arcadeCabinet}
        buttonSpriteSheetSrc={images.buttonSpriteSheet.src}
        buttonWidth={38}
        buttonHeight={23}
      />
    </header>
  );
};

export default props => {
  return (
    <StaticQuery
      query={graphql`
        query {
          arcadeCabinet: file(relativePath: { eq: "ArcadeCabinet_RoundedRoughSmall.png" }) {
            childImageSharp {
              fluid(maxWidth: 300) {
                base64
                aspectRatio
                src
                srcSet
                sizes
              }
            }
          }
          buttonSpriteSheet: file(relativePath: { eq: "ArcadeButton_SpriteSheet.png" }) {
            childImageSharp {
              fixed(height: 69, width: 456) {
                src
              }
            }
          }
        }
      `}
      render={data => <Header data={data} {...props} />}
    />
  );
};
