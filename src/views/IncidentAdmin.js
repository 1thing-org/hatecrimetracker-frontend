import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { auth } from "../firebase";
import { UserContext } from "../providers/UserProvider";
import * as incidentsService from "../services/incidents";
import IncidentTable from './IncidentTable';
import { Button } from 'reactstrap'
import { signInWithGoogle } from '../firebase'
// to get states abbreviation
import { forEachState } from '../utility/Utils';

const IncidentAdminPage = () => {
  const user = useContext(UserContext);
  const isAddMode = true;

  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // form validation rules 
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    incident_time: Yup.date().required('Incident time is required')
      .default(function () {
        return new Date();
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

  function onSubmit(data) {
    data.created_by = user.email;
    incidentsService.createIncident(data).then((incident_id) => {
      Swal.fire("The incident has been saved successfully!")
      setValue("title", "");
      setValue("incident_location", "");
      setValue("url", "");
      setValue("abstract", "");
      reloadIncidents(data.incident_time);
    });
  }

  function reloadIncidents(date) {
    //load incidents around the date -7 - 1 days
    console.log("reloading incidents around:" + date);
    incidentsService.getIncidents(moment(date).subtract(7, 'days'), moment(date).add(1, 'days'), null, 'en', true)
      .then(incidents => setData(incidents));
  }
  function dateChanged(event) {
    // setData(FAKE_DATA.incidents);
    const date = event.target.value;
    setSelectedDate(date);
    reloadIncidents(date);
  }

  const deleteIncident = (incident) => {
    Swal.fire({
      title: 'Are you sure you want to delete this incident?',
      icon: 'warning',
      html:
        'Title:' + incident.title + '<br/>' +
        'Id:' + incident.id + '<br/>' +
        'Date:' + moment(incident.incident_time).format('MM/DD/YYYY') + '<br/>' +
        'Location:' + incident.incident_location,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        incidentsService.deleteIncident(incident.id).then(() => {
          Swal.fire("Incident has been delete successfully!")
          reloadIncidents(selectedDate);
        })
      }
    })
  };
  if (!user || !user.isadmin) {
    return (<div className="col-2"><Button.Ripple tag={Link} to='/admin' color='secondary' block
      onClick={() => {
        signInWithGoogle();
      }}>
      Sign in with Google
    </Button.Ripple>
    </div>);
  }
  const { photoURL, displayName, email, isadmin } = user;

  // statesAbbreviation stores all abbreviation of US states
  const statesAbbreviation = [];
  if (statesAbbreviation.length === 0) {
    forEachState((state, name) => {
      if (state.length == 2) {
        // only the abbreviation will be added to statesAbbreviation
        statesAbbreviation.push(state);
      }
    });
  }
  // stateAbbrOptions is all options will be displayed on location  
  const stateAbbrOptions = (
    <>{statesAbbreviation.map(abbr => <option>{abbr}</option>)}</>
  );


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
        <p><Link onClick={() => auth.signOut()}>Sign Out</Link></p>
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
            {/* <input name="incident_location" type="text" ref={register} className={`form-control ${errors.incident_location ? 'is-invalid' : ''}`} /> */}
            <select name="incident_location" ref={register} className={`form-control ${errors.incident_location ? 'is-invalid' : ''}`}>
              <option>select</option>
              {stateAbbrOptions}
            </select>
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
      <IncidentTable className="col-12"
        title="Incidents Around the Same Time Period"
        data={data}
        onDelete={deleteIncident}
      />
    </div>
  );
}

export default IncidentAdminPage;