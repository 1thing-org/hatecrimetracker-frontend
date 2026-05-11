import * as dateFns from "date-fns";
import { DateRangePicker } from "rsuite";
import { useTranslation } from "react-i18next";
const { afterToday } = DateRangePicker;

const DateRangeSelector = ({ onChange, value, isMobile }) => {
	const { t } = useTranslation();
	// Build the preset ranges inside the component so the labels go through
	// t() and pick up the active language.
	const dateRanges = [
		{
			label: t("last_month"),
			value: [dateFns.addMonths(new Date(), -1), new Date()],
		},
		{
			label: t("last_6_months"),
			value: [dateFns.addMonths(new Date(), -6), new Date()],
		},
		{
			label: t("last_year"),
			value: [dateFns.addYears(new Date(), -1), new Date()],
		},
		{
			// Year-number label (e.g. "2024") — intentionally not translated.
			label: dateFns.format(dateFns.addYears(new Date(), -1), "yyyy"),
			value: [
				dateFns.startOfYear(dateFns.addYears(new Date(), -1)),
				dateFns.endOfYear(dateFns.addYears(new Date(), -1)),
			],
		},
		{
			label: t("year_to_date"),
			value: [dateFns.startOfYear(new Date()), new Date()],
		},
	];

	return (
		<DateRangePicker
			placement='auto'
			showOneCalendar={isMobile}
			ranges={dateRanges}
			disabledDate={afterToday()}
			onChange={onChange}
			value={value}
			format='MM/dd/yy'
		/>
	);
};

export default DateRangeSelector;
