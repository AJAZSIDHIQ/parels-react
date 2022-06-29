import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { SocialLogin } from 'components/common';
import { CustomInput } from 'components/formik';
import { FORGOT_PASSWORD, SIGNUP , HOME } from 'constants/routes';
import { Field, Form, Formik } from 'formik';
import { useDocumentTitle, useScrollTop } from 'hooks';
import PropType from 'prop-types';
import React, { useEffect , useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signIn , validateMobile} from 'redux/actions/authActions';
import { setAuthenticating, setAuthStatus } from 'redux/actions/miscActions';
import * as Yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/



const OTPSchema = Yup.object().shape({
  otp_value: Yup.string()
    .required()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, 'Must be exactly 5 digits')
    .max(5, 'Must be exactly 5 digits')
});

const SignIn = ({ history }) => {
  const { authStatus, isAuthenticating } = useSelector((state) => ({
    authStatus: state.app.authStatus,
    isAuthenticating: state.app.isAuthenticating
  }));

  // const [phoneNumber, setPhoneNumber] = useState(null);
  const [otpInitiated, setOtpInitiated] = useState(false);

  const SignInSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(phoneRegExp , 'phone Number is not valid.')
      .required('phone Number is required.') ,
    otp_value: Yup.string()
      .when("phoneNumber", (phoneNumber) => {
        if(otpInitiated)
          return Yup.string().required()
                  .matches(/^[0-9]+$/, "Must be only digits")
                  .min(5, 'Must be exactly 5 digits')
                  .max(5, 'Must be exactly 5 digits')
        else {
           return Yup.string()
        }
      })
  });


  const dispatch = useDispatch();

  useScrollTop();
  useDocumentTitle('Sign In | Salinaka');

  useEffect(() => () => {
    dispatch(setAuthStatus(null));
    dispatch(setAuthenticating(false));
  }, []);

  useEffect(() => {
    if(authStatus && authStatus.success){
      history.push(HOME);
    }
    return () => {
      //console.log(authStatus)
    }
  }, [authStatus])


  const onSignUp = () => history.push(SIGNUP);


  const onSubmitForm = (form) => {
    
    // setPhoneNumber(form.phoneNumber)
    if(otpInitiated == false){
      dispatch(signIn(form.phoneNumber));
      setOtpInitiated(true)
    }
    else{
      dispatch(validateMobile(form.phoneNumber , form.otp_value));
    }
  };

  // const validateMobileFromSubmit = (form) => {
  //   dispatch(validateMobile(phoneNumber , form.otp_value));
  // }

  const onClickLink = (e) => {
    if (isAuthenticating) e.preventDefault();
  };

  return (
    <div className="auth-content">
      {authStatus?.success && (
        <div className="loader">
          <h3 className="toast-success auth-success">
            {authStatus.message}
            <LoadingOutlined />
          </h3>
        </div>
      )}
      {!authStatus?.success && (
        <>
          {authStatus?.message && (
            <h5 className="text-center toast-error">
              {authStatus?.message}
            </h5>
          )}
          <div className={`auth ${authStatus?.message && (!authStatus?.success && 'input-error')}`}>
            <div className="auth-main">
              <h3>Sign in to Salinaka</h3>
              <br />
              <div className="auth-wrapper">
                <Formik
                  initialValues={{
                    phoneNumber: '',
                    otp_value :''
                  }}
                  validateOnChange
                  validationSchema={SignInSchema}
                  onSubmit={onSubmitForm}
                >
                  {() => (
                    <Form>
                      <div className="auth-field">
                        <Field
                          disabled={otpInitiated}
                          name="phoneNumber"
                          type="number"
                          label="phone number"
                          placeholder="phone number"
                          component={CustomInput}
                        />
                      </div>
                      {otpInitiated &&
                      <div className="auth-field">
                        <Field
                          disabled={isAuthenticating}
                          name="otp_value"
                          type="number"
                          label="OTP"
                          placeholder="OTP"
                          component={CustomInput}
                        />
                      </div>}
                      <br />
                      <div className="auth-field auth-action">
                        <Link
                          onClick={onClickLink}
                          style={{ textDecoration: 'underline' }}
                          to={FORGOT_PASSWORD}
                        >
                          <span>Forgot password?</span>
                        </Link>
                        <button
                          className="button auth-button"
                          disabled={isAuthenticating}
                          type="submit"
                        >
                          {isAuthenticating ? 'Signing In' : 'Sign In'}
                          &nbsp;
                          {isAuthenticating ? <LoadingOutlined /> : <ArrowRightOutlined />}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik> 
                {/* <Formik
                  initialValues={{
                    otp_value: ''
                  }}
                  validateOnChange
                  validationSchema={OTPSchema}
                  onSubmit={validateMobileFromSubmit}
                >
                  {() => (
                    <Form>
                      <div className="auth-field">
                        <Field
                          // disabled={isAuthenticating}
                          name="otp_value"
                          type="number"
                          label="OTP"
                          placeholder="OTP"
                          component={CustomInput}
                        />
                      </div>
                      <br />
                      <div className="auth-field auth-action">
                        <Link
                          onClick={onClickLink}
                          style={{ textDecoration: 'underline' }}
                          to={FORGOT_PASSWORD}
                        >
                          <span>Forgot password?</span>
                        </Link>
                        <button
                          className="button auth-button"
                          // disabled={isAuthenticating}
                          type="submit"
                        >
                          {isAuthenticating ? 'Signing In' : 'Sign In'}
                          &nbsp;
                          {isAuthenticating ? <LoadingOutlined /> : <ArrowRightOutlined />}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik> */}
              </div>
            </div>
            <div className="auth-divider">
              <h6>OR</h6>
            </div>
            <SocialLogin isLoading={isAuthenticating} />
          </div>
          <div className="auth-message">
            <span className="auth-info">
              <strong>Don&apos;t have an account?</strong>
            </span>
            <button
              className="button button-small button-border button-border-gray button-icon"
              disabled={isAuthenticating}
              onClick={onSignUp}
              type="button"
            >
              Sign Up
            </button>
          </div>
        </>
      )}
    </div>
  );
};

SignIn.propTypes = {
  history: PropType.shape({
    push: PropType.func
  }).isRequired
};

export default SignIn;
