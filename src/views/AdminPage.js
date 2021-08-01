import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const AdminPage = () => {
    const incident = {}
    const user = useContext(UserContext);
    // const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = data => console.log("data:", data);
    const onError = (errors, e) => console.log(errors, e);
    // const onSubmit = data => {
    //   setSubmitting(true);
    //   console.log(incident);
    //   console.log("data:", data);
    //   setTimeout(() => {
    //     setSubmitting(false);
    //   }, 3000)
    // }
    // console.log(watch("url")); 
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
              height: "200px",
              width: "200px"
            }}
            className="border border-blue-300"
          ></div>
          <div className="md:pl-4">
            <h2 className="text-2xl font-semibold">Name: {displayName}</h2>
            <h3 className="italic">Email: {email}</h3>
            <h3 className="italic">Is Admin: {isadmin ? "true" : "false"}</h3>
          </div>
        </div>
        <h1>How About Them Apples</h1>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <fieldset>
            <label>
              Date
            </label>
            <input type="date" {...register("incident_time", { valueAsDate: true,required: true, message: "Incident date is requried", maxLength: 20 })} />

          </fieldset>
          <fieldset>
            <label>
              <p>Location</p>
              <input  {...register("incident_location", { required: true, message: "Incident location is requried", maxLength: 6 })} />
            </label>
          </fieldset>
          <fieldset>
            <label>
              <p>Abstract</p>
              <input  placeholder="First Name"  {...register("abstract", { required: false, message: "Abstract is requried", maxLength: 512 })} />
            </label>
          </fieldset>
          <fieldset>
            <label>
              <p>url</p>
              <input  {...register("url", { required: true, maxLength: 256 })} />

            </label>
          </fieldset>
          <fieldset>
            <label>
              <p>Title</p>
              <input  {...register("title", { required: true, maxLength: 256 })} />
            </label>
          </fieldset>
          <input type="submit" />
        </form>
      </div>

    )
  };
export default AdminPage;