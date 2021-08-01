import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const AdminPage = () => {
  //   const incident = {}
  //   const user = useContext(UserContext);
  //   // const [submitting, setSubmitting] = useState(false);
  //   const { register, handleSubmit, watch, formState: { errors } } = useForm();

  //   const onSubmit = data => console.log("data:", data);
  //   const onError = (errors, e) => console.log(errors, e);
  //   // const onSubmit = data => {
  //   //   setSubmitting(true);
  //   //   console.log(incident);
  //   //   console.log("data:", data);
  //   //   setTimeout(() => {
  //   //     setSubmitting(false);
  //   //   }, 3000)
  //   // }
  //   // console.log(watch("url")); 
  //   if (!user || !user.isadmin) {
  //     return (<div> Please <Link to="/login">Login</Link> </div>);
  //   }
  //   const { photoURL, displayName, email, isadmin } = user;

  //   return (
  //     <div className="mx-auto w-11/12 md:w-2/4 py-8 px-4 md:px-8">
  //       <div className="flex border flex-col items-center md:flex-row md:items-start border-blue-400 px-3 py-4">
  //         <div
  //           style={{
  //             background: `url(${photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
  //             backgroundSize: "cover",
  //             height: "200px",
  //             width: "200px"
  //           }}
  //           className="border border-blue-300"
  //         ></div>
  //         <div className="md:pl-4">
  //           <h2 className="text-2xl font-semibold">Name: {displayName}</h2>
  //           <h3 className="italic">Email: {email}</h3>
  //           <h3 className="italic">Is Admin: {isadmin ? "true" : "false"}</h3>
  //         </div>
  //       </div>
  //       <h1>How About Them Apples</h1>

  //       {/* <form onSubmit={handleSubmit(onSubmit, onError)}>
  //         <fieldset>
  //           <label>
  //             Date
  //           </label>
  //           <input type="date" {...register("incident_time", { valueAsDate: true,required: true, message: "Incident date is requried", maxLength: 20 })} />

  //         </fieldset>
  //         <fieldset>
  //           <label>
  //             <p>Location</p>
  //             <input  {...register("incident_location", { required: true, message: "Incident location is requried", maxLength: 6 })} />
  //           </label>
  //         </fieldset>
  //         <fieldset>
  //           <label>
  //             <p>Abstract</p>
  //             <input  placeholder="First Name"  {...register("abstract", { required: false, message: "Abstract is requried", maxLength: 512 })} />
  //           </label>
  //         </fieldset>
  //         <fieldset>
  //           <label>
  //             <p>url</p>
  //             <input  {...register("url", { required: true, maxLength: 256 })} />

  //           </label>
  //         </fieldset>
  //         <fieldset>
  //           <label>
  //             <p>Title</p>
  //             <input  {...register("title", { required: true, maxLength: 256 })} />
  //           </label>
  //         </fieldset>
  //         <input type="submit" />
  //       </form> */}

  //       <form onSubmit={handleSubmit(onSubmit, onError)}>
  //       <input name="firstName" ref={register("firstName", {required: true})} />
  //       <span> {errors.firstName && errors.firstName.message}</span>
  //       <input {...register("lastName")} />
  //       <button type="submit">Submit</button>
  //     </form>
  //     </div>

  //   )
  // };
  // form validation rules 
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required'),
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last name is required'),
    dob: Yup.string()
      .required('Date of Birth is required')
      .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Date of Birth must be a valid date in the format YYYY-MM-DD'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    acceptTerms: Yup.bool()
      .oneOf([true], 'Accept Ts & Cs is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(data) {
    // display form data on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    return false;
  }

  return (
    <div className="card m-3">
      <h5 className="card-header">React Hook Form 7 - Form Validation Example</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col">
              <label>Title</label>
              <select name="title" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`}>
                <option value=""></option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
                <option value="Ms">Ms</option>
              </select>
              <div className="invalid-feedback">{errors.title?.message}</div>
            </div>
            <div className="form-group col-5">
              <label>First Name</label>
              <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.firstName?.message}</div>
            </div>
            <div className="form-group col-5">
              <label>Last Name</label>
              <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.lastName?.message}</div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col">
              <label>Date of Birth</label>
              <input name="dob" type="date" {...register('dob')} className={`form-control ${errors.dob ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.dob?.message}</div>
            </div>
            <div className="form-group col">
              <label>Email</label>
              <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col">
              <label>Password</label>
              <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <div className="form-group col">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
            </div>
          </div>
          <div className="form-group form-check">
            <input name="acceptTerms" type="checkbox" {...register('acceptTerms')} id="acceptTerms" className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`} />
            <label htmlFor="acceptTerms" className="form-check-label">Accept Terms & Conditions</label>
            <div className="invalid-feedback">{errors.acceptTerms?.message}</div>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary mr-1">Register</button>
            <button type="button" onClick={() => reset()} className="btn btn-secondary">Reset</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AdminPage;