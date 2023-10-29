import { React , useContext} from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import * as incidentsService from "../services/incidents";
import { Link } from 'react-router-dom';
import { auth } from "../firebase";
import { forEachState } from '../utility/Utils';
import { UserContext } from "../providers/UserProvider";

function Popup(props){
  console.log(props.trigger);
  // statesAbbreviation stores all abbreviation of US states
  const statesAbbreviation = [];
  const user = useContext(UserContext);

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


  const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
    resolver: yupResolver(validationSchema)
  });
  //call the same function when adding a root news to database
  //on the backend, the child news will be differentiated by parentId
  //root news doesn't have parentId
  function onSubmit(incident) {
    //incident.id = currIncidentId;
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
      setValue("parent", parentId)
      //setCurrIncidentId(null);
      
    });
  }
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
  


  return (props.trigger) ? (
  <div className="popup">
        <div className="popupInner">
          <div className="mx-auto w-11/12 md:w-2/4 py-8 px-4 md:px-8">
          <div className="flex border flex-col items-center md:flex-row md:items-start border-blue-400 px-3 py-4">
          
          <form onSubmit={handleSubmit(onSubmit)}>
          <h1></h1>
          <div className="row">
          <div className="mb-3 col-2">
            <label>Incident Time</label>
            <input {...register("incident_time")} type="date"  className={`form-control ${errors?.incident_time ? 'is-invalid' : ''}`}
               />
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
          <div className="mb-3 col-8">
            <label>URL</label>
            <input {...register("url")} type="text" className={`form-control ${errors?.url ? 'is-invalid' : ''}`} />
            <div className="invalid-feedback">{errors?.url?.message}</div>
          </div>
          <div className="mb-3 col-4">
          <label>Parent</label>
          <input  {...register("parent")} type="hidden" value={props.parentId}  className={`form-control ${errors?.parent ? 'is-invalid' : ''}`}/>
          <div className="invalid-feedback">{errors?.parent?.message}</div>
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
          
        </div>
        </form>
            <button className="close-btn" onClick={()=> props.setTrigger(false)}>close</button>
         </div>
       </div>
     </div>
   </div>
 
   ) : ""
}

export default Popup;