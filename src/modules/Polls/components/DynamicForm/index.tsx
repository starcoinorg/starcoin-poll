import React, { useState, useEffect, ReactElement } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withTranslation } from 'react-i18next';

interface Child {
  name: string;
  type?: string;
  children?: Child[];
}

type Schema = {
  name: string;
  type?: string;
  children?: Child[];
}[];

const initSchema: Schema = [
  {
    name: 'func1',
    children: [
      {
        name: 'name1',
        type: 'string',
      },
      {
        name: 'name2',
        type: 'number',
      },
      {
        name: 'name3',
        type: 'boolean',
      },
      {
        name: 'name4',
        type: 'boolean',
      },
      {
        name: 'name5',
        type: 'boolean',
      },
    ],
  },
  {
    name: 'func2',
    children: [
      {
        name: 'func2-1',
        children: [
          {
            name: 'name1',
            type: 'string',
          },
          {
            name: 'name2',
            type: 'number',
          },
          {
            name: 'name3',
            type: 'boolean',
          },
        ],
      },
      {
        name: 'func2-3',
        children: [
          {
            name: 'xxx',
            type: 'boolean',
          },
          {
            name: 'xxxx',
            type: 'boolean',
          },
          {
            name: 'yyyy',
            type: 'boolean',
          },
        ],
      },
    ],
  },
];

const selectStyle = {
  width: '100%',
  margin: '8px 0',
};

interface i18nProps {
  t: any;
}

interface DynamicFormProps extends i18nProps {}

const DynamicForm = (props: DynamicFormProps) => {
  const { t } = props;
  const [selections, setSelections] = useState<string[]>([]);
  const [form, setForm] = useState<Record<string, any>>({});
  const [schema, setSchema] = useState<Schema>([]);

  const handleSelectionChanged = (value: string, index: number) => {
    const nextSelections: Array<string> = selections.slice(0, index + 1);
    nextSelections[index] = value;
    setSelections(nextSelections);
  };

  const handleFormChange = (
    event: React.ChangeEvent<{
      value?: string;
      name: string;
      checked?: boolean;
    }>,
  ) => {
    const target = event.target;
    const { name } = target;
    if (Object.prototype.hasOwnProperty.call(target, 'checked')) {
      setForm({ ...form, [name]: target.checked });
    } else if (Object.prototype.hasOwnProperty.call(target, 'value')) {
      setForm({ ...form, [name]: target.value });
    }
  };

  const handleCodeChange = (event: React.ChangeEvent<{ value: string }>) => {
    const { value } = event.target;
    console.log('value: ', value);
    setTimeout(() => {
      setSchema(initSchema);
    }, 1000);
  };

  const renderFormItems = () => {
    const ret: ReactElement[] = [];
    let current: Schema = schema;
    selections.forEach((select, index) => {
      const item = current.find((cur) => cur.name === select)!;
      const children = item.children!;
      const isSelect = Object.prototype.hasOwnProperty.call(
        children[0],
        'children',
      );
      if (isSelect) {
        ret.push(
          <FormControl style={selectStyle} key={index + 1}>
            <InputLabel id={`${index}`}>FunctionId{index}</InputLabel>
            <Select
              labelId={`${index}`}
              value={selections[index + 1] || ''}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                const value = event.target.value as string;
                handleSelectionChanged(value, index + 1);
              }}
            >
              {children.map(({ name }) => (
                <MenuItem value={name} key={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>,
        );
      } else {
        children.forEach(({ name, type }) => {
          switch (type) {
            case 'number':
              ret.push(
                <TextField
                  margin="dense"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="0.0000"
                  id={name}
                  name={name}
                  label={name}
                  key={name}
                  fullWidth
                  value={form[name] || ''}
                  onChange={handleFormChange}
                />,
              );
              break;
            case 'string':
              ret.push(
                <TextField
                  margin="dense"
                  id={name}
                  name={name}
                  label={name}
                  key={name}
                  fullWidth
                  value={form[name] || ''}
                  onChange={handleFormChange}
                />,
              );
              break;
            case 'boolean':
              ret.push(
                <div key={name}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!form[name]}
                        onChange={handleFormChange}
                        name={name}
                        color="primary"
                      />
                    }
                    label={name}
                  />
                </div>,
              );
              break;
            default:
              break;
          }
        });
      }
      current = children;
    });
    return ret;
  };

  useEffect(() => {
    return () => {
      setSelections([]);
      setForm({});
      setSchema([]);
    };
  }, []);

  return (
    <Card>
      <CardContent>
        <TextField
          multiline
          margin="dense"
          style={selectStyle}
          label={t('poll.code')}
          onChange={handleCodeChange}
        />
        {schema.length ? (
          <>
            <FormControl style={selectStyle}>
              <InputLabel id="funcId">FunctionId</InputLabel>
              <Select
                labelId="funcId"
                value={selections[0] || ''}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  const value = event.target.value as string;
                  handleSelectionChanged(value, 0);
                }}
                key={0}
              >
                {schema.map(({ name }) => (
                  <MenuItem value={name} key={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {renderFormItems()}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default withTranslation()(DynamicForm);
