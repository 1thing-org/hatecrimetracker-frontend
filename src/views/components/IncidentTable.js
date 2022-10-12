import DataTable from 'react-data-table-component';
import moment from 'moment';
import { Button } from 'reactstrap';

const IncidentTable = ({ data, title, onEdit, onDelete }) => {
  let columns = [
    {
      name: 'Date',
      selector: row => row['incident_time'],
      sortable: true,
      format: row => moment(row.incident_time).format('MM/DD/YYYY'),
      width: "120px"
    },
    {
      name: 'Location',
      selector: row => row['incident_location'],
      sortable: true,
      width: "100px"
    },
    {
      name: 'Title',
      selector: row => row['title'],
      sortable: true,
      wrap: true,
      format: (row) => {
        if (row.url) {
          return <a href={row.url} target='_blank'>{row.title}</a>;
        }
        return row.title;
      }
    },
    {
      name: 'Entered By',
      selector: row => row['created_by'],
      sortable: true,
      max_width: "100px",
      wrap: false
    },
  ];

  if (onDelete) {
    columns.push(
      {
        name: '',
        grow: 1,
        selector: row => row['url'],
        width: "100px",
        format: (row) => {
          return <Button color='danger' block onClick={() => onEdit(row)} >
            Edit
          </Button>;
        }
      }
    );
  }
  if (onDelete) {
    columns.push(
      {
        name: '',
        grow: 1,
        selector: row => row['url'],
        width: "120px",
        format: (row) => {
          return <Button color='warning' block onClick={() => onDelete(row)} >
            Delete
          </Button>;
        }
      }
    );
  }

  return (
    <DataTable title={title} columns={columns} data={data} theme="dark" />
  )
}
export default IncidentTable
