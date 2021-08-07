import * as dateFns from 'date-fns';
import {DateRangePicker} from 'rsuite';
const {
  afterToday,
} = DateRangePicker;
const dateRanges = [
  {
    label: 'Last Month',

    value: [dateFns.addMonths(new Date(), -1), new Date()]
  },
  {
    label: 'Previous Month',

    value: [dateFns.startOfMonth(dateFns.addMonths(new Date(), -1)), dateFns.endOfMonth(dateFns.addMonths(new Date(), -1))]
  },
  {
    label: 'Last Year',
    value: [dateFns.addYears(new Date(), -1), new Date()]
  },
  {
    label: 'Previous Year',
    value: [dateFns.startOfYear(dateFns.addYears(new Date(), -1)), dateFns.endOfYear(dateFns.addYears(new Date(), -1))]
  }
];
const DateRangeSelector = ({ onChange }) => {
    return (
      <DateRangePicker ranges={dateRanges} disabledDate={afterToday()} onChange={onChange} />
    )
}

export default DateRangeSelector;