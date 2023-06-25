import { useState } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import Messages from './Messages';

function App() {
  const [username, setUsername] = useState('');

  return (
    <>
      <Navbar color="light" light>
        <NavbarBrand href="/">Real-time messaging</NavbarBrand>
      </Navbar>
      <div className="container-fluid">
        <Messages username={username} onUsernameSet={setUsername} />
      </div>
    </>
  );
}

export default App;
