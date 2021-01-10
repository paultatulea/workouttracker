import React, { useState } from 'react';
import useFormValidation from '../useFormValidation';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const INITIAL_STATE = {email: "", password: "", confirmPassword: ''};

function validateSignUp(values) {
    let errors = {};

    // Email errors
    if (!values.email) {
        errors.email = "Email address required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
    }
    // Password errors
    if (!values.password) {
        errors.password = "Password required";
    } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }
    // Confirm password errors
    if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
}

export default function Signup() {
    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit
    } = useFormValidation(INITIAL_STATE, validateSignUp, registerUser)
    const [serverError, setServerError] = useState('');
    const { signupUser } = useAuth();

    function registerUser() {
        const {email, password} = values;
        try {
            signupUser(email, password);
        } catch(err) {
            setServerError('Could not create account')
        }
    }

    return (
        <>
            <h2>Create your account</h2>
            <form onSubmit={handleSubmit}>
                {serverError && <div className='alert alert-danger'>{serverError}</div>}
                <div className="form-group">
                    <label>Email Address</label>
                    <input className={`form-control${errors.email ? ' is-invalid' : ''}`} 
                        name="email" 
                        placeholder="Email" 
                        onChange={handleChange}
                        value={values.email}/>
                    {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input className={`form-control${errors.password ? ' is-invalid' : ''}`} 
                        name="password" 
                        type="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        value={values.password}/>
                    {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input className={`form-control${errors.confirmPassword ? ' is-invalid' : ''}`} 
                        name="confirmPassword" 
                        type="password" 
                        placeholder="Confirm Password" 
                        onChange={handleChange} 
                        value={values.confirmPassword}/>
                    {errors.confirmPassword && <div className='invalid-feedback'>{errors.confirmPassword}</div>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Create Account</button>
            </form>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to='/login'>Log In</Link>
            </div>
        </>
    )
}