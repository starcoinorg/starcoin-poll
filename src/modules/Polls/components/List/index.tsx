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
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import CenteredView from '@/common/View/CenteredView';
import PollCard from './PollCard';
import DynamicForm from '../DynamicForm';

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
  open: boolean;
  form: Record<string, any>;
  errors: Record<string, boolean>;
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
      open: false,
      form: {
        enTitle: '',
        cnTitle: '',
        enDesc: '',
        cnDesc: '',
        url: '',
        deposite: '',
        duration: 7,
      },
      errors: {},
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

  handleFormChange = (
    event: React.ChangeEvent<{ value: unknown; name: string }>,
  ) => {
    const { value, name } = event.target;
    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: false,
      },
    }));
  };

  validateFields = async () => {
    const { form, errors } = this.state;
    const requiredFields = [
      'enTitle',
      'cnTitle',
      'enDesc',
      'cnDesc',
      'url',
      'duration',
    ];
    let hasError = errors.endTime;
    requiredFields.forEach((field) => {
      if (!form[field]) {
        hasError = true;
        this.setState((prevState) => ({
          errors: {
            ...prevState.errors,
            [field]: true,
          },
        }));
      }
    });
    if (hasError) {
      throw new Error('Error occured！');
    } else {
      return form;
    }
  };

  closeFormDialog = () => {
    this.setState({
      form: {
        enTitle: '',
        cnTitle: '',
        enDesc: '',
        cnDesc: '',
        url: '',
        deposite: '',
      },
      errors: {},
      open: false,
    });
  };

  handleSubmit = async () => {
    try {
      const values = await this.validateFields();
      console.log('values: ', values);
      this.closeFormDialog();
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { t, classes } = this.props;
    const { hideVoted, status, open, form, errors } = this.state;
    const list = JSON.parse(t('poll.polls'));

    const helperTextMaps = {
      enTitle: 'Please input title.',
      cnTitle: '请输入中文标题.',
      enDesc: 'Please input description.',
      cnDesc: '请输入中文描述.',
      url: t('poll.urlHelperText'),
      deposite: t('poll.depositeHelperText'),
      duration: t('poll.durationHelperText'),
    };

    const { enTitle, cnTitle, enDesc, cnDesc, url, deposite, duration } = form;
    return (
      <div>
        <Helmet>
          <title>{t('header.polls')}</title>
        </Helmet>

        <Dialog
          open={open}
          aria-labelledby="simple-dialog-title"
          onClose={this.closeFormDialog}
        >
          <DialogTitle id="simple-dialog-title">
            {t('poll.createAPoll')}
          </DialogTitle>
          <DialogContent>
            <DynamicForm />
            <TextField
              autoFocus
              required
              margin="dense"
              id="enTitle"
              name="enTitle"
              error={errors.enTitle}
              helperText={errors.enTitle ? helperTextMaps.enTitle : undefined}
              value={enTitle}
              label="Title"
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              margin="dense"
              required
              id="cnTitle"
              name="cnTitle"
              helperText={errors.cnTitle ? helperTextMaps.cnTitle : undefined}
              error={errors.cnTitle}
              value={cnTitle}
              label="中文标题"
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              margin="dense"
              required
              id="enDesc"
              name="enDesc"
              error={errors.enDesc}
              helperText={errors.enDesc ? helperTextMaps.enDesc : undefined}
              value={enDesc}
              label="Description"
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              margin="dense"
              id="cnDesc"
              required
              name="cnDesc"
              helperText={errors.cnDesc ? helperTextMaps.cnDesc : undefined}
              error={errors.cnDesc}
              value={cnDesc}
              label="中文描述"
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              autoFocus
              margin="dense"
              required
              id="url"
              name="url"
              helperText={errors.url ? helperTextMaps.url : undefined}
              error={errors.url}
              value={url}
              label={t('poll.externalUrl')}
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="duration"
              name="duration"
              type="number"
              error={errors.duration}
              helperText={errors.duration ? helperTextMaps.duration : undefined}
              value={duration}
              inputProps={{
                min: 7,
              }}
              label={t('poll.duration')}
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="deposite"
              name="deposite"
              error={errors.deposite}
              helperText={errors.deposite ? helperTextMaps.deposite : undefined}
              value={deposite}
              label={t('poll.deposite')}
              fullWidth
              onChange={this.handleFormChange}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.closeFormDialog}>
              {t('poll.cancel')}
            </Button>
            <Button color="primary" autoFocus onClick={this.handleSubmit}>
              {t('poll.ok')}
            </Button>
          </DialogActions>
        </Dialog>

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
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => {
                        this.setState({
                          open: true,
                        });
                      }}
                    >
                      {t('poll.create')}
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
