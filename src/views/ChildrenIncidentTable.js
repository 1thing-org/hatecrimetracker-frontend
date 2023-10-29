import DataTable from "react-data-table-component"
import moment from 'moment';
import { Button } from 'reactstrap';
import Popup from './Popup.js';

const ChildIncidentTable = ( {data , onEdit, onDelete, onAddRelatedNews }) => {
    console.log("Entering ChildIncidentTable");
    console.log(data);
    console.log("Exiting ChildIncidentTable");
    let columns = [
      {
        name: '',
        width: "80px"
      },
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
            width: "180px",
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
            width: "180px",
            format: (row) => {
              return <Button color='warning' block onClick={() => onDelete(row)} >
                Delete
              </Button>;
            }
          }
        );
      }
      if (onAddRelatedNews){
        columns.push(
          {
            name: '',
            grow: 1,
            selector: row => row['url'],
            width: "180px",
            format: (row) => {
              return <>
              <div>
                <Button color='danger' block  >
                Add FollowUps
                </Button>
                
              </div>
            </>
            }
          }
        );
      }
      
    return (
        <DataTable
            columns={columns}
            data={data}
            theme="dark"
        />
    )
}
export default ChildIncidentTable