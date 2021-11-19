/* eslint-disable func-names */
import React, { PureComponent } from 'react';
import i18n from 'i18next';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import BigNumber from 'bignumber.js';
import get from 'lodash/get';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Loading from '@/common/Loading';
import PageView from '@/common/View/PageView';
import CommonLink from '@/common/Link';
import Markdown from '@/common/Markdown';
import formatNumber from '@/utils/formatNumber';
import { formatBalance } from '@/utils/helper';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import TablePagination from '@material-ui/core/TablePagination';
import { getPollData, getAddressSTCBalance, getPollAccountVotes } from '@/utils/sdk';
import { arrayify, hexlify } from '@ethersproject/bytes';
import PollDialog from '@/Polls/components/PollDialog';
import { providers, utils, bcs } from '@starcoin/starcoin';
import { POLL_STATUS } from '@/utils/constants';
import client from '@/utils/client';
import qs from 'qs';
import BorderLinearProgress from '../BorderLinearProgress';

const useStyles = (theme: Theme) =>
  createStyles({
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
    flexZoomBox: {
      flex: '1',
    },
    voteActionsContent: {
      width: 600,
    },
    voteActions: {
      border: '2px solid red',
      height: 80,
      textTransform: 'uppercase',
      cursor: 'pointer',
      lineHeight: '80px',
      width: '100%',
      textAlign: 'center',
      opacity: '0.25',
      borderRadius: '4px',
      transition: 'opacity .3s ease-out',
      userSelect: 'none',
      '&:hover': {
        opacity: 1,
      },
    },
    voteActionsActive: {
      opacity: '1',
    },
    voteActionsYes: {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
    voteActionsNo: {
      borderColor: theme.palette.secondary.light,
      color: theme.palette.secondary.light,
    },
    voteFeeBox: {
      padding: theme.spacing(2),
      height: theme.spacing(4),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    voteFeeIcon: {
      paddingTop: 4,
      marginLeft: 2,
      fontSize: '1em',
    },
    voteFeePop: {
      padding: theme.spacing(1),
    },
    button: {
      marginLeft: theme.spacing(2),
    },
    tooltipIcon: {
      "&:hover": {
        background: '#fff!important',
      }
    },
    [theme.breakpoints.down('sm')]: {
      cardContainer: {
        marginBottom: theme.spacing(1),
      },
      shrinkMaxCol: {
        flex: '1 100 auto',
        minWidth: 60,
      },
      shrinkCol: {
        flex: '1 10 auto',
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
        },
        voteActionsContent: {
          width: 200,
        },
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
        },
        voteActionsContent: {
          width: 400,
        },
      },
      [theme.breakpoints.down('md')]: {
        textFieldLabel: {
          fontSize: '0.75em',
        },
      },
      [theme.breakpoints.up('md')]: {
        textFieldLabel: {
          fontSize: '1em',
        },
        voteActionsContent: {
          width: 600,
        },
      },
      root: {
        alignItems: 'center',
        display: 'flex',
        flex: '1 1 auto',
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
        fontWeight: 700,
      },
      metric: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderLeft: '1px solid rgba(0, 0, 0, 0.075)',
      },
    },
  });

interface IndexProps {
  classes: any;
  t: any;
  match: any;
  poll: any;
  pollVotes: any;
  accounts: string[];
  getPoll: (data: any, callback?: any) => any;
  history: any;
}

interface IndexState {
  id?: number;
  pollData: any;
  checked: boolean;
  votedForAnotherPoll: boolean;
  open: boolean;
  sendAmount: string | number;
  page: number;
  rowsPerPage: number;
  detail: Record<string, any>;
  pollDialogOpen: boolean;
}

let startToVerify: boolean = false;

