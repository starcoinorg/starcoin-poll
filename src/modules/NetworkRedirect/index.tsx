import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import Helmet from 'react-helmet';

interface NetworkRedirectRouterProps {
  location: any;
}

class NetworkRedirectRouter extends PureComponent<NetworkRedirectRouterProps> {
  render() {
    return (
      <>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <Redirect
          to={{
            pathname: '/polls/1',
          }}
        />
      </>
    );
  }
}

export default NetworkRedirectRouter;
