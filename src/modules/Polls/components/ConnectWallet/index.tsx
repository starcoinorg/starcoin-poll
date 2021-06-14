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
  getPoll: (data: any, callback?: any) => any;
  getPollVotes: (data: any, callback?: any) => any;
}

interface IndexState {
  pollData: any,
  accounts: string[];
  connectText: string,
  isStarMaskInstalled: boolean;
  isStarMaskConnected: boolean;
  connectDisabled: boolean;
}

class Index extends PureComponent<IndexProps, IndexState> {
  onboarding: any

  onClick: any

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    getPoll: () => { },
    getPollVotes: () => { },
  };

  constructor(props: IndexProps) {
    super(props);

    const currentUrl = new URL(window.location.href);
    const forwarderOrigin = currentUrl.hostname === 'localhost'
      ? 'http://localhost:9032'
      : undefined;

    try {
      this.onboarding = new StarMaskOnboarding({ forwarderOrigin });
    } catch (error) {
      console.error(error);
    }

    let text;
    const { t } = this.props;
    const isStarMaskInstalled = StarMaskOnboarding.isStarMaskInstalled();
    const isStarMaskConnected = false;
    if (!isStarMaskInstalled) {
      text = t('poll.install');
      this.onClick = this.onClickInstall;
    } else if (isStarMaskConnected) {
      text = t('poll.connected');
      if (this.onboarding) {
        this.onboarding.stopOnboarding();
      }
    } else {
      text = t('poll.connect');
      this.onClick = this.onClickConnect;
    }
    this.state = {
      pollData: undefined,
      accounts: [],
      isStarMaskInstalled,
      isStarMaskConnected,
      connectText: text,
      connectDisabled: isStarMaskConnected,
    };

    if (isStarMaskInstalled) {
      // window.starcoin.on('chainChanged', handleNewChain)
      // window.starcoin.on('networkChanged', handleNewNetwork)
      window.starcoin.on('accountsChanged', this.handleNewAccounts.bind(this));
    }
  }

  componentDidMount() {

  }

  handleNewAccounts(newAccounts: string[]) {
    console.log('handleNewAccounts', newAccounts);
    this.setState({ accounts: newAccounts });
    const { t, getPollVotes } = this.props;
    const isStarMaskConnected = this.isStarMaskConnected();
    let text;
    if (isStarMaskConnected) {
      text = t('poll.connected');
      if (this.onboarding) {
        this.onboarding.stopOnboarding();
      }
      getPollVotes({ selectedAccount: newAccounts[0] });
    } else {
      text = t('poll.connect');
      this.onClick = this.onClickConnect;
    }
    this.setState({
      isStarMaskConnected,
      connectText: text,
      connectDisabled: isStarMaskConnected,
    });
    // accountsDiv.innerHTML = accounts
    // if (isStarMaskConnected()) {
    //   initializeAccountButtons()
    // }
    // updateButtons()
  }

  onClickInstall() {
    this.setState({ connectText: 'Onboarding in progress', connectDisabled: true });
    this.onboarding.startOnboarding();
  }

  async onClickConnect() {
    try {
      const newAccounts = await window.starcoin.request({
        method: 'stc_requestAccounts',
      });
      this.handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  }

  isStarMaskConnected() {
    return this.state.accounts.length > 0;
  }

  render() {
    const { classes } = this.props;
    console.log('isStarMaskConnected', this.state.isStarMaskConnected);
    console.log('accounts', this.state.accounts);
    return (
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        className={classes.margin}
        disabled={this.state.connectDisabled}
        onClick={() => this.onClick()}
      >
        {this.state.connectText}
      </Fab>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
