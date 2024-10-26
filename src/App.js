
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebaseConfig';
import Navbar from './components/NavBar';
import WelcomePage from './components/WelcomePage';


// import EditImage from './components/EditImage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => console.log("User signed out"))
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <Router>
      <Navbar user={user} handleSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
       
      

        {/* <Route path="/edit-image" element={<EditImage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
