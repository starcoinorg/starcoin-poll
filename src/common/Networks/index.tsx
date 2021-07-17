import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import { useTranslation } from 'react-i18next';
import { getNetwork, asyncSearch } from '@/utils/helper';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    i18n: {
      height: theme.spacing(6),
    },
    noUpperCase: {
      textTransform: 'none',
    },
    language: {
      margin: theme.spacing(0, 0.5, 0, 1),
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
      },
    },
  }),
);

const Networks = () => {
  const classes = useStyles();
  const { t }: { t: any } = useTranslation();
  const [networkMenu, setNetworkMenu] = React.useState(null);
  const handleNetworkIconClick = (event: any) => {
    setNetworkMenu(event.currentTarget);
  };

  const handleNetworkMenuClose = (network?: string) => {
    if (network) {
      asyncSearch({ network });
      localStorage.setItem('network', network);
      window.location.href = '/';
    }
    setNetworkMenu(null);
  };
  const userNetwork = getNetwork();
  const networks = process.env.REACT_APP_STARCOIN_NETWORKS || '';
  const availableNetworks = networks.split(',');
  const currentNetwork = availableNetworks.filter(
    (network) => network === userNetwork,
  );
  const currentNetworkLabel = currentNetwork[0] || '-';

  return (
    <div>
      <Tooltip title={t('header.changeNetwork')} enterDelay={300}>
        <Button
          className={classNames(classes.i18n, classes.noUpperCase)}
          color="inherit"
          aria-haspopup="true"
          aria-owns={networkMenu ? 'network-menu' : undefined}
          onClick={handleNetworkIconClick}
        >
          <SettingsEthernetIcon fontSize="small" />
          &nbsp;
          <span className={classes.language}>{currentNetworkLabel}</span>
          <ExpandMoreIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Menu
        id="network-menu"
        anchorEl={networkMenu}
        open={Boolean(networkMenu)}
        onClose={() => {
          handleNetworkMenuClose();
        }}
      >
        {availableNetworks.map((network) => (
          <MenuItem
            className={classes.noUpperCase}
            key={network}
            selected={userNetwork === network}
            onClick={() => handleNetworkMenuClose(network)}
          >
            {network}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Networks;
