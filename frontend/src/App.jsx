import { useState } from "react";
import Login from "./Login";

function App() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handleRegister() {
    const user = {
      userName,
      email,
      password,
    };

    const userString = JSON.stringify(user);

    fetch("http://localhost:7002/users", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: userString,
    }).then((res) => console.log(res, userString));
  }

  return (
    <div>
      <div>
        <h2>Register</h2>
        <label htmlFor=""> Username: </label>
        <input
          value={userName}
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="">Email: </label>
        <input
          value={email}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor=""> Password: </label>
        <input
          value={password}
          type="text"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
      </div>
      <Login />
    </div>
  );
}

export default App;
