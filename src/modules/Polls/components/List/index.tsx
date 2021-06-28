import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import CenteredView from '@/common/View/CenteredView';
import PollCard from './PollCard';

const useStyles = (theme: Theme) =>
  createStyles({
    pagerArea: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'flex-end',
    },

    component: {
      marginTop: '30px',
    },

    header: {
      marginBottom: '20px',
    },

    title: {
      color: 'white',
      fontSize: '16px',
    },

    wrapper: {
      position: 'relative',
      i: {
        position: 'absolute',
        top: '50%',
        right: '6px',
        transform: 'translate(0, -50%)',
        pointerEvents: 'none',
      },
    },

    select: {
      appearance: 'none',
      border: '1px solid $slate',
      borderRadius: '3px',
      fontSize: '12px',
      padding: '6px 10px',
      paddingRight: '32px',
      textTransform: 'capitalize',
    },

    dim: {
      opacity: '0.5',
    },
    [theme.breakpoints.down('xs')]: {
      gridCards: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: `${theme.spacing(1) * 2}px ${theme.spacing(1) * 2}px`,
        padding: theme.spacing(1) * 2,
      },
    },
    [theme.breakpoints.up('sm')]: {
      gridCards: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: `${theme.spacing(1) * 2}px ${theme.spacing(1) * 2}px`,
        padding: theme.spacing(1) * 2,
      },
    },
    [theme.breakpoints.up('lg')]: {
      gridCards: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: `${theme.spacing(1) * 2}px ${theme.spacing(1) * 2}px`,
        padding: theme.spacing(1) * 2,
      },
    },
  });

interface ExternalProps {
  className?: string;
}

interface InternalProps {
  pollList: any;
  isLoadingMore: boolean;
  getPollList: (contents: any, callback?: any) => any;
  classes: any;
  t: any;
  match: any;
}

interface Props extends ExternalProps, InternalProps {}

interface IndexState {
  currentPage: number;
  filter: string;
  status: number;
  hideVoted: boolean;
}

class List extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    pollList: null,
    isLoadingMore: undefined,
    getPollList: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: parseInt(props.match.params.page, 10) || 1,
      filter: '',
      status: 0,
      hideVoted: false,
    };
  }

  componentDidMount() {
    // this.fetchListPage(this.state.currentPage);
  }

  fetchListPage = (page: number) => {
    this.props.getPollList({ page });
  };

  setFilter = (value: string) => {
    this.setState({ filter: value });
  };

  render() {
    const { t, classes } = this.props;
    const { hideVoted, status } = this.state;
    const list = JSON.parse(t('poll.polls'));

    return (
      <div>
        <Helmet>
          <title>{t('header.polls')}</title>
        </Helmet>

        <CenteredView>
          <Card>
            <CardHeader
              action={
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hideVoted}
                          color="primary"
                          onChange={() => {
                            this.setState((prevState) => ({
                              hideVoted: !prevState.hideVoted,
                            }));
                          }}
                        />
                      }
                      label={t('poll.hideVoted')}
                    />
                  </Grid>
                  <Grid item>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      style={{ width: 120 }}
                      value={status}
                      onChange={(
                        event: React.ChangeEvent<{ value: unknown }>,
                      ) => {
                        this.setState({
                          status: event.target.value as number,
                        });
                      }}
                    >
                      <MenuItem value={0}>{t('poll.all')}</MenuItem>
                      <MenuItem value={2}>{t('poll.inProgress')}</MenuItem>
                      <MenuItem value={4}>{t('poll.passed')}</MenuItem>
                      <MenuItem value={3}>{t('poll.rejected')}</MenuItem>
                      <MenuItem value={7}>{t('poll.executed')}</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              }
              title={
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography>{t('header.polls')}</Typography>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary" size="small">
                      Create
                    </Button>
                  </Grid>
                </Grid>
              }
            />
            <Divider />
            <div className={classes.gridCards}>
              {list.length
                ? list.map((poll: any, index: number) => (
                    <PollCard
                      key={`key_${index}`}
                      id={poll.id}
                      url={`/polls/detail/${poll.id}`}
                      link={poll.link}
                      title={poll.title}
                      for_votes={poll.for_votes}
                      against_votes={poll.against_votes}
                      status={poll.status}
                      end_time={poll.end_time}
                      creator={poll.creator}
                      type_args_1={poll.type_args_1}
                    />
                  ))
                : t('poll.NoPoll')}
            </div>
          </Card>
        </CenteredView>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(List));
