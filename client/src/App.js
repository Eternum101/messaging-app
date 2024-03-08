import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from './pages/Login';
import Main from './pages/Main';
import Profile from './pages/Profile';

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
  return (
  <Router>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/home' element={<Main/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
    </Routes>
  </Router>
  );
}

export default App;
