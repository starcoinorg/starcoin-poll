import React from 'react';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import ConnectWallet from '@/Polls/components/ConnectWallet/adapter';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    leftHeader: {
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    rightHeader: {
      marginBottom: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
    leftHeader: {
      marginBottom: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    rightHeader: {
      marginBottom: theme.spacing(1),
    },
  },
  [theme.breakpoints.down('md')]: {
    root: {
      flexWrap: 'wrap',
    },
  },
  [theme.breakpoints.up('md')]: {
    root: {
      flexWrap: 'nowrap',
    },
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftHeader: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 1 auto',
    minWidth: '0',
  },
  rightHeader: {
    alignItems: 'center',
    display: 'flex',
  },
  static: {
    overflow: 'initial',
  },

  text: {
    // color: '#fff',
  },
  title: {
    fontSize: '1.3125rem',
    fontWeight: 700,
  },
  link: {
    color: '#fff',
    textDecoration: 'underline',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.87)',
    },
  },
  linkSelected: {
    color: 'rgba(255, 255, 255, 0.87)',
    textDecoration: 'underline',
  },
  backgroundColor: {
    // backgroundColor: '#3d454d',
    borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
  },
  id: {
    flex: '0 1 auto',
    minWidth: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
});

interface ExternalProps {
  id: string,
  title: string,
  name: string,
  pluralName?: string,
  searchRoute?: string,
  icon?: string,
  backgroundColorClassName?: string,
  className?: string,
  accounts?: string[],
}

interface InternalProps {
  classes: any,
  t: any,
}

interface Props extends ExternalProps, InternalProps { }

class PageViewHeader extends React.PureComponent<Props> {
  render() {
    const { title, icon, backgroundColorClassName, className, classes } = this.props;
    const iconElement = (icon != null) ? <Icon className={classNames(classes.margin, classes.text)}>{icon}</Icon> : null;

    return (
      <div
        className={classNames(
          classes.root,
          className,
          backgroundColorClassName == null
            ? classes.backgroundColor
            : backgroundColorClassName,
        )}
      >
        <div className={classes.leftHeader}>
          {iconElement}
          <Typography
            className={classNames(classes.margin, classes.text, classes.title)}
            component="h1"
          >
            {title}
          </Typography>
        </div>
        <div className={classes.rightHeader}>
          <ConnectWallet id={this.props.id} />
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(PageViewHeader));
