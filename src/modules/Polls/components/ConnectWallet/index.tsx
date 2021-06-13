import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import StarMaskOnboarding from '@starcoin/starmask-onboarding';
import Fab from '@material-ui/core/Fab';

const useStyles = (theme: Theme) => createStyles({
  margin: {
    marginRight: theme.spacing(1),
  },
});

interface IndexProps {
  classes: any;
  t: any;
  match: any;
  accounts: string[];
  getPoll: (data: any, callback?: any) => any;
}

interface IndexState {
  pollData: any,
  connectText: string,
  isStarMaskInstalled: boolean;
  isStarMaskConnected: boolean;
  connectDisabled: boolean;
}

class Index extends PureComponent<IndexProps, IndexState> {
  onboarding: any

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    accounts: [],
    getPoll: () => { }
  };

  constructor(props: IndexProps) {
    super(props);

    const currentUrl = new URL(window.location.href);
    const forwarderOrigin = currentUrl.hostname === 'localhost'
      ? 'http://localhost:9032'
      : undefined;

    console.log(currentUrl, forwarderOrigin);
    try {
      this.onboarding = new StarMaskOnboarding({ forwarderOrigin });
    } catch (error) {
      console.error(error);
    }

    let text;
    const { t, accounts } = this.props;
    const isStarMaskInstalled = StarMaskOnboarding.isStarMaskInstalled();
    const isStarMaskConnected = accounts && accounts.length > 0;
    if (!isStarMaskInstalled) {
      text = t('poll.install');
    } else if (isStarMaskConnected) {
      text = t('poll.connected');
    } else {
      text = t('poll.connect');
    }
    this.state = {
      pollData: undefined,
      isStarMaskInstalled,
      isStarMaskConnected,
      connectText: text,
      connectDisabled: isStarMaskConnected,
    };
  }

  componentDidMount() {

  }

  handleConnectWalletClick() {
    console.log(this.state.isStarMaskInstalled, this.state.isStarMaskConnected);
    if (!this.state.isStarMaskInstalled) {
      this.setState({ connectText: 'Onboarding in progress', connectDisabled: true });
      this.onboarding.startOnboarding();
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        className={classes.margin}
        disabled={this.state.connectDisabled}
        onClick={() => this.handleConnectWalletClick()}
      >
        {this.state.connectText}
      </Fab>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
