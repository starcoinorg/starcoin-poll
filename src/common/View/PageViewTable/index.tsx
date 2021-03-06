import React from 'react';
import classNames from 'classnames';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = (theme: Theme) => createStyles({
  [theme.breakpoints.down('sm')]: {
    firstColRow: {
      paddingRight: theme.spacing(1),
    },
    root: {
      padding: theme.spacing(1),
    },
  },
  [theme.breakpoints.up('sm')]: {
    firstColRow: {
      paddingRight: theme.spacing(1) * 2,
    },
    root: {
      padding: theme.spacing(1) * 2,
    },
  },
  root: {
    display: 'flex',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  firstCol: {
    flex: '0 0 auto',
  },
  secondCol: {
    flex: '1 1 auto',
    minWidth: '0',
  },
  label: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  firstColRow: {},
  firstRow: {
    paddingBottom: theme.spacing(1) / 2,
  },
  row: {
    paddingBottom: theme.spacing(1) / 2,
    paddingTop: theme.spacing(1) / 2,
  },
  rowBorder: {
    borderTop: '1px solid rgba(0, 0, 0, 0.075)',
  },
  lastRow: {
    paddingTop: theme.spacing(1) / 2,
  },
  text: {
    minWidth: '0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  baseRow: {
    minHeight: theme.spacing(1) * 3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

interface ExternalProps {
  columns: any,
  className?: string,
}

interface InternalProps {
  classes: any,
}

interface Props extends ExternalProps, InternalProps { }

class PageViewTable extends React.PureComponent<Props> {
  render() {
    const { columns, className, classes } = this.props;
    const wrapRow = (element: any, idx: any, height: any, firstCol?: any) => (
      <div
        key={idx}
        className={classNames({
          [classes.firstColRow]: !!firstCol,
          [classes.firstRow]: idx === 0,
          [classes.row]: idx !== 0 && idx !== columns.length - 1,
          [classes.rowBorder]: idx !== 0,
          [classes.lastRow]: idx === columns.length - 1,
          [classes.baseRow]: true,
        })}
        style={height == null ? undefined : { height }}
      >
        {typeof element === 'string' ? (
          <Typography key="hash" className={classes.text} variant="body1">
            {element}
          </Typography>
        ) : (
          element
        )}
      </div>
    );
    return (
      <div className={classNames(className, classes.root)}>
        <div className={classNames(classes.col, classes.firstCol)}>
          {columns.map((column: any, idx: any) => wrapRow(
            <Typography
              component="div"
              key={column[0]}
              className={classes.label}
              variant="body1"
            >
              {column[0]}
            </Typography>,
            idx,
            column.length === 3 ? column[2] : null,
            true
          ))}
        </div>
        <div className={classNames(classes.col, classes.secondCol)}>
          {columns.map((column: any, idx: any) => wrapRow(
            column[1],
            idx,
            column.length === 3 ? column[2] : null
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(PageViewTable);
