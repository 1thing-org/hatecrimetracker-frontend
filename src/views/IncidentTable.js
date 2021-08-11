import DataTable from 'react-data-table-component';
import moment from 'moment';

const columns = [
  {
    name: 'Date',
    selector: 'incident_time',
    sortable: true,
    format: row => moment(row.incident_time).format('MM/DD/YYYY'),
    width: "120px"
  },
  {
    name: 'Location',
    selector: 'incident_location',
    sortable: true,
    width: "80px"
  },
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
    max_width: "600px",
    wrap: true,
    format: (row) => {
      if (row.url) {
        return <a href={row.url} target='_blank'>{row.title}</a>;
      }
      return row.title;
    }
  }
];

const IncidentTable = ({ data, title }) => {
  return (
    <DataTable striped={true} title={title} columns={columns} data={data} />
  )
}
export default IncidentTable
