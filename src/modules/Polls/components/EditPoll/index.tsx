import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CenteredView from '@/common/View/CenteredView';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import client from '@/utils/client';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DynamicForm from '../DynamicForm';

import 'moment/locale/zh-cn';

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

    formBox: {
      margin: '2rem',
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

interface PollDialogProps {
  open: boolean;
  id?: string;
  network?: string;
  t: any;
  classes: any;
  // onClose: () => void;
  // afterSubmit: () => void;
  defaultCreator?: string;
  computedMatch: any;
}

const fields = {
  title: '',
  titleEn: '',
  descriptionEn: '',
  description: '',
  creator: '',
  network: 'main',
  status: '1',
  link: '',
  typeArgs1: '',
  idOnChain: '',
  databaseID: '',
  endTime: '',
  forVotes: '',
  againstVotes: '',
};

const requiredFields = Object.keys(fields);

const PollDialog = ({
  open,
  t,
  classes,
  // onClose,
  // afterSubmit,
  id,
  defaultCreator,
  computedMatch,
}: PollDialogProps) => {
  const [form, setForm] = useState<Record<string, any>>(fields);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const pollDatabaseID = computedMatch.params.id;
  console.log('poll id', pollDatabaseID);

  const helperTextMaps = {
    titleEn: 'Please input title.',
    title: '请输入中文标题.',
    descriptionEn: 'Please input description.',
    description: '请输入中文描述.',
    deposite: t('poll.depositeHelperText'),
    endTime: t('poll.endTimeHelperText'),
    creator: t('poll.creatorHelperText'),
    link: t('poll.urlHelperText'),
    network: t('poll.networkHelperText'),
    typeArgs1: t('poll.type_args_1HelperText'),
    idOnChain: t('poll.id_on_chainHelperText'),
    databaseID: t('poll.databaseIDHelperText'),
    forVotes: t('poll.forVotesHelperText'),
    againstVotes: t('poll.againstVotesHelperText'),
  };

  const validateFields = async () => {
    let hasError;
    requiredFields.forEach((field) => {
      if (!form[field]) {
        hasError = true;
        setErrors({
          ...errors,
          [field]: true,
        });
      }
    });
    if (hasError) {
      throw new Error('Error occured！');
    } else {
      return form;
    }
  };

  const handleFormChange = (
    event: React.ChangeEvent<{ value: unknown; name: string }>,
  ) => {
    const { value, name } = event.target;
    // console.log(value, name);
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: false,
    });
  };

  const handleClose = () => {
    setForm(fields);
    setErrors({});
    // onClose();
  };

  const handleSubmit = async () => {
    try {
      const inputs = await validateFields();
      inputs.description = inputs.description.replaceAll('\n', '\n\n');
      inputs.descriptionEn = inputs.descriptionEn.replaceAll('\n', '\n\n');
      // console.log({inputs});
      /*
      const values = {
        creator: "0x1",
        description: "testcn",
        descriptionEn: "descn",
        idOnChain: "5",
        link: "http://test.org",
        network: "main",
        title: "testcn",
        titleEn: "test",
        typeArgs1: "0x1::Test::Test",
        status: 7,
        againstVotes: 100,
        forVotes: 1000,
        endTime: 1699999999
      };
      */

      const params = new URLSearchParams();
      const keys = Object.keys(inputs);
      const values = Object.values(inputs);
      keys.forEach((key, index) => {
        // console.log(`${key}: ${values[key]}`);
        params.append(key,values[index].toString());
      });

      const addURL = 'polls/modif';

      const postConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'accept': '*/*'
        }
      };

      // const url = '/polls/add?againstVotes=1&creator=0x1&description=1&descriptionEn=1&endTime=1&forVotes=1&idOnChain=1&link=1&network=1&status=1&title=1&titleEn=1&typeArgs1=1';
      // await client.post(values.id ? 'polls/modif' : 'polls/add', values);
      // await client.post('polls/add', values);
      // await client.post(url, values);
      // await client.post(addURL, params, postCconfig);
      // await client.post(`${addURL}?${params.toString()}`, params, postConfig);
      await client.post(addURL, params, postConfig);
      // await afterSubmit();
      handleClose();
      alert('Success');
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
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
    titleEn,
    descriptionEn,
    description,
    creator,
    link,
    endTime,
    typeArgs1,
    idOnChain,
    databaseID,
    forVotes,
    againstVotes,
    status,
    network,
  } = form;

  useEffect(() => {
    const init = async () => {
      if (!open) {
        // 此时为添加，会带上默认 creator
        /*
        if (id === undefined) {
          // setForm({ ...fields, creator: defaultCreator });
          setForm({ ...fields });
        } else {
          const detail = await client.get(`get?id=${id}&network=${network}`);
          setForm({
            title: detail.title,
            titleEn: detail.titleEn,
            descriptionEn: detail.descriptionEn,
            description: detail.description,
            creator: detail.creator,
            network: detail.network,
            status: detail.status,
            link: detail.link,
            typeArgs1: detail.typeArgs1,
            idOnChain: detail.idOnChain,
            databaseID: detail.id,
            forVotes: detail.forVotes,
            againstVotes: detail.againstVotes,
            endTime: detail.endTime,
            id: detail.id,
          });
        }
        */
        // const detail = await client.get(`get?id=${id}&network=${network}`);
        const detail = await client.get(`polls/detail/${pollDatabaseID}`);
        console.log('detail edit', detail)
        setForm({
          title: detail.title,
          titleEn: detail.titleEn,
          descriptionEn: detail.descriptionEn,
          description: detail.description,
          creator: detail.creator,
          network: detail.network,
          status: detail.status,
          link: detail.link,
          typeArgs1: detail.typeArgs1,
          idOnChain: detail.idOnChain,
          databaseID: detail.id,
          forVotes: detail.forVotes,
          againstVotes: detail.againstVotes,
          endTime: detail.endTime,
          id: detail.id,
        });
      }
    };
    init();
  }, [open, id, defaultCreator, network]);

  moment.locale(t('poll.locale'));

  return (
    <div>
      <Helmet>
        <title>{t('poll.createAPoll')}</title>
      </Helmet>

      {/*
      <Dialog
        open={open}
        aria-labelledby="simple-dialog-title"
        onClose={handleClose}
      >
        <DialogTitle id="simple-dialog-title">
          {id ? t('poll.edit') : t('poll.createAPoll')}
        </DialogTitle>
        <DialogContent>
          <DynamicForm />
          <TextField
            autoFocus
            required
            margin="dense"
            id="titleEn"
            name="titleEn"
            error={errors.titleEn}
            helperText={errors.titleEn ? helperTextMaps.titleEn : undefined}
            value={titleEn}
            label="Title"
            fullWidth
            onChange={handleFormChange}
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
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            required
            id="descriptionEn"
            name="descriptionEn"
            error={errors.descriptionEn}
            helperText={
              errors.descriptionEn ? helperTextMaps.descriptionEn : undefined
            }
            value={descriptionEn}
            label="Description"
            multiline
            rowsMax="4"
            fullWidth
            onChange={handleFormChange}
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
            onChange={handleFormChange}
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
            onChange={handleFormChange}
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
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            required
            id="endTime"
            name="endTime"
            helperText={errors.endTime ? helperTextMaps.endTime : undefined}
            error={errors.endTime}
            value={endTime}
            label={t('poll.endTime')}
            fullWidth
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            required
            id="typeArgs1"
            name="typeArgs1"
            error={errors.typeArgs1}
            helperText={
              errors.typeArgs1 ? helperTextMaps.typeArgs1 : undefined
            }
            value={typeArgs1}
            label={t('poll.type_args_1')}
            fullWidth
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="idOnChain"
            required
            name="idOnChain"
            error={errors.idOnChain}
            helperText={
              errors.idOnChain ? helperTextMaps.idOnChain : undefined
            }
            value={idOnChain}
            label={t('poll.id_on_chain')}
            fullWidth
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="forVotes"
            required
            name="forVotes"
            error={errors.forVotes}
            helperText={
              errors.forVotes ? helperTextMaps.forVotes : undefined
            }
            value={forVotes}
            label={t('poll.forVotes')}
            fullWidth
            onChange={handleFormChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="againstVotes"
            required
            name="againstVotes"
            error={errors.againstVotes}
            helperText={
              errors.againstVotes ? helperTextMaps.againstVotes : undefined
            }
            value={againstVotes}
            label={t('poll.againstVotes')}
            fullWidth
            onChange={handleFormChange}
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
              value={status}
              error={errors.status}
              label={t('poll.status')}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setForm({
                  ...form,
                  status: event.target.value as number,
                });
                setErrors({
                  ...errors,
                  status: false,
                });
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
                setForm({
                  ...form,
                  network: event.target.value as number,
                });
                setErrors({
                  ...errors,
                  network: false,
                });
              }}
            >
              {process.env.REACT_APP_STARCOIN_NETWORKS &&
                process.env.REACT_APP_STARCOIN_NETWORKS.split(',').map((net) => (
                  <MenuItem value={net} key={net}>
                    {net}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClose}>
            {t('poll.cancel')}
          </Button>
          <Button color="primary" autoFocus onClick={handleSubmit}>
            {t('poll.ok')}
          </Button>
        </DialogActions>
      </Dialog>
      */}

      <CenteredView>
          <Card>
            <CardHeader
              title={
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography>{id ? t('poll.edit') : t('poll.createAPoll')}</Typography>
                  </Grid>
                  </Grid>
              } />
          <Box className={classes.formBox}>
            {/* <DynamicForm /> */}
            <TextField
              autoFocus
              required
              margin="dense"
              id="titleEn"
              name="titleEn"
              error={errors.titleEn}
              helperText={errors.titleEn ? helperTextMaps.titleEn : undefined}
              value={titleEn}
              label="Title"
              fullWidth
              onChange={handleFormChange}
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
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              required
              id="descriptionEn"
              name="descriptionEn"
              error={errors.descriptionEn}
              helperText={errors.descriptionEn ? helperTextMaps.descriptionEn : undefined}
              value={descriptionEn}
              label="Description"
              multiline
              rowsMax="4"
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              id="description"
              required
              name="description"
              helperText={errors.description ? helperTextMaps.description : undefined}
              error={errors.description}
              value={description}
              label="中文描述"
              multiline
              rowsMax="4"
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              id="creator"
              required
              name="creator"
              helperText={errors.creator ? helperTextMaps.creator : undefined}
              error={errors.creator}
              value={creator}
              label={t('poll.creator')}
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              required
              id="link"
              name="link"
              helperText={errors.link ? helperTextMaps.link : undefined}
              error={errors.link}
              value={link}
              label={t('poll.externalUrl')}
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              required
              id="endTime"
              name="endTime"
              helperText={errors.endTime ? helperTextMaps.endTime : undefined}
              error={errors.endTime}
              value={endTime}
              label={t('poll.endTime')}
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              required
              id="typeArgs1"
              name="typeArgs1"
              error={errors.typeArgs1}
              helperText={
                errors.typeArgs1 ? helperTextMaps.typeArgs1 : undefined
              }
              value={typeArgs1}
              label={t('poll.type_args_1')}
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              id="idOnChain"
              required
              name="idOnChain"
              error={errors.idOnChain}
              helperText={
                errors.idOnChain ? helperTextMaps.idOnChain : undefined
              }
              value={idOnChain}
              label={t('poll.id_on_chain')}
              fullWidth
              onChange={handleFormChange}
              inputProps={
                { readOnly: true }
              }
            />
            <TextField
              margin="dense"
              id="forVotes"
              required
              name="forVotes"
              error={errors.forVotes}
              helperText={
                errors.forVotes ? helperTextMaps.forVotes : undefined
              }
              value={forVotes}
              label={t('poll.forVotes')}
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              margin="dense"
              id="againstVotes"
              required
              name="againstVotes"
              error={errors.againstVotes}
              helperText={
                errors.againstVotes ? helperTextMaps.againstVotes : undefined
              }
              value={againstVotes}
              label={t('poll.againstVotes')}
              fullWidth
              onChange={handleFormChange}
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
                value={status}
                error={errors.status}
                label={t('poll.status')}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setForm({
                    ...form,
                    status: event.target.value as number,
                  });
                  setErrors({
                    ...errors,
                    status: false,
                  });
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
                  setForm({
                    ...form,
                    network: event.target.value as number,
                  });
                  setErrors({
                    ...errors,
                    network: false,
                  });
                }}
              >
                {process.env.REACT_APP_STARCOIN_NETWORKS &&
                  process.env.REACT_APP_STARCOIN_NETWORKS.split(',').map((net) => (
                    <MenuItem value={net} key={net}>
                      {net}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          <Box className={classes.formBox}>
            <DialogActions>
              <Button variant="contained" color="secondary" onClick={handleClose}>
                {t('poll.cancel')}
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {t('poll.ok')}
              </Button>
            </DialogActions>
          </Box>
          </Card>
        </CenteredView>
    </div>
  );
};

PollDialog.defaultProps = {
  id: undefined,
  defaultCreator: '',
  network: undefined,
};

export default withStyles(useStyles)(withTranslation()(PollDialog));
