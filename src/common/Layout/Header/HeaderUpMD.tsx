import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LANGUAGES_LABEL } from '@/utils/constants';
import { useDispatch } from 'react-redux';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import BaseRouteLink from '@/common/BaseRouteLink';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import LanguageIcon from '@material-ui/icons/Translate';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarMaskOnboarding from '@starcoin/starmask-onboarding';
import store from '@/Polls/store';
import Networks from '../../Networks';
import Tabs from './Tabs';

const useStyles = (theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.getContrastText(theme.palette.background.paper),
      display: 'flex',
      flexDirection: 'column',
    },
    headerNormal: {
      height: theme.spacing(8),
    },
    headerWallet: {
      height: theme.spacing(14),
    },
    mainHeader: {
      alignItems: 'center',
      display: 'flex',
      height: theme.spacing(8),
      flex: '0 0 auto',
      flexDirection: 'row',
    },
    mainHeaderWallet: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.075)',
    },
    tabs: {
      alignItems: 'flex-end',
      display: 'flex',
      height: '100%',
    },
    title: {
      marginRight: theme.spacing(2),
    },
    pad: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    noUpperCase: {
      textTransform: 'none',
    },
    rightBox: {
      marginLeft: 'auto',
    },
    button: {
      height: theme.spacing(6),
      border: 'none',
    },
    buttonStyle: {
      borderColor: '#1C4BDE',
      borderRadius: '25px',
      marginRight: '0.3rem',
    },
    darkBgButton: {
      color: '#000',
      backgroundColor: '#F7F9FA',
      borderRadius: '25px',
      marginRight: '0.3rem',
    },
    search: {
      alignItems: 'center',
      borderTop: '1px solid rgba(0, 0, 0, 0.075)',
      display: 'flex',
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    logoLink: {
      display: 'grid',
      gridGap: '10px',
      gridAutoFlow: 'column',
      alignItems: 'center',
      textDecoration: 'none',
    },
    logo: {
      fontFamily: 'Bauhaus93',
      fontSize: `${theme.spacing(6)}px`,
      color: '#3d454d',
      letterSpacing: `-${theme.spacing(2 / 4)}px`,
      textAlign: 'left',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(1),
      lineHeight: 1,
      textTransform: 'none',
    },
    i18n: {
      height: theme.spacing(6),
    },
    language: {
      margin: theme.spacing(0, 0.5, 0, 1),
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
      },
    },
  });

