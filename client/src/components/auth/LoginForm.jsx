import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const { login } = useAuth();

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values.email, values.password);
    } catch (err) {
      setErrors({ email: 'Invalid credentials', password: 'Invalid credentials' });
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
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;