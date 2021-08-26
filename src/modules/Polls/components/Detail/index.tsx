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
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import TablePagination from '@material-ui/core/TablePagination';
import { getPollData } from '@/utils/sdk';
import { arrayify, hexlify } from '@ethersproject/bytes';
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
  isRevokeable: boolean;
  getPoll: (data: any, callback?: any) => any;
  history: any;
}

interface IndexState {
  id?: number;
  pollData: any;
  checked: boolean;
  open: boolean;
  sendAmount: string | number;
  page: number;
  rowsPerPage: number;
  detail: Record<string, any>;
}

let startToVerify: boolean = false;

class Detail extends PureComponent<IndexProps, IndexState> {
  starcoinProvider: any;

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    poll: undefined,
    pollVotes: undefined,
    accounts: [],
    isRevokeable: false,
  };

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
      checked: true,
      open: false,
      sendAmount: '1',
      page: 0,
      rowsPerPage: 5,
      detail: {},
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
      history.push('/error')
      return
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

  handleCheck = (value: boolean) => {
    this.setState({ checked: value });
  };

  async onClickQueue() {
    try {
      const { detail } = this.state;
      const functionId = '0x1::Dao::queue_proposal_action';
      const strTypeArgs = ['0x1::STC::STC', detail.type_args_1];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);
      const proposerAdressHex = detail.creator;
      const proposalId = detail.id;

      // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
      const proposalIdSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU64(proposalId);
        return hexlify(se.getBytes());
      })();
      const args = [arrayify(proposerAdressHex), arrayify(proposalIdSCSHex)];

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
      const proposerAdressHex = detail.creator;
      const proposalId = detail.id;

      // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
      const proposalIdSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU64(proposalId);
        return hexlify(se.getBytes());
      })();
      const args = [arrayify(proposerAdressHex), arrayify(proposalIdSCSHex)];

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

  async onClickVoteConfirm() {
    try {
      const { detail } = this.state;
      const { checked, sendAmount } = this.state;
      const functionId = '0x1::DaoVoteScripts::cast_vote';
      const strTypeArgs = ['0x1::STC::STC', detail.typeArgs1];
      const structTypeTags = utils.tx.encodeStructTypeTags(strTypeArgs);

      const proposerAdressHex = detail.creator;
      const proposalId = detail.id;
      const agree = checked; // yes: true; no: false
      const votes = new BigNumber(sendAmount).times('1000000000'); // sendAmount * 1e9

      // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
      const proposalIdSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU64(proposalId);
        return hexlify(se.getBytes());
      })();
      // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
      const agreeSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeBool(agree);
        return hexlify(se.getBytes());
      })();
      // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
      const votesSCSHex = (function () {
        const se = new bcs.BcsSerializer();
        se.serializeU128(new BigNumber(votes).toNumber());
        return hexlify(se.getBytes());
      })();
      const args = [
        arrayify(proposerAdressHex),
        arrayify(proposalIdSCSHex),
        arrayify(agreeSCSHex),
        arrayify(votesSCSHex),
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

  generateExtra() {
    const suffix = i18n.language === 'en' ? 'En' : '';
    const { t, classes } = this.props;
    const { /* page, rowsPerPage,  */ detail } = this.state;

    const isPollDataLoading = !this.state.pollData;
    const total = 168171610282100220;
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
    const { t, classes } = this.props;
    const buttons = [];
    if (status === POLL_STATUS.ACTIVE) {
      buttons.push(
        <Button
          key="vote"
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={() => {
            startToVerify = false;
            this.setState({
              checked: true,
              sendAmount: '1',
              open: true,
            });
          }}
        >
          <Typography variant="body1">{t('poll.buttonText.vote')}</Typography>
        </Button>,
      );
      // TODO: enable this while starcoin bug fixed
      // if (!this.props.isRevokeable) {
      //   buttons.push(
      //     <Button
      //       key="revoke"
      //       className={classes.button}
      //       color="primary"
      //       variant="contained"
      //       onClick={() => {
      //         this.onClickRevoke()
      //       }}
      //     >
      //       <Typography variant="body1">{t('poll.buttonText.revoke')}</Typography>
      //     </Button>)
      // }
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
    const { poll, pollVotes, match, t, classes } = this.props;
    const { open, checked, sendAmount, detail } = this.state;

    const columns = [
      [t('poll.id'), detail.id],
      [t('poll.title'), detail[`title${suffix}`]],
      [t('poll.status'), t(`poll.statusText.${detail.status}`)],
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
        new Date(parseInt(detail.endTime, 10)).toLocaleString(),
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

    return (
      <>
        <PageView
          id={detail.id}
          title={t('poll.detail')}
          name={t('poll.detail')}
          pluralName={t('header.polls')}
          bodyColumns={columns}
          extra={this.generateExtra()}
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
      </>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(Detail));
