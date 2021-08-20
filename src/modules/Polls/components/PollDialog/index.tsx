import React, { useState, useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withTranslation } from 'react-i18next';
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

import 'moment/locale/zh-cn';

interface PollDialogProps {
  open: boolean;
  id?: string;
  network?: string;
  t: any;
  onClose: () => void;
  afterSubmit: () => void;
  defaultCreator?: string;
}

const fields = {
  title: '',
  title_en: '',
  description_en: '',
  description: '',
  creator: '',
  network: 'main',
  status: '1',
  link: '',
  type_args_1: '',
  id_on_chain: '',
  end_time: moment().add('7', 'days'),
};

const requiredFields = Object.keys(fields);

const PollDialog = ({
  open,
  t,
  onClose,
  afterSubmit,
  id,
  defaultCreator,
}: PollDialogProps) => {
  const [form, setForm] = useState<Record<string, any>>(fields);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const helperTextMaps = {
    title_en: 'Please input title.',
    title: '请输入中文标题.',
    description_en: 'Please input description.',
    description: '请输入中文描述.',
    deposite: t('poll.depositeHelperText'),
    end_time: t('poll.endTimeHelperText'),
    creator: t('poll.creatorHelperText'),
    link: t('poll.urlHelperText'),
    network: t('poll.networkHelperText'),
    type_args_1: t('poll.type_args_1HelperText'),
    id_on_chain: t('poll.id_on_chainHelperText'),
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
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await validateFields();
      values.description = values.description.replaceAll('\n', '\n\n');
      values.description_en = values.description_en.replaceAll('\n', '\n\n');
      values.end_time = moment(values.end_time).valueOf();
      await client.post(values.id ? 'edit' : 'add', values);
      await afterSubmit();
      handleClose();
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
    title_en,
    description_en,
    description,
    creator,
    link,
    end_time,
    type_args_1,
    id_on_chain,
    status,
    network,
  } = form;

  useEffect(() => {
    const init = async () => {
      if (open) {
        // 此时为添加，会带上默认 creator
        if (id === undefined) {
          setForm({ ...fields, creator: defaultCreator });
        } else {
          const detail = await client.get(`get?id=${id}&network=${network}`);
          setForm({
            title: detail.title,
            title_en: detail.titleEn,
            description_en: detail.descriptionEn,
            description: detail.description,
            creator: detail.creator,
            network: detail.network,
            status: detail.status,
            link: detail.link,
            type_args_1: detail.typeArgs1,
            id_on_chain: detail.idOnChain,
            end_time: detail.endTime,
            id: detail.id,
          });
        }
      }
    };
    init();
  }, [open, id, defaultCreator, network]);

  moment.locale(t('poll.locale'));

  return (
    <Dialog
      open={open}
      aria-labelledby="simple-dialog-title"
      onClose={handleClose}
    >
      <DialogTitle id="simple-dialog-title">
        {id ? t('poll.edit') : t('poll.createAPoll')}
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
          id="description_en"
          name="description_en"
          error={errors.description_en}
          helperText={
            errors.description_en ? helperTextMaps.description_en : undefined
          }
          value={description_en}
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
          disabled
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
        <MuiPickersUtilsProvider
          libInstance={moment}
          utils={MomentUtils}
          locale={t('poll.locale')}
        >
          <DateTimePicker
            label={t('poll.endTime')}
            // inputVariant="outlined"
            value={end_time}
            onChange={(date) => {
              setForm({
                ...form,
                end_time: date,
              });
            }}
            style={{ marginTop: 16 }}
          />
        </MuiPickersUtilsProvider>
        <TextField
          autoFocus
          margin="dense"
          required
          id="type_args_1"
          name="type_args_1"
          error={errors.type_args_1}
          helperText={
            errors.type_args_1 ? helperTextMaps.type_args_1 : undefined
          }
          value={type_args_1}
          label={t('poll.type_args_1')}
          fullWidth
          onChange={handleFormChange}
        />
        <TextField
          autoFocus
          margin="dense"
          id="id_on_chain"
          required
          name="id_on_chain"
          error={errors.id_on_chain}
          helperText={
            errors.id_on_chain ? helperTextMaps.id_on_chain : undefined
          }
          value={id_on_chain}
          label={t('poll.id_on_chain')}
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
  );
};

PollDialog.defaultProps = {
  id: undefined,
  defaultCreator: '',
  network: undefined,
};

export default withTranslation()(PollDialog);
