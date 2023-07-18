import React from 'react';
import PropTypes from 'prop-types';
import './RegistrationSuccess.css';

const RegistrationSuccess = () => (
  <div className="RegistrationSuccess" style={{margin:'0 auto', width:'80%', color:'#2e7d32', justifyContent:'center'}}>
    <h3>
        Restaurant Registration process is successful. Please check your email to activate the account. 
        &nbsp;<a href={`/login`} alt="Login">Click here to Login</a>
    </h3>  
  </div>
);

RegistrationSuccess.propTypes = {};

RegistrationSuccess.defaultProps = {};

export default RegistrationSuccess;
