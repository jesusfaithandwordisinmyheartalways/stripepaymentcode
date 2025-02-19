


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import StripePayment from './Components/StripePayment/StripePayment.jsx';
import Completion from './Components/Completion/Completion.jsx'


function App() {

  return (
  <>

<main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StripePayment />} />
          <Route path="/completion" element={<Completion />} />
        </Routes>
      </BrowserRouter>
    </main>



  </>
  );
}

export default App;
