import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
// import get from 'lodash/get';
// import { onchain_events } from '@starcoin/starcoin';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
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
import { getPollData } from '@/utils/sdk';
// import PageViewTable from '@/common/View/PageViewTable';
// import EventViewTable from '@/common/View/EventViewTable';

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
  button: {
    height: theme.spacing(5),
  },
  title: {
    fontWeight: 700
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
  getPoll: (data: any, callback?: any) => any;
}

interface IndexState {
  id?: number,
  pollData: any,
}

class Index extends PureComponent<IndexProps, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    match: {},
    getPoll: () => { }
  };

  constructor(props: IndexProps) {
    super(props);
    this.state = {
      id: parseInt(props.match.params.id, 10),
      pollData: undefined,
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
    const metrics: any[] = [];
    if (this.state.pollData) {
      metrics.push([t('poll.yes'), formatNumber(this.state.pollData.for_votes)]);
      metrics.push([t('poll.no'), formatNumber(this.state.pollData.against_votes)]);
    }
    const votes = (
      <div className={classes.cardContainer}>
        <Card className={this.props.classes.card}>
          <Grid container className={classes.root} spacing={2}>
            {metrics.map((metric) => (
              <Grid key={metric[0]} item xs={6}>
                <div className={classes.metric}>
                  <Typography className={classes.metricTitle} variant="body2">
                    {metric[0]}
                  </Typography>
                  <Typography className={classes.title}>
                    {metric[1]}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Card>
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
    const { poll, match, t } = this.props;
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
