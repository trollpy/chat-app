import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const initialValues = {
    username: user?.username || '',
    email: user?.email || '',
    status: user?.status || 'online'
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, 'Username must be at least 2 characters')
      .max(20, 'Username must be 20 characters or less')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    status: Yup.string()
      .oneOf(['online', 'offline', 'away', 'busy'], 'Invalid status')
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await updateProfile({ ...values, avatar });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="flex flex-col items-center">
              <Avatar src={avatar} size="xl" className="mb-4" />
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Change Avatar
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <div className="md:w-2/3">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="away">Away</option>
                      <option value="busy">Busy</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;