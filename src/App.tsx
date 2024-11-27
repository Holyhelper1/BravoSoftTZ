import React, { useState } from 'react';
import './App.css';
import { LoginPage } from './Components/LoginPage/Login-page';
import { DocumentTable } from './Components/MainPage/DocumentsTable/DocumentsTable';
import { RequestForm } from './Components/MainPage/RequestForm/RequestForm';
import { Header } from './Components/Header/Header';

interface User {
  name: string;
  login: string;
  password: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleRequestSubmit = () => {
    console.log("Запрос отправлен!");
  };

  return (
      <div className="App">
        <div>
          {!user ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <>
              <Header username={user.name} onLogout={() => setUser(null)} />
              <RequestForm onSubmit={handleRequestSubmit} />
              <DocumentTable />
            </>
          )}
        </div>
        <div className='logo-container'>

        <div className='App-logo'>
          <img src='https://img.hhcdn.ru/employer-logo/4228529.png' alt='logo' />
        </div>
        </div>
      </div>
  );
}

export default App;


