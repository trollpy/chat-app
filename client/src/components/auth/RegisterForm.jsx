import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm = () => {
  const { register } = useAuth();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, 'Username must be at least 2 characters')
      .max(20, 'Username must be 20 characters or less')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await register(values.username, values.email, values.password);
    } catch (err) {
      setErrors({ email: 'Registration failed', username: 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;