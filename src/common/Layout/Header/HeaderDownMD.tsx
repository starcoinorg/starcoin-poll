import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import BaseRouteLink from '@/common/BaseRouteLink';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuIcon from '@material-ui/icons/Menu';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Accordion from '@material-ui/core/Accordion';
import LanguageIcon from '@material-ui/icons/Translate';
import { LANGUAGES_LABEL } from '@/utils/constants';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    pad: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    title: {
      marginRight: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    pad: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    title: {
      marginRight: theme.spacing(2),
    },
  },
  root: {
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    height: theme.spacing(8),
    justifyContent: 'space-between',

  },
  title: {},
  pad: {},
  selected: {
    color: theme.palette.primary.main,
  },
  menuButton: {
    height: theme.spacing(6),
  },
  menu: {
    display: 'flex',
    borderTop: '1px solid rgba(0, 0, 0, 0.075)',
    flexDirection: 'column',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
  },
  button: {
    width: '100%',
  },
  noUpperCase: {
    textTransform: 'none'
  },
  buttonLabel: {
    width: '100%',
    textAlign: 'left',
    marginLeft: theme.spacing(1),
  },
  logoLink: {
    display: 'grid',
    gridGap: '10px',
    gridAutoFlow: 'column',
    alignItems: 'left',
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
    lineHeight: 1,
    textTransform: 'none'
  },
  i18n: {
    marginTop: theme.spacing(1),
    border: 'none',
    alignItems: 'center',
  },
  i18nMenu: {
    display: 'flex',
    flexDirection: 'column',
  },
});
let showMenuTimer: number = 0;
function Index(props: any) {
  const { t, i18n }: { t: any, i18n: any } = useTranslation();
  const userLanguage = i18n.language || 'en';
  const [showMenu, setShowMenu] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleI18nExpandedChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const onClickButtonI18n = (lang?: string) => {
    if (lang !== userLanguage) {
      i18n.changeLanguage(lang);
    }
    setExpanded(false);
    setShowMenu(false);
  };

  const onClickButton = () => {
    if (showMenu) {
      setExpanded(false);
      setShowMenu(false);
    }
  };

  const onHideMenu = () => {
    if (showMenu) {
      setExpanded(false);
      setShowMenu(false);
    }
  };

  const onShowMenu = (event: any) => {
    event.preventDefault();
    if (!showMenu) {
      showMenuTimer = Date.now();
      setShowMenu(true);
    }
  };

  const onClickMenu = (event: any) => {
    event.preventDefault();
    if (showMenu) {
      onHideMenu();
    } else {
      onShowMenu(event);
    }
  };

  const onClickAway = (event: any) => {
    if (showMenu && (Date.now() - showMenuTimer) > 50) {
      event.preventDefault();
      setShowMenu(false);
    }
  };

  // set a default value before locales/*/transaction.json is loaded
  const current = LANGUAGES_LABEL.filter((language) => language.code === userLanguage);
  const currentLabel = current[0] && current[0].text || '-';

  const { classes } = props;
  const location = window.location;
  const buttons = [
    {
      className: classes.button,
      id: 'polls',
      label: t('header.polls'),
      selected: location.pathname.startsWith('/polls'),
      href: '/polls/1',
    },
  ];

  return (
    <div className={classes.root}>
      <div className={classNames(classes.header, classes.pad)}>
        <BaseRouteLink to="/" underline="none">
          <div className={classes.logoLink}>
            <img src={`${process.env.PUBLIC_URL}/starcoin-logo-text-blue.svg`} alt="logo" />
            <Typography className={classes.logo} variant="h3">
              &nbsp;
            </Typography>
          </div>
        </BaseRouteLink>
        <IconButton
          className={classes.menuButton}
          onMouseUp={onClickMenu}
          onTouchEnd={onClickMenu}
        >
          <MenuIcon />
        </IconButton>
      </div>
      <Collapse in={showMenu} timeout="auto">
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={classNames(classes.menu, classes.pad)}>
            {buttons.map((button) => (
              <BaseRouteLink key={button.id} className={classes.link} to={button.href}>
                <Button
                  color={button.selected ? 'primary' : 'default'}
                  className={button.className}
                  onClick={onClickButton}
                >
                  <Typography variant="body1" className={classes.buttonLabel}>{button.label}</Typography>
                </Button>
              </BaseRouteLink>
            ))}
            <Accordion expanded={expanded === 'panel2'} onChange={handleI18nExpandedChange('panel2')} className={classes.i18n}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <LanguageIcon />
                <Typography variant="body1" gutterBottom>{currentLabel}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.i18nMenu}>
                  {
                    LANGUAGES_LABEL.map((language) => {
                      return (
                        <Button
                          color={language.code === userLanguage ? 'primary' : 'default'}
                          key={language.code}
                          className={classes.button}
                          onClick={() => onClickButtonI18n(language.code)}
                        >
                          <Typography variant="body1" className={classes.buttonLabel}>{language.text}</Typography>
                        </Button>
                      );
                    })
                  }
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </ClickAwayListener>
      </Collapse>
    </div>
  );
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Index);
