import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CommonHeader from '@/common/View/CommonHeader';
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

interface Props extends ExternalProps, InternalProps { }

interface IndexState {
  currentPage: number;
  filter: string;
}

class Index extends PureComponent<Props, IndexState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    pollList: null,
    isLoadingMore: undefined,
    getPollList: () => { },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: parseInt(props.match.params.page, 10) || 1,
      filter: '',
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
    // const { pollList, classes, t, className, isLoadingMore } = this.props;
    const { t, classes } = this.props;
    const list = JSON.parse(t('poll.polls'));

    return (
      <div>
        <Helmet>
          <title>{t('header.polls')}</title>
        </Helmet>

        <CenteredView>
          <Card>
            <CommonHeader
              name={t('header.polls')}
              pluralName={t('header.polls')}
            />
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
                    status={parseInt(poll.status, 10)}
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

export default withStyles(useStyles)(withTranslation()(Index));
