import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import i18n from 'i18next';
import Helmet from 'react-helmet';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
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
import { POLL_STATUS } from '@/utils/constants';
import client from '@/utils/client';
import { getNetwork } from '@/utils/helper';
import { LoadingOutlined } from '@ant-design/icons';
import PollCard from './PollCard';
// import DynamicForm from '../DynamicForm';

const fields = {
  title: '',
  title_en: '',
  description_en: '',
  description: '',
  creator: '',
  network: 'main',
  // t('poll.statusText')
  status: '1',
  link: '',
  type_args_1: '',
  id_on_chain: '',
  // deposite: '',
  duration: 7,
};

const requiredFields = Object.keys(fields);

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
  filter: string;
  status: number;
  hideVoted: boolean;
  open: boolean;
  form: Record<string, any>;
  errors: Record<string, boolean>;
  list: Record<string, any>[];
  page: number;
  loading: boolean;
  totalPage: number;
}

const isLocal = window.location.host.includes('localhost');

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
      filter: '',
      status: 0,
      hideVoted: false,
      open: false,
      form: fields,
      errors: {},
      loading: true,
      page: 1,
      list: [],
      totalPage: 1,
    };
  }

  componentDidMount() {
    this.fetchList(parseInt(this.props.match.params.page, 10) || 1);
  }

  fetchList = async (page = 1) => {
    let { list } = this.state;
    if (page === 1) {
      list = [];
    }
    this.setState({
      loading: true,
    });
    try {
      const resp = await client.get(
        `list?network=${getNetwork()}&page=${page}&count=20`,
      );
      const newlist = list.concat(resp.list);
      const totalPage = resp.totalPage;
      this.setState({
        list: newlist,
        totalPage,
        page,
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ loading: false });
    }
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
      form: fields,
      errors: {},
      open: false,
    });
  };

  handleSubmit = async () => {
    try {
      const values = await this.validateFields();
      await client.post('add', values);
      await this.fetchList();
      this.closeFormDialog();
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { t, classes } = this.props;
    const suffix = i18n.language === 'en' ? 'En' : '';
    const {
      hideVoted,
      status,
      open,
      form,
      errors,
      list,
      loading,
      page,
      totalPage,
    } = this.state;

    const helperTextMaps = {
      title_en: 'Please input title.',
      title: '请输入中文标题.',
      description_en: 'Please input description.',
      description: '请输入中文描述.',
      deposite: t('poll.depositeHelperText'),
      duration: t('poll.durationHelperText'),
      creator: t('poll.creatorHelperText'),
      link: t('poll.urlHelperText'),
      network: t('poll.networkHelperText'),
      type_args_1: t('poll.type_args_1HelperText'),
      id_on_chain: t('poll.id_on_chainHelperText'),
    };

    const menus = [{ label: t('poll.all'), value: 0 }];
    for (let i = 1; i < 8; i++) {
      menus.push({
        label: t(`poll.statusText.${i}`),
        value: i,
      });
    }

    const {
      title,
      title_en,
      description_en,
      description,
      link,
      // deposite,
      duration,
      creator,
      network,
      type_args_1,
      id_on_chain,
    } = form;

    let renderList = list.concat() || [];
    if (hideVoted) {
      renderList = renderList.filter(
        (l: any) => l.status !== POLL_STATUS.EXTRACTED,
      );
    }
    if (status) {
      renderList = renderList.filter((l: any) => l.status === status);
    }
    const loadingProps = loading
      ? {
          disabled: true,
          startIcon: <LoadingOutlined />,
        }
      : {};
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
            {/* <DynamicForm /> */}
            <TextField
              autoFocus
              required
              margin="dense"
              id="title_en"
              name="title_en"
              error={errors.title_en}
              helperText={errors.title_en ? helperTextMaps.title_en : undefined}
              value={title_en}
              label="Title"
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              margin="dense"
              required
              id="title"
              name="title"
              helperText={errors.title ? helperTextMaps.title : undefined}
              error={errors.title}
              value={title}
              label="中文标题"
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              margin="dense"
              required
              id="description_en"
              name="description_en"
              error={errors.description_en}
              helperText={
                errors.description_en
                  ? helperTextMaps.description_en
                  : undefined
              }
              value={description_en}
              label="Description"
              multiline
              rowsMax="4"
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              margin="dense"
              id="description"
              required
              name="description"
              multiline
              rowsMax="4"
              helperText={
                errors.description ? helperTextMaps.description : undefined
              }
              error={errors.description}
              value={description}
              label="中文描述"
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              margin="dense"
              id="creator"
              required
              name="creator"
              multiline
              rowsMax="4"
              helperText={errors.creator ? helperTextMaps.creator : undefined}
              error={errors.creator}
              value={creator}
              label={t('poll.creator')}
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              autoFocus
              margin="dense"
              required
              id="link"
              name="link"
              helperText={errors.link ? helperTextMaps.link : undefined}
              error={errors.link}
              value={link}
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
              id="type_args_1"
              name="type_args_1"
              error={errors.type_args_1}
              helperText={
                errors.type_args_1 ? helperTextMaps.type_args_1 : undefined
              }
              value={type_args_1}
              label={t('poll.type_args_1')}
              fullWidth
              onChange={this.handleFormChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="id_on_chain"
              name="id_on_chain"
              error={errors.id_on_chain}
              helperText={
                errors.id_on_chain ? helperTextMaps.id_on_chain : undefined
              }
              value={id_on_chain}
              label={t('poll.id_on_chain')}
              fullWidth
              onChange={this.handleFormChange}
            />
            <FormControl style={{ marginRight: 8 }}>
              <InputLabel id="demo-simple-select-label">
                {t('poll.status')}
              </InputLabel>
              <Select
                margin="dense"
                labelId="demo-simple-select-label"
                id="status"
                name="status"
                style={{ width: 150 }}
                value={form.status}
                error={errors.status}
                label={t('poll.status')}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  this.setState((prevState) => ({
                    form: {
                      ...prevState.form,
                      status: event.target.value as number,
                    },
                    errors: {
                      ...prevState.errors,
                      status: false,
                    },
                  }));
                }}
              >
                {menus.slice(1).map(({ label, value }) => (
                  <MenuItem value={value} key={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="network-simple-select-label">
                {t('poll.network')}
              </InputLabel>
              <Select
                margin="dense"
                labelId="network-simple-select-label"
                id="network"
                name="network"
                style={{ width: 150 }}
                value={network}
                error={errors.network}
                label={t('poll.network')}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  this.setState((prevState) => ({
                    form: {
                      ...prevState.form,
                      network: event.target.value as number,
                    },
                    errors: {
                      ...prevState.errors,
                      network: false,
                    },
                  }));
                }}
              >
                {process.env.REACT_APP_STARCOIN_NETWORKS &&
                  process.env.REACT_APP_STARCOIN_NETWORKS.split(',').map(
                    (net) => (
                      <MenuItem value={net} key={net}>
                        {net}
                      </MenuItem>
                    ),
                  )}
              </Select>
            </FormControl>
            {/* <TextField
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
            /> */}
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
                      {menus.map(({ label, value }) => (
                        <MenuItem value={value} key={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              }
              title={
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography>{t('header.polls')}</Typography>
                  </Grid>
                  {isLocal && (
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
                  )}
                </Grid>
              }
            />
            <Divider />
            <div className={classes.gridCards}>
              {renderList.length
                ? renderList.map((poll: any, index: number) => (
                    <PollCard
                      key={`key_${index}`}
                      id={poll.id}
                      url={`/polls/detail/${poll.id}`}
                      link={poll.link}
                      title={poll[`title${suffix}`]}
                      for_votes={poll.forVotes}
                      against_votes={poll.againstVotes}
                      status={poll.status}
                      end_time={poll.endTime}
                      creator={poll.creator}
                      type_args_1={poll.typeArgs1}
                    />
                  ))
                : t('poll.NoPoll')}
            </div>
            {page < totalPage ? (
              <div style={{ padding: 16 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => this.fetchList(page + 1)}
                  {...loadingProps}
                >
                  View More
                </Button>
              </div>
            ) : null}
          </Card>
        </CenteredView>
      </div>
    );
  }
}

export default withStyles(useStyles)(withTranslation()(List));
