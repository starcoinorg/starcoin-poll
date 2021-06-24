import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    dashedColorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
      backgroundImage: 'none',
      animation: 'none',
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#3f51b5',
    },
    bar2Buffer: {
      backgroundColor: 'red',
    },
  }),
)(LinearProgress);

export default BorderLinearProgress;
