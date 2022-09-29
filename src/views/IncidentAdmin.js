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
  
  const [currIncidentId, setCurrIncidentId] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isAddMode = () => !currIncidentId;


  // form validation rules 
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    incident_time: Yup.date().required('Incident time is required')
      .default(function () {
        return new Date();
      }),
    incident_location: Yup.string()
      .required('Incident location is required'),
    url: Yup.string().url(),
    abstract: Yup.string()
      .required('incident abstract is required'),
    donation_link: Yup.string().url(),
    police_tip_line: Yup.string(),
  });

  // functions to build form returned by useForm() hook
  const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });

  function onSubmit(incident) {
    incident.id = currIncidentId;
    incident.created_by = user.email;
    incidentsService.createIncident(incident).then((incident_id) => {
      Swal.fire("The incident has been saved successfully!")
      setValue("title", "");
      setValue("incident_location", "");
      setValue("url", "");
      setValue("abstract", "");
      setValue("donation_link", "");
      setValue("police_tip_line", "");
      setValue("help_the_victim", "");
      setCurrIncidentId(null);
      reloadIncidents(incident.incident_time);
    });
  }

  function reloadIncidents(date) {
    //load incidents around the date -7 - 1 days
    console.log("reloading incidents around:" + date);
    incidentsService.getIncidents(moment(date).subtract(7, 'days'), moment(date).add(1, 'days'), null, 'en', true)
      .then(incidents => setRecentIncidents(incidents));
  }
  function dateChanged(event) {
    // setData(FAKE_DATA.incidents);
    const date = event.target.value;
    setSelectedDate(date);
    reloadIncidents(date);
  }

  const editIncident = (incident) => {
    setCurrIncidentId(incident.id);
    reset({
      incident_time: moment(incident.incident_time).format('YYYY-MM-DD'),
      title: incident.title,
      incident_location: incident.incident_location,
      url: incident.url,
      abstract: incident.abstract,
      donation_link: incident.donation_link,
      police_tip_line: incident.police_tip_line,
      help_the_victim: incident.help_the_victim,
    });
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
          setCurrIncidentId(null);
          reloadIncidents(selectedDate);
        })
      }
    })
  };
  if (!user || !user.isadmin) {
    return (<div className="col-2"><Button tag={Link} to='/admin' color='secondary' block
      onClick={() => {
        signInWithGoogle();
      }}>
      Sign in with Google
    </Button>
    </div>);
  }
  const { photoURL, displayName, email, isadmin } = user;

  // statesAbbreviation stores all abbreviation of US states
  const statesAbbreviation = [];
  if (statesAbbreviation.length === 0) {
    forEachState((state, name) => {
      // create format as "New York - NY", "Canada - CANADA", "Online - ONLINE"
      statesAbbreviation.push([state, name + " - " + state]);
    });
  }
  // stateAbbrOptions is all options will be displayed on location  
  const stateAbbrOptions = (
    <>{statesAbbreviation.map(abbr => <option key={abbr[0]} value={abbr[0]}>{abbr[1]}</option>)}</>
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
        <p><Link onClick={() => auth.signOut()} to="/">Sign Out</Link></p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <h1>{isAddMode() ? 'Add Incident' : 'Edit Incident'}</h1>
        <div className="row">
          <div className="mb-3 col-2">
            <label>Incident Time</label>
            <input {...register("incident_time")} type="date"  className={`form-control ${errors?.incident_time ? 'is-invalid' : ''}`}
              onChange={dateChanged} />
            <div className="invalid-feedback">{errors?.incident_time?.message}</div>
          </div>
          <div className="mb-3 col-2">
            <label>Location</label>
            <select {...register("incident_location")} className={`form-control ${errors?.incident_location ? 'is-invalid' : ''}`}>
              <option value={""}>Select</option>
              {stateAbbrOptions}
            </select>
            <div className="invalid-feedback">{errors?.incident_location?.message}</div>
          </div>
          <div className="mb-3 col-8">
            <label>Title</label>
            <input {...register("title")} type="text" className={`form-control ${errors?.title ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors?.title?.message}</div>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-12">
            <label>URL</label>
            <input {...register("url")} type="text" className={`form-control ${errors?.url ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors?.url?.message}</div>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-12">
            <label>Abstract</label>
            <textarea {...register("abstract")} rows="4" className={`form-control ${errors?.abstract ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors?.abstract?.message}</div>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-8">
            <label>Donation</label>
            <input {...register("donation_link")} type="text" className={`form-control ${errors?.donation_link ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors?.donation_link?.message}</div>
          </div>
          <div className="mb-3 col-4">
            <label>Police Tip Line</label>
            <input {...register("police_tip_line")} type="text" className={`form-control ${errors?.police_tip_line ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors?.police_tip_line?.message}</div>
          </div>
        </div>
        <div className="form-row">
          <div className="mb-3 col-12">
            <label>Help the victim</label>
            <textarea {...register("help_the_victim")} rows="4" className={`form-control ${errors?.help_the_victim ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors?.help_the_victim?.message}</div>
          </div>
        </div>
        <div className="mb-3">
          <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
            Save
          </button>
          <Link to={isAddMode() ? '.' : '..'} className="btn btn-link">Cancel</Link>
        </div>
      </form>
      <IncidentTable className="col-12"
        title="Incidents Around the Same Time Period"
        data={recentIncidents}
        onEdit={editIncident}
        onDelete={deleteIncident}
      />
    </div>
  );
}

export default IncidentAdminPage;