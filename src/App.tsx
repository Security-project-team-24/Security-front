import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { CertificatePage } from './pages/CertificatePage';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Flex
    w='100%'
    h='100%'
    minH='100vh'
    direction='column'
    >
      <Outlet/>
    </Flex>
  );
}

export default App;
