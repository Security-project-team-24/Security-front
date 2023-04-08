import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { CertificatePage } from './pages/CertificatePage';

function App() {
  return (
    <ChakraProvider>
      <CertificatePage></CertificatePage>
    </ChakraProvider>
  );
}

export default App;
