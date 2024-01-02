import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from './pages/Login';
import Main from './pages/Main';

function App() {
  return (
  <Router>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/home' element={<Main/>}></Route>
    </Routes>
  </Router>
  );
}

export default App;
