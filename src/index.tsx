import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import omit from 'lodash/omit';
import { withBaseRoute } from '@/utils/helper';
import Layout from '@/common/Layout';
import Loading from '@/common/Loading';
import './index.css';
import './utils/i18n';
import store, { history } from './rootStore';

const NetworkRedirect = lazy(() => import('./modules/NetworkRedirect/index'));
const Polls = lazy(() => import('./modules/Polls/containers'));
const CreatePoll = lazy(() => import('./modules/Polls/components/CreatePoll'));
const Error404 = lazy(() => import('./modules/Error404'));

const RouteWithLayout = (props: any) => {
  const Component = props.component;
  const Layout = props.layout;
  const title = props.title;
  const rest = omit(props, ['component', 'layout', 'title']);

  return (
    <Layout title={title}><Component {...rest} /></Layout>
  );
};

const MainLayout = (props: any) => {
  return (
    <Layout>
      <Helmet>
        <title>
          {props.title || 'Starcoin Polls'}
        </title>
      </Helmet>
      <Suspense fallback={<Loading />}>
        {props.children}
      </Suspense>
    </Layout>
  );
};

MainLayout.prototype = {
  children: PropTypes.element.isRequired
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <RouteWithLayout exact path={withBaseRoute('/')} title="NetworkRedirect" layout={MainLayout} component={NetworkRedirect} />
        <RouteWithLayout path={withBaseRoute('/polls')} title="Poll" layout={MainLayout} component={Polls} />
        <RouteWithLayout path={withBaseRoute('/create_poll')} title="Poll" layout={MainLayout} component={CreatePoll} />
        <RouteWithLayout exact path={withBaseRoute('/error')} title="404" layout={MainLayout} component={Error404} />
        <RouteWithLayout path={undefined} title="404" layout={MainLayout} component={Error404} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
