'use client';
import { Bounce, ToastContainer } from 'react-toastify';

const ToastNotifier = () => {
  return (
    <ToastContainer
      position='top-right'
      autoClose={5000}
      transition={Bounce}
      theme='colored'
    />
  );
};

export default ToastNotifier;
