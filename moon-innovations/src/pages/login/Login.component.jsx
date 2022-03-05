import React from "react";
import Sidebar from "../../components/sidebar/Sidebar.component";
import Main from "../../components/main/Main.component";
import LoginForm from "../../components/loginForm/LoginForm.component";

const Login = ({ logAcc }) => {
  return (
    <div className="container">
      <div className="row">
        <Sidebar />
        <Main>
          <LoginForm logAcc={logAcc} />
        </Main>
      </div>
    </div>
  );
};

export default Login;
