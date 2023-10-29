import DataTable from 'react-data-table-component';
import moment from 'moment';
import { Button } from 'reactstrap';
import Popup from './Popup.js';
import './Popup.css';
import { useState} from 'react';
import {Component} from 'react';
import ChildIncidentTable from './ChildrenIncidentTable';
const IncidentTable = ({ data, title, onEdit, onDelete, onAddRelatedNews }) => {
  console.log("Hello, world!");
  const [AddFollowUp, SetAddFollowup] = useState(false);
  let columns = [
    {
      name: 'Date',
      selector: row => row[0]['incident_time'],
      sortable: true,
      format: row => moment(row.incident_time).format('MM/DD/YYYY'),
      width: "120px"
    },
    {
      name: 'Location',
      selector: row => row[0]['incident_location'],
      sortable: true,
      width: "100px"
    },
    {
      name: 'Title',
      selector: row => row[0]['title'],
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
      selector: row => row[0]['created_by'],
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
        selector: row => row[0]['url'],
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
        selector: row => row[0]['url'],
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
        selector: row => row[0]['url'],
        width: "180px",
        format: (row) => {
          return <>
          <div>
            <Button color='danger' block onClick={() => SetAddFollowup(true) } >
            Add FollowUps
            </Button>
            //parent news is the first news in the row
            <Popup trigger={AddFollowUp} setTrigger={SetAddFollowup} parentId={row[0]['id']}>
              <h3>Add Related News</h3>
            </Popup>
          </div>
        </>
          
         
         
          
        }
      }
    );
  }
  //children news
  const ExpandedComponent = (row) => 
  <ChildIncidentTable data={row.data.slice(1, row.data.length)} 
  onEdit={onEdit}
  onDelete={onDelete}
  onAddRelatedNews={onAddRelatedNews}
  />;
  
  return (
    <DataTable title={title}
    columns={columns}
    data={data}
    expandableRows
    expandableRowsComponent={ExpandedComponent}
    theme="dark" />
  )
}
export default IncidentTable