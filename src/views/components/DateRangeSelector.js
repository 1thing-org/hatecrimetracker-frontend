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
  // {
  //   label: dateFns.format(dateFns.addMonths(new Date(), -1), "MMMMMMM, yyyy"),

  //   value: [dateFns.startOfMonth(dateFns.addMonths(new Date(), -1)), dateFns.endOfMonth(dateFns.addMonths(new Date(), -1))]
  // },
  {
    label: 'Last 6 Months',
    value: [dateFns.addMonths(new Date(), -6), new Date()]
  },
  {
    label: 'Last Year', 
    value: [dateFns.addYears(new Date(), -1), new Date()]
  },
  {
    label: dateFns.format(dateFns.addYears(new Date(), -1), "yyyy"),
    value: [dateFns.startOfYear(dateFns.addYears(new Date(), -1)), dateFns.endOfYear(dateFns.addYears(new Date(), -1))]
  },
  {
    label: 'YTD', 
    value: [dateFns.startOfYear(new Date()), new Date()]
  },
];
const DateRangeSelector = ({ onChange, value, isMobile }) => {
    return (
      <DateRangePicker placement="auto" showOneCalendar={isMobile} ranges={dateRanges} disabledDate={afterToday()} onChange={onChange} value={value} />
    )
}

export default DateRangeSelector;