function Index(props: any) {
  const { classes } = props;
  const { t, i18n }: { t: any; i18n: any } = useTranslation();
  const userLanguage = i18n.language || 'en';
  const [languageMenu, setLanguageMenu] = React.useState(null);
  const handleLanguageIconClick = (event: any) => {
    setLanguageMenu(event.currentTarget);
  };

  const [network, setNetwork] = useState('');

  // initial data
  const dispatch = useDispatch();
  // get window.starcoin
  const [starcoin, setStarcoin] = useState(window.starcoin);
  const [connectStatus, setConnectStatus] = useState(0);
  const [accountAddress, setAccountAddress] = useState('');

  // statusText fix: Solve problems that cannot be translated.
  const textContent = [
    t('poll.install'),
    t('poll.connect'),
    t('poll.installing'),
    t('poll.connecting'),
  ];
  const [textStatus, setTextStatus] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [onboarding, setOnBoarding] = useState<any>();
  const networkVersion: Map<string, string> = new Map([
    ['253', 'Halley'],
    ['1', 'Main'],
    ['251', 'Barnard'],
    ['252', 'Proxima'],
    ['254', 'Localhost:9850'],
  ]);

  // connectStatusChange callback
  const handleNewAccounts = (newAccounts: string[]) => {
    let id = window.location.href.split('/')[5]?.split('?')[0];
    id = typeof +id === 'number' ? id : '';

    const isStarMaskConnected = newAccounts.length > 0;
    console.log(id, isStarMaskConnected, 'sss');
    if (isStarMaskConnected) {
      // onAccountChange(newAccounts);
      setTextStatus(4);
      setConnectStatus(4);
      setAccountAddress(newAccounts[0]);
      if (onboarding) {
        onboarding.stopOnboarding();
      }
      dispatch(
        store.actions.getPollVotes({ id: Number(id) - 1, selectedAccount: newAccounts[0] }),
      );
    } else {
      // disconnect
      setTextStatus(1);
      setConnectStatus(1);

      // clean [accounts, pollvotes]store
      dispatch(store.actions.setPollVotes(null));
    }

    dispatch(store.actions.setWalletAccounts(newAccounts));
    setButtonDisable(false);
  };

  // initialConnectStatus
  // Fixed the issue of refreshing page data presentation
  const initialConnectStatus = () => {
    const isStarMaskInstalled = StarMaskOnboarding.isStarMaskInstalled();
    const isStarMaskConnected = starcoin?._state.accounts?.length > 0;

    if (!isStarMaskInstalled) {
      setTextStatus(0);
      setConnectStatus(0);
    } else if (isStarMaskConnected) {
      const accounts = starcoin._state.accounts;
      setTextStatus(4);
      setConnectStatus(4);
      setAccountAddress(accounts[0]);

      handleNewAccounts(accounts);
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      setTextStatus(1);
      setConnectStatus(1);
    }

    if (isStarMaskInstalled) {
      // window.starcoin.on('chainChanged', handleNewChain)
      // window.starcoin.on('networkChanged', handleNewNetwork)
      starcoin.on('accountsChanged', handleNewAccounts);
    }
  };

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const forwarderOrigin =
      currentUrl.hostname === 'localhost' ? 'http://localhost:9032' : undefined;

    try {
      setOnBoarding(new StarMaskOnboarding({ forwarderOrigin }));
    } catch (error) {
      console.error(error);
    }

    initialConnectStatus();
  }, []);

  function handleNewNetwork(network: any) {
    setNetwork(network);
  }

  if (window.starcoin) {
    window.starcoin.on('accountsChanged', handleNewAccounts);
    window.starcoin.on('networkChanged', handleNewNetwork);
  }

  useEffect(() => {
    if (window.starcoin && window.starcoin.networkVersion) {
      setNetwork(window.starcoin && window.starcoin.networkVersion);
    }
  }, []);

  useEffect(() => {
    if (window.starcoin && window.starcoin.selectedAddress) {
      setAccountAddress(window.starcoin.selectedAddress);
    }
  }, []);

  async function connectWallet() {
    // wallet click
    if (connectStatus === 0) {
      // setText installing
      setTextStatus(2);
      setButtonDisable(true);
      // open chrome extension page
    window.open('https://chrome.google.com/webstore/detail/starmask/mfhbebgoclkghebffdldpobeajmbecfk')

      // onboarding.startOnboarding();
    } else if (connectStatus === 1) {
      setTextStatus(3);
      setButtonDisable(true);
      dispatch(
        store.actions.connectWallet((data: any) => handleNewAccounts(data)),
      );
    }
  }

  const handleLanguageMenuClose = (lang?: string) => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
    setLanguageMenu(null);
  };

  // set a default value before locales/*/transaction.json is loaded
  const current = LANGUAGES_LABEL.filter(
    (language) => language.code === userLanguage,
  );
  const currentLabel = (current[0] && current[0].text) || '-';
  const i18nMenu = (
    <>
      <Tooltip title={t('header.changeLanguage')} enterDelay={300}>
        <Button
          className={classes.i18n}
          color="inherit"
          aria-owns={languageMenu ? 'language-menu' : undefined}
          aria-haspopup="true"
          onClick={handleLanguageIconClick}
        >
          <LanguageIcon />
          <span className={classes.language}>{currentLabel}</span>
          <ExpandMoreIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={languageMenu}
        open={Boolean(languageMenu)}
        onClose={() => handleLanguageMenuClose()}
      >
        {LANGUAGES_LABEL.map((language) => (
          <MenuItem
            key={language.code}
            selected={userLanguage === language.code}
            onClick={() => handleLanguageMenuClose(language.code)}
          >
            {language.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  const pathname = window.location.pathname;
  const tabs = (
    <Tabs
      tabs={[
        {
          className: classes.button,
          id: 'polls',
          label: t('header.polls'),
          selected: pathname.startsWith('/polls'),
          href: '/polls/1',
        },
      ]}
    />
  );

  return (
    <div
      className={classNames({
        [classes.header]: true,
        [classes.headerNormal]: true,
      })}
    >
      <div
        className={classNames({
          [classes.mainHeader]: true,
          [classes.pad]: true,
        })}
      >
        <div className={classes.tabs}>
          <BaseRouteLink to="/" underline="none">
            <div className={classes.logoLink}>
              <img
                src={`${process.env.PUBLIC_URL}/starcoin-logo-text-blue.svg`}
                height="30"
                alt="logo"
              />
              <Typography className={classes.logo} variant="h3">
                &nbsp;
              </Typography>
            </div>
          </BaseRouteLink>
          {tabs}
          <Networks />
          {i18nMenu}
        </div>
        <Box display="flex" alignItems="center" className={classes.rightBox}>
          {connectStatus === 4 ? (
            <Button variant="outlined" className={classes.darkBgButton}>
              {networkVersion.get(starcoin.networkVersion)}
            </Button>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            className={classes.buttonStyle}
            onClick={connectWallet}
            disabled={buttonDisable}
          >
            {textStatus !== 4
              ? textContent[textStatus]
              : `${accountAddress.substr(0, 4)}....${accountAddress.substring(
                  accountAddress.length - 4,
                )}`}
          </Button>
        </Box>
      </div>
    </div>
  );
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Index);
