import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import * as Yup from 'yup';
import { UserContext } from "../providers/UserProvider";

const IncidentAdminPage = () => {
  const user = useContext(UserContext);
  const id = 0;
  const isAddMode = true;

  const [data, setData] = useState([]);
  const columns = [
    {
      name: 'Date',
      selector: 'incident_time',
      sortable: true,
      format: row => moment(row.incident_time).format('MM/DD/YYYY'),
      width: "100px"
    },
    {
      name: 'Location',
      selector: 'incident_location',
      sortable: true,
      width:"80px"
    },
    {
      name: 'Title',
      selector: 'title',
      sortable: true,
      max_width:"600px",
      wrap : true,
      format: (row) => {
        if (row.url) {
          return <a href={row.url} target='_blank'>{row.title}</a>;
        }
        return row.title;
      }
    },
    {
      name: 'Action',
      grow: 1,
      selector: "url",
      width:"120px",
      format: (row) => {
        return <Button.Ripple color='primary' block onClick={() => deleteIncident(row.id)} >
          Delete
        </Button.Ripple>;
      }
    }
  ];

  // form validation rules 
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    incident_time: Yup.date().required('Incident time is required')
      .default(function () {
        return new Date("2020-03-30");
      }),
    incident_location: Yup.string()
      .max(2, "Location should be in short form of state, such as NJ, NY, CA, etc.")
      .required('Incident location is required'),
    url: Yup.string().url(),
    abstract: Yup.string()
      .required('incident abstract is required')
  });

  // functions to build form returned by useForm() hook
  const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const FAKE_DATA = {
    "incidents": [
      {
        "abstract": "Two people recently called the police on an Asian American man who was visiting his parents. Following the incident, the man wrote a complaint stating that the accusers had committed racial profiling, bias-by-proxy, discrimination and harassment, and the officers failed to investigate their actions properly and threatened him.",
        "created_on": "Sat, 17 Jul 2021 21:26:19 GMT",
        "id": "DauMR6nHVZjrc1X4dGoR",
        "incident_location": "CA",
        "incident_source": "racismiscontagious",
        "incident_time": "Fri, 10 Jul 2020 00:00:00 GMT",
        "key": "incident/DauMR6nHVZjrc1X4dGoR",
        "title": "Two people recently called the police on an Asian American man who was visiting his parents. Following the incident, the man wrote a complaint stating that the accusers had committed racial profiling, bias-by-proxy, discrimination and harassment, and the officers failed to investigate their actions properly and threatened him.",
        "url": "https://nextshark.com/davis-karen-ken-call-police-asian-man/"
      },
      {
        "abstract": "A Korean American artist was punched in the face and knocked to the ground on her way to work near Bryant Park in New York City.",
        "created_on": "Sat, 17 Jul 2021 21:26:19 GMT",
        "id": "4m53VtJYowUQYiYQ1zHV",
        "incident_location": "NY",
        "incident_source": "racismiscontagious",
        "incident_time": "Tue, 07 Jul 2020 00:00:00 GMT",
        "key": "incident/4m53VtJYowUQYiYQ1zHV",
        "title": "A Korean American artist was punched in the face and knocked to the ground on her way to work near Bryant Park in New York City.",
        "url": "https://nextshark.com/bryant-park-korean-american-artist-punched-nyc/"
      }
    ]
  }

  function onSubmit(data) {
    // existingIncidents.push({ title: data.title, year: data.incident_time.toString(), incident_location: data.incident_location, url: data.url, abstract: data.abstract });
    // setData(existingIncidents);
    return createIncident(data);
  }
  function dateChanged(event) {
    setData(FAKE_DATA.incidents);
    // const date = event.target.value;
    // //load incidents around the date +/-3 days
    // getIncidents(moment(date).subtract(3, 'days'), moment(date).add(3, 'days'))
    //   .then(incidents => setData(incidents));
  }

  function createIncident(data) {
    alert("Create incident");
  }

  function deleteIncident(id) {
    alert("Delete incident:" + id);
  }
  if (!user || !user.isadmin) {
    return (<div> Please <Link to="/login">Login</Link> </div>);
  }
  const { photoURL, displayName, email, isadmin } = user;
  return (
    <div className="mx-auto w-11/12 md:w-2/4 py-8 px-4 md:px-8">
      <div className="flex border flex-col items-center md:flex-row md:items-start border-blue-400 px-3 py-4">
        <div
          style={{
            background: `url(${photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
            backgroundSize: "cover",
            height: "64px",
            width: "64px"
          }}
          className="border border-blue-300 col-2"
        ></div>
        <p className="text-2xl font-semibold">Name: {displayName} <br /> Email: {email}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <h1>{isAddMode ? 'Add Incident' : 'Edit Incident'}</h1>
        <div className="form-row">
          <div className="form-group col-2">
            <label>Incident Time</label>
            <input name="incident_time" type="date" ref={register} className={`form-control ${errors.incident_time ? 'is-invalid' : ''}`}
              onChange={dateChanged} />
            <div className="invalid-feedback">{errors.incident_time?.message}</div>
          </div>
          <div className="form-group col-1">
            <label>Location</label>
            <input name="incident_location" type="text" ref={register} className={`form-control ${errors.incident_location ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.incident_location?.message}</div>
          </div>
          <div className="form-group col-9">
            <label>Title</label>
            <input name="title" type="text" ref={register} className={`form-control ${errors.title ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.title?.message}</div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-12">
            <label>URL</label>
            <input name="url" type="text" ref={register} className={`form-control ${errors.url ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.url?.message}</div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-12">
            <label>Abstract</label>
            <textarea name="abstract" rows="4" ref={register} className={`form-control ${errors.abstract ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors.abstract?.message}</div>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
            Save
          </button>
          <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
        </div>
      </form>
      <DataTable className="col-12" striped={true}
        title="Incidents Around the Same Time Period"
        columns={columns}
        data={data}
      />
    </div>
  );
}

export default IncidentAdminPage;