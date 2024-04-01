import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BackgroundImage from './BackgroundImage';
import Header from './Header';


const Register = () => {
    const navigate = useNavigate();

    const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
      }),
      onSubmit: async (values) => {
        try {
          // Call the backend API for user registration
          const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
  
          if (response.ok) {
            // Handle successful registration, e.g., redirect to login page
            console.log('User registered successfully');
            navigate('/preferences');
          } else {
            // Handle registration failure, e.g., display error message
            console.error('User registration failed');
          }
        } catch (error) {
          console.error('Error during user registration:', error);
        }
      },
    });

  return (
    <div>
        <BackgroundImage />
        <div className="content">
          <Header showLogin = {true} />
          <div className="flex flex-col justify-center mb-10 items-center">
            <div className="box bg-black flex flex-col mt-10 justify-center items-center rounded-md">
              <h1 className="text-white text-center mb-5 text-2xl lg:text-4xl font-semibold">Let`s get you started <br /> with an account</h1>

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
                      className="input w-full py-2 px-2 text-sm lg:text-xl rounded-md"
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

                  <button type="submit" className="bg-blue-600 mb-2 font-semibold text-white w-full  hover:bg-blue-400 py-2 px-1 rounded-md">
                    Sign Up
                  </button>
                </form>

                <div className="text-center mb-2">
                  <p className="text-white text-sm">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link></p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
    </div>
  );
};

export default Register;
