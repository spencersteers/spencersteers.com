import React from 'react';
import { StaticQuery } from 'gatsby';
import { ARCADE_CABINET_WIDTH, SMALL_CABINET_HEIGHT } from './layoutConstants';

const SmallCabinet = ({ width, height, poster, videoSrc}) => {
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
        margin: '0 auto'
      }}
    >
      <video
        src="/screen_cropped.mp4"
        poster="/static/Poster-20127cdf2b20fb3b342618e844c8b71b-c7f93.jpg"
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
      render={
        data => {
          return (
            <SmallCabinet
              width={ARCADE_CABINET_WIDTH}
              height={SMALL_CABINET_HEIGHT}
              videoSrc="/screen_cropped_1s.mp4"
              poster={data.poster.childImageSharp.resize.src}
              {...props}
            />
          );
        }
      }
    />
  );
};
