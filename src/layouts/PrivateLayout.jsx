import Sidebar from 'components/Sidebar';
import { Outlet } from 'react-router';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { useAuth } from 'context/authContext';
import { REFRESCAR_TOKEN } from 'graphql/auth/mutations';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from 'components/PrivateRoute';

 const PrivateLayout = () => {
  const navigate = useNavigate();
  const { authToken, setToken } = useAuth();
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [refrescarToken, { data: dataMutation, loading: loadingMutation, error: errorMutation }] =
    useMutation(REFRESCAR_TOKEN);

  useEffect(() => {
    refrescarToken();
  }, [refrescarToken]);

   useEffect(() => {
    if (dataMutation) {
      if (dataMutation.refrescarToken.token) {
        setToken(dataMutation.refrescarToken.token);
      } else {
        setToken(null);
        navigate('/auth/login');
      }
      setLoadingAuth(false);
    }
  }, [dataMutation, setToken, loadingAuth, navigate]);

  if (loadingMutation || loadingAuth) return <div>Loading...</div>;

  return (
    <div className='flex flex-col md:flex-row flex-no-wrap h-screen'>
      <Sidebar />
      <div className='flex w-full h-full'>
        <div className='w-full h-full  overflow-y-scroll'>
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}; 

export default PrivateLayout; 
