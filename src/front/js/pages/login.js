import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

export const Login = () => {
  const { store, actions } = useContext(Context);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameNew, setNameNew] = useState("");
  const [emailNew, setEmailNew] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const token = localStorage.getItem("token");
  const history = useNavigate();

  // Login
  const handleClick = () => {
    actions.login(email, password);
  };

  //  Create User
  const createUser = () => {
    actions.createUser(nameNew, emailNew, passwordNew);
  };


  // Si handleCkick devuelve el token se ejecuta el redericcionamiento

  useEffect(() => {
    if (store.token && store.token != "" && store.token != undefined)
      history(`/${store.name}`);
  }, [store.token])



  return (


    <>


      <div className="login-form-container">

        <div className="row row-form text-center">
          <div className="col-md-12 col-lg-6">
            <h1> Login </h1>
            <div className="login-form">
              <div className="col-12">
                <input
                  type="text"
                  placeholder="email or user name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-12">
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>
              <div className="col-12">
                <button onClick={handleClick}> Login </button>

              </div>



            </div>
          </div>

          <div className="col-md-12 col-lg-6">

            <h1> Create </h1>
            <div className="create-form">
              <div className="col-12">
                <input
                  type="text"
                  placeholder="name"
                  value={nameNew}
                  onChange={(e) => setNameNew(e.target.value)}
                />

              </div>
              <div className="col-12">
                <input
                  type="text"
                  placeholder="email"
                  value={emailNew}
                  onChange={(e) => setEmailNew(e.target.value)}
                />

              </div>
              <div className="col-12">
                <input
                  type="password"
                  placeholder="password"
                  value={passwordNew}
                  onChange={(e) => setPasswordNew(e.target.value)}
                />

              </div>
              <div className="col-12">
                <button onClick={createUser}> Create </button>
              </div>




            </div>
          </div>

        </div>
      </div>



    </>

  );
};