class Detail extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    poll: undefined,
    pollVotes: undefined,
    accounts: [],
  };

  maxFee: number = 0;

  starcoinProvider: any;

  constructor(props: IndexProps) {
    super(props);

    try {
      // We must specify the network as 'any' for starcoin to allow network changes
      this.starcoinProvider = new providers.Web3Provider(
        window.starcoin,
        'any',
      );
    } catch (error) {
      console.error(error);
    }

    this.state = {
      id: parseInt(props.match.params.id, 10),
      pollData: undefined,
      votedForAnotherPoll: false,
      checked: true,
      open: false,
      sendAmount: '1',
      page: 0,
      rowsPerPage: 5,
      detail: {},
      pollDialogOpen: false,
    };
  }

  componentDidMount = async () => {
    const { match, history } = this.props;
    const id = match.params.id;
    const detail = await client.get(`polls/detail/${id}`);
    const { network: networkFromUrl } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    const { network: networkFromResp } = detail;
    if (networkFromResp !== networkFromUrl) {
      history.push('/error');
      return;
    }
    getPollData(detail.creator, detail.typeArgs1).then((data) => {
      if (data && data.id === detail.id) {
        this.setState({ pollData: data });
      }
    });

    this.setState({
      detail,
    });
    this.init();
  };

  handleCheck = (value: boolean) => {
    this.setState({ checked: value });
  };

  async onClickQueue() {
    try {
      const { detail } = this.state;
      const functionId = '0x1::Dao::queue_proposal_action';
      const strTypeArgs = ['0x1::STC::STC', detail.typeArgs1];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);
      const proposerAddressHex = detail.creator;
      const proposalId = parseInt(detail.idOnChain, 10);

      // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
      const proposalIdSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU64(proposalId);
        return hexlify(se.getBytes());
      })();
      const args = [arrayify(proposerAddressHex), arrayify(proposalIdSCSHex)];

      const scriptFunction = utils.tx.encodeScriptFunction(
        functionId,
        structTypeTags,
        args,
      );
      const payloadInHex = (function () {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
      })();
      await this.starcoinProvider.getSigner().sendUncheckedTransaction({
        data: payloadInHex,
      });
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async onClickUnstake() {
    if (!this.props.pollVotes.isVoted) {
      return false;
    }
    try {
      const { detail } = this.state;
      const functionId = '0x1::DaoVoteScripts::unstake_vote';
      const strTypeArgs = ['0x1::STC::STC', detail.typeArgs1];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);
      const proposerAddressHex = detail.creator;
      const proposalId = detail.id;

      // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
      const proposalIdSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU64(proposalId);
        return hexlify(se.getBytes());
      })();
      const args = [arrayify(proposerAddressHex), arrayify(proposalIdSCSHex)];

      const scriptFunction = utils.tx.encodeScriptFunction(
        functionId,
        structTypeTags,
        args,
      );
      const payloadInHex = (function () {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
      })();
      await this.starcoinProvider.getSigner().sendUncheckedTransaction({
        data: payloadInHex,
      });
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  // async onClickExecute() {
  // }

  async onClickRevoke() {
    try {
      const { detail } = this.state;
      const functionId = '0x1::DaoVoteScripts::revoke_vote';
      const strTypeArgs = ['0x1::STC::STC', detail.typeArgs1];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

      const proposerAddressHex = detail.creator;
      const proposalId = detail.id;

      const proposalIdSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU64(proposalId);
        return hexlify(se.getBytes());
      })();


      const args = [
        arrayify(proposerAddressHex),
        arrayify(proposalIdSCSHex),
      ];

      const scriptFunction = utils.tx.encodeScriptFunction(
        functionId,
        structTypeTags,
        args,
      );
      const payloadInHex = (function () {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
      })();

      await this.starcoinProvider.getSigner().sendUncheckedTransaction({
        data: payloadInHex,
      });
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async onClickVoteConfirm() {
    try {
      const { detail } = this.state;
      const { checked, sendAmount } = this.state;
      const functionId = '0x1::DaoVoteScripts::cast_vote';
      const tyArgs = ['0x1::STC::STC', detail.typeArgs1];

      const proposerAddress = detail.creator;
      const proposalId = detail.id;
      const agree = checked; // yes: true; no: false
      const votes = new BigNumber(sendAmount).times('1000000000'); // sendAmount * 1e9

      const args = [
        proposerAddress,
        proposalId,
        agree,
        votes,
      ];

      const nodeUrlMap: any = {
        '1': 'https://main-seed.starcoin.org',
        '252': 'https://proxima-seed.starcoin.org',
        '251': 'https://barnard-seed.starcoin.org',
        '253': 'https://halley-seed.starcoin.org',
        '254': 'http://localhost:9850',
      }

      const nodeUrl = nodeUrlMap[window.starcoin.networkVersion]
      const scriptFunction = await utils.tx.encodeScriptFunctionByResolve(functionId, tyArgs, args, nodeUrl)

      const payloadInHex = (function () {
        const se = new bcs.BcsSerializer();
        scriptFunction.serialize(se);
        return hexlify(se.getBytes());
      })();

      await this.starcoinProvider.getSigner().sendUncheckedTransaction({
        data: payloadInHex,
      });
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  init = async () => {
    const { match, history } = this.props;
    const id = match.params.id;
    const { network: networkFromUrl } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    const detail = await client.get(`polls/detail/${id}`);
    const { network: networkFromResp } = detail;
    if (networkFromResp !== networkFromUrl) {
      history.push('/error');
      return;
    }
    getPollData(detail.creator, detail.typeArgs1).then((data) => {
      if (data && data.id === detail.id) {
        this.setState({ pollData: data });
      }
    });

    this.setState({
      detail,
    });
  };

  generateExtra() {
    const suffix = i18n.language === 'en' ? 'En' : '';
    const { t, classes } = this.props;
    const { /* page, rowsPerPage,  */ detail } = this.state;

    const isPollDataLoading = !this.state.pollData;
    // const total = 168171610282100220;
    const total = this.state.pollData && new BigNumber(25 * this.state.pollData.quorum_votes);
    const yesPercent =
      this.state.pollData &&
      new BigNumber(this.state.pollData.for_votes)
        .div(total)
        .times(100)
        .toFixed(2);
    const noPercent =
      this.state.pollData &&
      new BigNumber(this.state.pollData.against_votes)
        .div(total)
        .times(100)
        .toFixed(2);
    const absYes = formatBalance(get(this.state, 'pollData.for_votes', 0));
    const absNo = formatBalance(get(this.state, 'pollData.against_votes', 0));
    const rows = [];
    for (let i = 0; i < 20; i++) {
      rows.push({
        agree: true,
        vote: '11000000',
        voter: '0xb2aa52f94db4516c5beecef363af850a',
        proposal_id: i,
        proposer: '0x3f19d5422824f47e6c021978cee98f35',
      });
    }

    // console.log(this.state.pollData);
    console.log(this.state.detail);

    const votes = (
      <div>
        <br />
        <BorderLinearProgress
          variant="buffer"
          value={Math.min(Number(yesPercent), 100)}
          valueBuffer={Math.min(Number(noPercent) + Number(yesPercent), 100)}
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
        {/*
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">proposer</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">agree</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">vote</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.proposal_id}>
                  <TableCell component="th" scope="row">
                    {row.proposer}
                  </TableCell>
                  <TableCell align="right">
                    {row.agree ? t('poll.yes') : t('poll.no')}
                  </TableCell>
                  <TableCell align="right">{row.vote}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={(event: unknown, newPage) => {
            this.setState({
              page: newPage,
            });
          }}
          onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
              rowsPerPage: Number(event.target.value),
            });
          }}
        />
         */}
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
            <Typography variant="h5" gutterBottom>
              {t('poll.description')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.table}>
              <Markdown content={detail[`description${suffix}`] || ''} />
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
            <Typography variant="h5" gutterBottom>
              {t('poll.votes')}
            </Typography>
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

  // buttons for different status:
  // | 1 | PENDING    |                   |                  |
  // | 2 | ACTIVE     |  vote             | revoke (if voted)|
  // | 3 | DEFEATED   |                   |                  |
  // | 4 | AGREED     |  unstake (if not) | queue            |
  // | 5 | QUEUED     |  unstake (if not) |                  |
  // | 6 | EXECUTABLE |  unstake (if not) | execute          |
  // | 7 | EXTRACTED  |  unstake (if not) |                  |
  allowedButtons(status: number) {
    const { t, classes, accounts } = this.props;
    const currentPollID = this.state.id;
    const buttons = [];
    if (status === POLL_STATUS.ACTIVE) {
      buttons.push(
        <Button
          key="vote"
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={async () => {
            startToVerify = false;
            const resp = await getAddressSTCBalance(accounts[0]);
            const balance = get(resp, 'token.value', 0);
            const address = this.props.pollVotes.selectedAccount;
            const accountVoteResource = await getPollAccountVotes(address);
            let ifVotedForAnotherPoll = false;
            if (accountVoteResource !== undefined) {
              const votedPollID = get(accountVoteResource, 'id');
              if (votedPollID !== currentPollID) {
                ifVotedForAnotherPoll = true;
              };
            }
            this.maxFee = new BigNumber(balance).div(1e9).minus(0.1).toNumber();
            this.setState({
              checked: true,
              sendAmount: this.maxFee,
              open: true,
              votedForAnotherPoll: ifVotedForAnotherPoll,
            });
          }}
        >
          <Typography variant="body1">{t('poll.buttonText.vote')}</Typography>
        </Button>,
      );
      if (
        status === POLL_STATUS.ACTIVE &&
        this.props.pollVotes &&
        this.props.pollVotes.value
      ) {
        buttons.push(
          <Button
            key="revoke"
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={() => {
              this.onClickRevoke();
            }}
          >
            <Typography variant="body1">
              {t('poll.buttonText.revoke')}
            </Typography>
          </Button>,
        );
      }
    }
    if (status > POLL_STATUS.ACTIVE && this.props.pollVotes.isVoted) {
      buttons.push(
        <Button
          key="unstake"
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={() => {
            this.onClickUnstake();
          }}
        >
          <Typography variant="body1">
            {t('poll.buttonText.unstake')}
          </Typography>
        </Button>,
      );
    }
    if (status === POLL_STATUS.AGREED) {
      buttons.push(
        <Button
          key="queue"
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={() => {
            this.onClickQueue();
          }}
        >
          <Typography variant="body1">{t('poll.buttonText.queue')}</Typography>
        </Button>,
      );
    }
    // TODO: enable this while starcoin bug fixed
    // if (status === POLL_STATUS.EXECUTABLE) {
    //   buttons.push(
    //     <Button
    //       key="execute"
    //       className={classes.button}
    //       color="primary"
    //       variant="contained"
    //       onClick={() => {
    //         this.onClickExecute()
    //       }}
    //     >
    //       <Typography variant="body1">{t('poll.buttonText.execute')}</Typography>
    //     </Button>)
    // }
    return buttons;
  }

  render() {
    const suffix = i18n.language === 'en' ? 'En' : '';
    // const { pollVotes, t, classes } = this.props;
    // const { open, checked, sendAmount, detail } = this.state;
    const { pollVotes, t, classes, match, accounts } = this.props;
    const { open, checked, sendAmount, detail, pollDialogOpen } = this.state;
    const id = match.params.id;
    const { network } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    const tooltipText = <div style={{fontSize: '0.8rem', lineHeight: '1rem', whiteSpace: 'pre-line'}}>{'1 | PENDING \n 2 | ACTIVE | vote | revoke (if voted) \n 3 | DEFEATED \n 4 | AGREED | unstake (if not) | queue \n 5 | QUEUED | unstake (if not) \n 6 | EXECUTABLE | unstake (if not) | execute \n 7 | EXTRACTED | unstake (if not)'}</div>;

    const columns = [
      [t('poll.id'), detail.id],
      [t('poll.title'), detail[`title${suffix}`]],
      [t('poll.status'),
        (
          <div style={{paddingTop: '3px'}}>
            {t(`poll.statusText.${detail.status}`)}
            <Tooltip title={tooltipText} placement="right">
              <IconButton className={classes.tooltipIcon} style={{padding: '0', height: '18px', marginTop: '-2px'}}>
                &nbsp; <HelpOutlineIcon style={{fontSize: '20px'}}/>
              </IconButton>
            </Tooltip>
          </div>
        )
      ],
      [
        t('poll.creator'),
        <CommonLink
          key={detail.creator}
          path={`https://stcscan.io/main/address/${detail.creator}`}
          title={detail.creator}
        />,
      ],
      [
        t('poll.endTime'),
        `${new Date(parseInt(detail.endTime, 10)).toLocaleString()} ${new Date().toTimeString().slice(9,17)}`,
      ],
      [
        t('poll.discussion'),
        <CommonLink key={detail.link} path={detail.link} title={detail.link} />,
      ],
    ];
    if (pollVotes) {
      columns.push([
        t('poll.selectedAccount'),
        <CommonLink
          key={pollVotes.selectedAccount}
          path={`https://stcscan.io/main/address/${pollVotes.selectedAccount}`}
          title={pollVotes.selectedAccount}
        />,
      ]);
      const selectedVoteLog = pollVotes.value
        ? `${pollVotes.agree ? t('poll.yes') : t('poll.no')} (${formatNumber(
          pollVotes.value,
        )} NanoSTC) `
        : t('poll.selectedNoVotes');

      const buttons = this.allowedButtons(detail.status);
      const accountDetail = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1">{selectedVoteLog}</Typography>
          {buttons}
        </div>
      );
      columns.push([t('poll.selectedVoteLog'), accountDetail]);
    }

    console.log('accounts: ', accounts);

    return (
      <>
        <PageView
          id={detail.id}
          title={
            <div>
              <span>{t('poll.detail')}</span>
              {accounts && accounts[0] === detail.creator && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.setState({
                      pollDialogOpen: true,
                    });
                  }}
                >
                  {t('poll.edit')}
                </Button>
              )}
            </div>
          }
          name={t('poll.detail')}
          pluralName={t('header.polls')}
          bodyColumns={columns}
          extra={this.generateExtra()}
          onAccountChange={(initAccounts) => {
            console.log('initAccounts: ', initAccounts);
          }}
        />
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="lg"
          aria-labelledby="confirmation-dialog-title"
          open={open}
        >
          <DialogTitle id="confirmation-dialog-title" disableTypography>
            <Typography variant="h5">{t('poll.vote')}</Typography>
          </DialogTitle>
          <div>
            { this.state.votedForAnotherPoll &&
              <Alert severity="error">{t('poll.votedForAnotherPollWarning')}</Alert>
            }
          </div>
          <DialogContent dividers className={classes.voteActionsContent}>
            <Grid container direction="column" alignItems="center" spacing={3}>
              <Grid item container justify="center" spacing={3}>
                <Grid item className={classes.flexZoomBox}>
                  <Typography
                    className={classnames(
                      classes.voteActions,
                      classes.voteActionsYes,
                      {
                        [classes.voteActionsActive]: checked,
                      },
                    )}
                    onClick={() => {
                      this.handleCheck(true);
                    }}
                  >
                    {t('poll.yes')}
                  </Typography>
                </Grid>
                <Grid item className={classes.flexZoomBox}>
                  <div
                    className={classnames(
                      classes.voteActions,
                      classes.voteActionsNo,
                      {
                        [classes.voteActionsActive]: !checked,
                      },
                    )}
                    onClick={this.handleCheck.bind(this, false)}
                  >
                    {t('poll.no')}
                  </div>
                </Grid>
              </Grid>
              <Grid item style={{ width: '100%' }}>
                <div style={{ textAlign: 'right' }}>
                  <TextField
                    id="outlined-number"
                    label={t('poll.number')}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">STC</InputAdornment>
                      ),
                    }}
                    fullWidth
                    variant="outlined"
                    placeholder="0.0000"
                    value={sendAmount}
                    onChange={(e) => {
                      startToVerify = true;
                      this.setState({
                        sendAmount: e.target.value,
                      });
                    }}
                    error={!sendAmount && startToVerify}
                    helperText={
                      !sendAmount && startToVerify ? '请输入' : undefined
                    }
                  />
                  <Button
                    color="secondary"
                    onClick={async () => {
                      this.setState({
                        sendAmount: '0.00',
                      });
                    }}>
                      {t('poll.clear')}
                  </Button>
                  <Button
                    color="primary"
                    onClick={async () => {
                      this.setState({
                        sendAmount: this.maxFee,
                      });
                    }}>
                      {t('poll.max')}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              color="primary"
              onClick={() => {
                this.setState({
                  open: false,
                });
              }}
            >
              {t('poll.cancel')}
            </Button>
            <Button
              disabled={this.state.votedForAnotherPoll}
              color="primary"
              onClick={() => {
                this.onClickVoteConfirm();
                this.setState({
                  open: false,
                });
              }}
            >
              {t('poll.ok')}
            </Button>
          </DialogActions>
        </Dialog>
        <PollDialog
          open={pollDialogOpen}
          id={id}
          network={network as string}
          afterSubmit={this.init}
          onClose={() => {
            this.setState({
              pollDialogOpen: false,
            });
          }}
        />
      </>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Detail));
