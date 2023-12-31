import React, { useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, FieldProps, ErrorMessage, useFormikContext } from 'formik';
import { Typography, Button, TextField, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import * as Yup from 'yup';
import { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const validationSchema = Yup.object({
  email: Yup.string().required('We need your email address').email('Something is strange about that email address'),
  password: Yup.string().required('Password is required'),
});

const FormContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  width: 300px;
  margin: auto;
`;

const ErrorText = styled.div`
  color: red;
  margin: 5px 0;
`;


const dummyUsers = [
  "brownbear1981@example.com",
  "salmonslayer@example.com",
  "glacierguider@example.com",
  "rainforestrover@example.com",
  "totemcarver@example.com",
  "midnightsunseeker@example.com",
  "whalewatcher@example.com",
  "iceberginnovator@example.com",
  "fjordfollower@example.com",
  "ravenreveler@example.com",
  "pinetreepioneer@example.com",
  "moosemarauder@example.com",
  "tundratraveler@example.com",
  "sitkasprucesavant@example.com",
  "eagleeyeed@example.com",
  "northernlightslover@example.com",
  "ketchikanclimber@example.com",
  "mendenhallmystic@example.com",
  "halibuthero@example.com",
  "bearberrybuddy@example.com",
];



const LoginForm: React.FC = () => {
  const { setToken, setUser } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  // Ref to keep track of whether the component is mounted
  const isMounted = useRef(true);

  // Set the mounted ref to false when the component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const Dropdown: React.FC = () => {
    const { setFieldValue } = useFormikContext();

    const handleDropdownChange = (event: SelectChangeEvent) => {
      const selectedEmail = event.target.value as string;
      if (selectedEmail) {
        setFieldValue("email", selectedEmail);
        setFieldValue("password", "BigBlueBus");
      }
    };




    return (
      <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px' }}>
        <InputLabel id="select-user-label">Select a user for testing purposes</InputLabel>
        <Select
          labelId="select-user-label"
          onChange={handleDropdownChange}
          defaultValue=""
        >
          <MenuItem value="" disabled>
            Select a user
          </MenuItem>
          {dummyUsers.map(email => (
            <MenuItem key={email} value={email}>
              {email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };


  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
          const loginResponse = await axios.post(`${API_URL}/api/users/login`, values);

          // Check if the component is still mounted before updating the state
          if (isMounted.current) {
            if (loginResponse.status === 200 && loginResponse.data.token) {
              const token = loginResponse.data.token;
              localStorage.setItem('userToken', token);
              setToken(token);

              const config = { headers: { Authorization: `Bearer ${token}` } };
              const userResponse = await axios.get(`${API_URL}/api/users/me`, config);

              setUser(userResponse.data);  // Set user data in context

              const userId = userResponse.data._id;
              if (userId) {
                localStorage.setItem('userId', userId);
              }
            } else {
              setErrors({ email: ' ', password: loginResponse.data.message || 'Invalid credentials' });
            }
          }
        } catch (error) {
          // Check if the component is still mounted before setting errors
          if (isMounted.current) {
            setErrors({ email: ' ', password: 'Invalid credentials or server error' });
          }
        } finally {
          // Check if the component is still mounted before setting submitting to false
          if (isMounted.current) {
            setSubmitting(false);
          }
        }
      }}

    >
      {({ isSubmitting }) => (
        <FormContainer>
          <Form>
            <Typography variant="h5" gutterBottom>Login</Typography>

            <Dropdown />

            <Field name="email">
              {({ field, form }: FieldProps) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  helperText={form.touched.email && typeof form.errors.email === 'string' ? form.errors.email : undefined}
                  error={form.touched.email && Boolean(form.errors.email)}
                />
              )}
            </Field>
            <ErrorMessage name="email" component={ErrorText} />

            <Field name="password">
              {({ field, form }: FieldProps) => (
                <TextField
                  {...field}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  helperText={form.touched.password && typeof form.errors.password === 'string' ? form.errors.password : undefined}
                  error={form.touched.password && Boolean(form.errors.password)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handlePasswordVisibility}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            </Field>
            <ErrorMessage name="password" component={ErrorText} />

            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>Login</Button>
          </Form>
        </FormContainer>
      )}
    </Formik>
  );

};

export default LoginForm;