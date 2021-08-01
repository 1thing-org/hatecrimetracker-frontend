import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const IncidentAdminPage = () => {
  // const { id } = match.params;
  const id = 0;
  const isAddMode = true;

  // form validation rules 
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    incident_time: Yup.date()
      .required('Incident time is required'),
    incident_location: Yup.string()
      .max(2, "Location should be in short form of state, such as NJ, NY, CA, etc.")
      .required('Incident location is required'),
    url: Yup.string(),
    abstract: Yup.string()
      .required('incident abstract is required')
  });

  // functions to build form returned by useForm() hook
  const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });

  function onSubmit(data) {
    return createIncident(data);
  }

  function createIncident(data) {
    alert("Create incident");
  }

  const [user, setUser] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
      <h1>{isAddMode ? 'Add Incident' : 'Edit Incident'}</h1>
      <div className="form-row">
        <div className="form-group col-2">
          <label>Incident Time</label>
          <input name="incident_time" type="date" ref={register} className={`form-control ${errors.incident_time ? 'is-invalid' : ''}`} />
          <div className="invalid-feedback">{errors.incident_time?.message}</div>
        </div>
        <div className="form-group col-2">
          <label>Location</label>
          <input name="incident_location" type="text" ref={register} className={`form-control ${errors.incident_location ? 'is-invalid' : ''}`} />
          <div className="invalid-feedback">{errors.incident_location?.message}</div>
        </div>
        <div className="form-group col-8">
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
            <input name="abstract" type="text" ref={register} className={`form-control ${errors.abstract ? 'is-invalid' : ''}`} />
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
  );
}

export default IncidentAdminPage;