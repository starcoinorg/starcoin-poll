import {
  createStyles,
  withStyles,
  Theme,
  makeStyles,
} from '@material-ui/core/styles';

const style = (theme: Theme) =>
  createStyles({
    threshold: {},
    diving: {
      marginLeft: '4%',
      borderLeft: `1px solid ${theme.palette.text.primary}`,
      height: '8px',
    },
    text: {
      paddingLeft: '0.2rem',
    }
  });
export default style;
