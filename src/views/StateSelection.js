import React, { useState, useEffect } from 'react';
import { SelectPicker } from 'rsuite';
import { forEachState } from '../utility/Utils';
const STATES = [];
const StateSelection = (props) => {
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
      placeholder='All States'
      style={{ width: 224 }}
      onChange={(value) => props.onChange(value)}
      value={value}
      onClean={() => props.onChange(null)}
    />
  );
};

export default StateSelection;
