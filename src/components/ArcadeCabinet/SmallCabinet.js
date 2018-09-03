import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { ARCADE_CABINET_WIDTH, SMALL_CABINET_HEIGHT } from './layoutConstants';
import ScreenVideo from 'static/screen_cropped_1s.mp4';

const SmallCabinet = ({ width, height, poster, videoSrc }) => {
  const padding = 20;
  return (
    <div
      className="arcade-cabinet"
      style={{
        height: height + padding + 1,
        width: width + padding * 2,
        paddingLeft: padding,
        paddingRight: padding,
        paddingTop: padding,
        margin: '0 auto',
      }}
    >
      <video
        src={videoSrc}
        poster={poster}
        width={width}
        height={height}
        playsInline
        autoPlay
        loop
        muted
      />
    </div>
  );
};

export default props => {
  return (
    <StaticQuery
      query={graphql`
        query {
          poster: file(relativePath: { eq: "Poster.png" }) {
            childImageSharp {
              resize(toFormat: JPG) {
                src
              }
            }
          }
        }
      `}
      render={data => {
        return (
          <SmallCabinet
            width={ARCADE_CABINET_WIDTH}
            height={SMALL_CABINET_HEIGHT}
            videoSrc={ScreenVideo}
            poster={data.poster.childImageSharp.resize.src}
            {...props}
          />
        );
      }}
    />
  );
};
