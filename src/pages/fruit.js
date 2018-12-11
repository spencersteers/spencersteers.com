import React from 'react';

import Page from '../components/Page';

class Fruit extends React.Component {
  render() {
    return (
      <Page title={'Tasty'} description={'Tasty Fruit'}>
        <div style={{ background: 'orange', width: '100vw', height: '100vh' }} />
      </Page>
    );
  }
}

export default Fruit;
