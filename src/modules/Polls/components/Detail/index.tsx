import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import { providers } from '@starcoin/starcoin';
import get from 'lodash/get';
// import { onchain_events } from '@starcoin/starcoin';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Loading from '@/common/Loading';
// import TransactionTable from '@/Transactions/components/Table';
import PageView from '@/common/View/PageView';
import CommonLink from '@/common/Link';
import Markdown from '@/common/Markdown';
import formatNumber from '@/utils/formatNumber';
// import { toObject } from '@/utils/helper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { getPollData } from '@/utils/sdk';
// import PageViewTable from '@/common/View/PageViewTable';
// import EventViewTable from '@/common/View/EventViewTable';

const BorderLinearProgress = withStyles((theme: Theme) => createStyles({
  root: {
    height: 10,
    borderRadius: 5,
  },
  dashedColorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    backgroundImage: 'none',
    animation: 'none',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#3f51b5',
  },
  bar2Buffer: {
    backgroundColor: 'red',
  },
}))(LinearProgress);
const AntSwitch = withStyles((theme: Theme) => createStyles({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const useStyles = (theme: Theme) => createStyles({
  table: {
    width: '100%',
    display: 'block',
  },
  shrinkMaxCol: {
    flex: '1 100 auto',
    minWidth: 60,
  },
  shrinkCol: {
    flex: '1 10 auto',
  },
  voteTextBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    width: '50%',
    padding: theme.spacing(1),
    '&:first-child': {
      color: theme.palette.primary.main,
    },
    '&:last-child': {
      border: 'none',
      color: theme.palette.secondary.light,
    },
  },
  [theme.breakpoints.down('sm')]: {
    cardContainer: {
      marginBottom: theme.spacing(1),
    },
    cardHeader: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    metric: {
      paddingLeft: theme.spacing(2),
    }
  },
  [theme.breakpoints.up('sm')]: {
    cardContainer: {
      marginBottom: theme.spacing(2),
    },
    cardHeader: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    metric: {
      paddingLeft: theme.spacing(4),
    }
  },
  [theme.breakpoints.down('md')]: {
    textFieldLabel: {
      fontSize: '0.75em'
    }
  },
  [theme.breakpoints.up('md')]: {
    textFieldLabel: {
      fontSize: '1em'
    }
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
  },
  cardContainer: {
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  textField: {
    display: 'flex',
    flex: '1 1 auto',
    marginRight: theme.spacing(1),
  },
  textFieldLabel: {},
  title: {
    fontWeight: 700
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  margin: {
    marginRight: theme.spacing(2),
  },
  metric: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderLeft: '1px solid rgba(0, 0, 0, 0.075)',
  }
});

interface IndexProps {
  classes: any;
  t: any;
  match: any;
  poll: any;
  pollVotes: any;
  accounts: string[];
  getPoll: (data: any, callback?: any) => any;
}

interface IndexState {
  id?: number,
  pollData: any,
  checked: boolean,
}

class Index extends PureComponent<IndexProps, IndexState> {
  starcoinProvider: any

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    poll: undefined,
    pollVotes: undefined,
    accounts: [],
    getPoll: () => { }
  };

  constructor(props: IndexProps) {
    super(props);

    try {
      // We must specify the network as 'any' for starcoin to allow network changes
      this.starcoinProvider = new providers.Web3Provider(window.starcoin, 'any');
    } catch (error) {
      console.error(error);
    }

    this.state = {
      id: parseInt(props.match.params.id, 10),
      pollData: undefined,
      checked: true,
    };
  }

  componentDidMount() {
    // this.fetchData();
    const { t, match } = this.props;
    const list = JSON.parse(t('poll.polls'));
    const filter = list.filter((poll: any) => poll.id === parseInt(match.params.id, 10));
    const config = filter[0];
    getPollData(config.creator).then(data => {
      if (data && data.id === config.id) {
        this.setState({ pollData: data });
      }
    });
  }

  handleChange() {
    const value = this.state.checked;
    this.setState({ checked: !value });
  }

  async onClickVote() {
    try {
      console.log('onClickVote', this.state);
      const toAccount = this.state.pollData && this.state.pollData.proposer;
      console.log({ toAccount });
      if (!toAccount) {
        // eslint-disable-next-line no-alert
        window.alert('Invalid To: can not be empty!');
        return false;
      }

      const sendAmount = 0.001;
      if (!(sendAmount > 0)) {
        // eslint-disable-next-line no-alert
        window.alert('Invalid sendAmount: should be a number!');
        return false;
      }
      const BIG_NUMBER_NANO_STC_MULTIPLIER = new BigNumber('1000000000');
      const sendAmountSTC = new BigNumber(sendAmount, 10);
      const sendAmountNanoSTC = sendAmountSTC.times(BIG_NUMBER_NANO_STC_MULTIPLIER);
      const sendAmountHex = `0x${sendAmountNanoSTC.toString(16)}`;
      console.log({ sendAmountHex, sendAmountNanoSTC: sendAmountNanoSTC.toString(10) });

      const transactionHash = await this.starcoinProvider.getSigner().sendUncheckedTransaction({
        to: toAccount,
        value: sendAmountHex,
        gasLimit: 127845,
        gasPrice: 1,
      });
      console.log(transactionHash);
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  fetchData() {
    const id = this.state.id;
    if (id) {
      this.props.getPoll({ id });
    }
  }

  generateExtra() {
    const { t, classes, match } = this.props;
    const list = JSON.parse(t('poll.polls'));
    const filter = list.filter((poll: any) => poll.id === parseInt(match.params.id, 10));
    const config = filter[0];
    const isPollDataLoading = !this.state.pollData;
    const total = 6.8 * 1e15;
    const yesPercent = this.state.pollData && (this.state.pollData.for_votes / total * 100).toFixed(2);
    const noPercent = this.state.pollData && (this.state.pollData.against_votes / total * 100).toFixed(2);
    const absYes = (get(this.state, 'pollData.for_votes', 0) / 1e9).toFixed(2);
    const absNo = (get(this.state, 'pollData.against_votes', 0) / 1e9).toFixed(2);
    const votes = (
      <div>
        <BorderLinearProgress
          variant="buffer"
          value={Math.min(Number(yesPercent), 100)}
          valueBuffer={
            Math.min(Number(noPercent) + Number(yesPercent), 100)
          }
        />
        <Grid container justify="center" spacing={0}>
          <Grid item className={classes.voteTextBox}>
            <Typography variant="h6">{t('poll.yes')}</Typography>
            <Typography variant="h6">{yesPercent}%</Typography>
            <Typography variant="subtitle2">{absYes} STC</Typography>
          </Grid>
          <Grid item className={classes.voteTextBox}>
            <Typography variant="h6">{t('poll.no')}</Typography>
            <Typography variant="h6">{noPercent}%</Typography>
            <Typography variant="subtitle2">{absNo} STC</Typography>
          </Grid>
        </Grid>
      </div>
    );
    return (
      <div>
        <br />
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>{t('poll.description')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              <Markdown content={config.description} />
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" gutterBottom>{t('poll.votes')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              {isPollDataLoading ? <Loading /> : votes}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }

  render() {
    const { poll, pollVotes, accounts, match, t, classes } = this.props;
    const list = JSON.parse(t('poll.polls'));
    const filter = list.filter((poll: any) => poll.id === parseInt(match.params.id, 10));
    const isInitialLoad = !filter.length && !poll;
    if (isInitialLoad) {
      return <Loading />;
    }

    const config = filter[0];
    const columns = [
      [t('poll.id'), config.id],
      [t('poll.title'), config.title],
      [t('poll.status'), config.status.replace('_', ' ')],
      [t('poll.creator'), <CommonLink key={config.creator} path={`https://explorer.starcoin.org/main/address/${config.creator}`} title={config.creator} />],
      [t('poll.endTime'), new Date(parseInt(config.end_time, 10)).toLocaleString()],
      [t('poll.discussion'), <CommonLink key={config.link} path={config.link} title={config.link} />],
    ];
    if (pollVotes) {
      columns.push([t('poll.selectedAccount'), <CommonLink key={pollVotes.selectedAccount} path={`https://explorer.starcoin.org/main/address/${pollVotes.selectedAccount}`} title={pollVotes.selectedAccount} />]);
      const selectedVoteLog = pollVotes.value ? `${pollVotes.agree ? t('poll.yes') : t('poll.no')} (${formatNumber(pollVotes.value)} NanoSTC) ` : t('poll.selectedNoVotes');

      columns.push([t('poll.selectedVoteLog'), selectedVoteLog]);
      if (config.status === 'in_progress' && accounts.length > 0) {
        const agree = (
          <div className={classes.marginTop}>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>{t('poll.no')}</Grid>
              <Grid item>
                <AntSwitch checked={this.state.checked} onChange={() => this.handleChange()} name="checked" />
              </Grid>
              <Grid item>{t('poll.yes')}</Grid>
            </Grid>
          </div>
        );
        const selectedVote = (
          <>
            <TextField
              id="standard-number"
              label="NanoSTC"
              type="number"
              defaultValue="10000"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              className={classNames(classes.button, classes.marginTop)}
              color="primary"
              variant="contained"
              onClick={() => this.onClickVote()}
            >
              <Typography variant="body1" className={classes.buttonLabel}>{t('poll.vote')}</Typography>
            </Button>
          </>
        );
        columns.push([agree, selectedVote]);
      }
    }

    return (
      <PageView
        id={config.id}
        title={t('poll.detail')}
        name={t('poll.detail')}
        pluralName={t('header.polls')}
        bodyColumns={columns}
        extra={this.generateExtra()}
      />
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Index));
