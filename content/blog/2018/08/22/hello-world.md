---
title: Hello World
date: "2018-08-22"
---

Hello World, hello [link](google.com), hello code.

```jsx
import React from 'react';
import { ArcadeScreenController } from './ArcadeScreenRenderer';

class ArcadeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.controller = new ArcadeScreenController({
      rootElement: this.containerRef.current,
      width: 300,
      height: 400,
      aspectRatio: 3 / 4
    });
  }

  componentWillUnmount() {
    this.controller.destroy();
    this.controller = null;
  }

  render() {
    return <div ref={this.containerRef} style={{ width: 300, height: 400 }} />;
  }
}

export default ArcadeScreen;
```
