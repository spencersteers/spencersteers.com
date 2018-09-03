import React from "react"
import url from "url"

import gatsbyConfig from './gatsby-config';

export const onRenderBody = ({ setHeadComponents, pathname = `/` }) => {
  setHeadComponents([
    <meta
      name="author"
      key="meta-author"
      content={gatsbyConfig.siteMetadata.author}
    />
  ]);

  // const siteUrl = gatsbyConfig.siteMetadata.siteUrl;
  // const parsedUrl = url.parse(siteUrl);
  // const myUrl = `${siteUrl}${pathname}`;
  // <link
  //   rel="canonical"
  //   key={myUrl}
  //   href={myUrl}
  //   data-baseprotocol={parsedUrl.protocol}
  //   data-basehost={parsedUrl.host}
  // />,
}
