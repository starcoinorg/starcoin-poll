import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import BigNumber from 'bignumber.js';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { getPollData } from '@/utils/sdk';
import { POLL_STATUS } from '@/utils/constants';
import Link from '@material-ui/core/Link';
import { NavLink } from 'react-router-dom';
import BorderLinearProgress from '../../BorderLinearProgress';

const useStyles = (theme: Theme) =>
  createStyles({
    root: {},
    text: {
      padding: theme.spacing(1) * 2,
      height: theme.spacing(1),
    },
    cardCommon: {
      opacity: 0.5,
    },
    cardInProgress: {
      opacity: 1,
    },
    [theme.breakpoints.down('xs')]: {
      cardCommon: {
        transition: '.4s ease box-shadow',
        borderRadius: '4px',
      },
    },
    [theme.breakpoints.up('sm')]: {
      cardCommon: {
        transition: '.4s ease box-shadow',
        borderRadius: '4px',
      },
    },
    [theme.breakpoints.up('lg')]: {
      cardCommon: {
        transition: '.4s ease box-shadow',
        borderRadius: '4px',
      },
    },
    cardHover: {
      boxShadow: `
    ${theme.spacing(1) * 0}px ${theme.spacing(1) * 1}px ${
        theme.spacing(1) * 3
      }px ${theme.spacing(1) * 0}px rgba(0,0,0,0.2),
    ${theme.spacing(1) * 0}px ${theme.spacing(1) * 1}px ${
        theme.spacing(1) * 1
      }px ${theme.spacing(1) * 0}px rgba(0,0,0,0.14),
    ${theme.spacing(1) * 0}px ${theme.spacing(1) * 2}px ${
        theme.spacing(1) * 1
      }px -${theme.spacing(1) * 1}px rgba(0,0,0,0.12)
    `,
      cursor: 'pointer',
    },
    cardNoHover: {},
    media: {
      height: 140,
    },
    mediaCover: {
      objectFit: 'cover',
    },
    mediaContain: {
      objectFit: 'contain',
    },
    [theme.breakpoints.down('sm')]: {
      header: {
        padding: theme.spacing(1),
      },
    },
    [theme.breakpoints.up('sm')]: {
      header: {
        padding: theme.spacing(1) * 2,
      },
    },
    header: {
      alignItems: 'center',
      borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
      display: 'flex',
    },
    content: {
      padding: theme.spacing(2),
    },
    title: {
      fontWeight: 700,
    },
  });

interface ExternalProps {
  key?: string;
  title: string;
  url: string;
  link: string;
  className?: string;
  id: number;
  for_votes: number;
  against_votes: number;
  status: number;
  end_time: string;
  creator: string;
  type_args_1: string;
}

interface InternalProps {
  t: any;
  classes: any;
}

interface Props extends ExternalProps, InternalProps {
  t: any;
}

interface PollCardState {
  displayHover: boolean;
  pollData: any;
}

class PollCard extends PureComponent<Props, PollCardState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    key: undefined,
    title: undefined,
    url: undefined,
    link: undefined,
    id: undefined,
    for_votes: undefined,
    against_votes: undefined,
    status: undefined,
    end_time: undefined,
    creator: undefined,
    type_args_1: undefined,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      displayHover: false,
      pollData: undefined,
    };
  }

  componentDidMount() {
    const { id, status, creator, type_args_1 } = this.props;
    if (status < POLL_STATUS.EXTRACTED) {
      getPollData(creator, type_args_1).then((data) => {
        if (data && data.id === id) {
          this.setState({ pollData: data });
        }
      });
    }
  }

  onCardEnter = () => {
    this.setState({ displayHover: true });
  };

  onCardLeave = () => {
    this.setState({ displayHover: false });
  };

  render() {
    const {
      title,
      id,
      url,
      for_votes = 0,
      against_votes = 0,
      status,
      end_time,
      classes,
      t,
    } = this.props;
    const yes =
      status === POLL_STATUS.ACTIVE && this.state.pollData
        ? this.state.pollData.for_votes
        : for_votes;
    const no =
      status === POLL_STATUS.ACTIVE && this.state.pollData
        ? this.state.pollData.against_votes
        : against_votes;
    const total = 168171610282100220;
    const yesPercent = new BigNumber(yes).div(total).times(100).toFixed(2);
    const noPercent = new BigNumber(no).div(total).times(100).toFixed(2);
    const voted = new BigNumber(yes).plus(new BigNumber(no));
    const votedPercent = voted.div(total).times(100).toFixed(2);
    return (
      <Link component={NavLink} to={url} underline="none">
        <div
          className={classNames(classes.cardCommon, {
            [classes.cardHover]: this.state.displayHover,
            [classes.cardNoHover]: !this.state.displayHover,
            [classes.cardInProgress]: status !== POLL_STATUS.EXTRACTED,
          })}
          onMouseEnter={this.onCardEnter}
          onMouseLeave={this.onCardLeave}
        >
          <Card className={classes.cardRoom}>
            <div className={classes.header}>
              <Typography variant="h5" gutterBottom className={classes.title}>
                {title}
              </Typography>
            </div>
            <div className={classes.content}>
              <Typography variant="body2" gutterBottom>
                Id: {id}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t('poll.status')}: {t(`poll.statusText.${status}`)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {t('poll.endTime')}:{' '}
                {new Date(parseInt(end_time, 10)).toLocaleString()}
              </Typography>
              <BorderLinearProgress
                variant="buffer"
                value={Math.min(Number(yesPercent), 100)}
                valueBuffer={Math.min(
                  Number(noPercent) + Number(yesPercent),
                  100,
                )}
                style={{ marginBottom: 8 }}
              />
              <Grid
                container
                alignItems="center"
                justify="space-between"
                wrap="nowrap"
              >
                <div>
                  <Grid container alignItems="center">
                    {yes < no ? (
                      <ErrorOutlineIcon
                        fontSize="small"
                        color="secondary"
                        style={{ marginRight: 4 }}
                      />
                    ) : null}
                    <Typography variant="body2" color="textPrimary">
                      {`${t('poll.voted')} ${votedPercent}%`}
                    </Typography>
                  </Grid>
                </div>
                <div>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Typography variant="body2" color="primary">
                        {`${t('poll.yes')} ${yesPercent}%`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body2" color="secondary">
                        {`${t('poll.no')} ${noPercent}%`}
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </div>
          </Card>
        </div>
      </Link>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(PollCard));
