import React from 'react';
import { Providers } from './components/common/Providers';
import { Router } from './components/common/Router';

const App = () => {
  return (
    <Providers>
      <Router />
    </Providers>
  );
};

export default App;
