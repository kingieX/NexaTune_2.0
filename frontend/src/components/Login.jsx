import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BackgroundImage from './BackgroundImage';
import Header from './Header';


const Login = () => {
  const [loginError, setLoginError] = useState(null);
    const navigate = useNavigate();

    const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
      }),
      onSubmit: async (values) => {
        try {
          // Call the backend API for user login
          const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            credentials: 'include',
          });
  
          if (response.ok) {
            // Parse the response JSON to get the bearer token
            const { token } = await response.json();
  
            // Store the token in localStorage (you may want to use a more secure storage method like "httponly cookie")
            localStorage.setItem('token', token);
  
            // Redirect to the preference page
            navigate('/preferences'); 
          } else {
            // Handle login failure, e.g., display error message
            setLoginError('Invalid email or password');
          }
        } catch (error) {
          console.error('Error during user login:', error);
          setLoginError('An error occurred during login');
        }
      },
    });

  return (
    <div>
        <BackgroundImage />
        <div className="content">
          <Header showLogin = {true} />
          <div className="flex flex-col justify-center mb-10 items-center">
            <div className="box mt-10 flex flex-col justify-center items-center rounded-md">
              <h1 className="text-white text-center mb-2 text-2xl lg:text-4xl font-semibold">Welcome Back!</h1>
              <p className="text-white text-sm lg:text-xl mb-6">Login to continue</p>
              <div>
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-600 mb-1">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder='Enter your email'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className="input py-2 px-2 text-sm lg:text-xl rounded-md"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-600">{formik.errors.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-600 mb-1">
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder='Enter your password'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className="input w-full py-2 px-2 text-sm lg:text-xl rounded-md"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-red-600">{formik.errors.password}</div>
                    )}
                  </div>

                  {loginError && <div className="text-red-600 mb-4">{loginError}</div>}

                  <button type="submit" className="bg-blue-600 mb-2 font-semibold text-white w-full  hover:bg-blue-400 py-2 px-1 rounded-md">
                    Log In
                  </button>
                </form>

                <div className="text-center mb-2">
                  <p className="text-white text-sm">Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign Up</Link></p>
                </div>
              </div>

            </div>
          </div>
        </div>
    </div>
  );
};

export default Login;
