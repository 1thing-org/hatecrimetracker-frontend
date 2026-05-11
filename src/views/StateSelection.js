import React, { useState, useEffect } from 'react';
import { SelectPicker } from 'rsuite';
import { useTranslation } from 'react-i18next';
import { forEachState } from '../utility/Utils';
const STATES = [];
const StateSelection = (props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(props.value);

  if (STATES.length === 0) {
    forEachState((state, name) => {
      STATES.push({
        label: name,
        value: state,
      });
    });
  }

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  return (
    <SelectPicker
      data={STATES}
      placeholder={t('all_states')}
      style={{ width: 224 }}
      onChange={(value) => props.onChange(value)}
      value={value}
      onClean={() => props.onChange(null)}
    />
  );
};

export default StateSelection;
