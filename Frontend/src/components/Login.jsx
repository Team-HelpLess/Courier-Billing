// Imports
import { useState, useEffect, useRef } from "react";
import { login } from "../store/store";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import axios from "../api/axios";

// Login api URL
const LOGIN_URL = "token/obtain/";

// Action Login component
function Login() {
  // aT for checking whether user is logged in or not!
  const aT = useSelector(state => state?.user?.userAccessToken);

  // useRef
  const inputRef = useRef(null);

  // states for the UserName and PassWord
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // state for the response message
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // const for react-router-dom hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // To reset message
  useEffect(() => {
    setMsg("");
  }, [username, password]);

  // UseEffect to navigate user to dashboard if logged in!
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    inputRef.current.focus();
    if (aT) {
      navigate("/dashboard");
    }
  }, []);
  // Setting the history
  const from = location.state?.from?.pathname || "/dashboard";

  // Functino to handle submit of the login form
  const LoginHandler = async e => {
    e.preventDefault();
    setLoading(true);
    let res = "";

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(
        login({
          username: username,
          accessToken: response?.data?.access,
        })
      );
      res = "Login Successful!";
      if (from !== "") {
        navigate(from, { replace: true });
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (!err?.response) {
        res = "NO SERVER RESPONSE!";
      } else if (err.response?.status === 401) {
        res = "PROVIDE VALID CREDENTIALS!";
      } else {
        res = "SOMETHING WENT WRONG!";
      }
    } finally {
      setLoading(false);
      setMsg(res);
    }
  };

  // Actual JSX elements for the login component
  return (
    <Section id="login">
      <LoginWrapper>
        <LoginForm>
          <Message> {msg} </Message>
          <Loading className={loading ? "active rotate" : ""}>⚙️</Loading>
          <h1
            style={{
              fontSize: "2rem",
              textAlign: "center",
              marginBottom: "1rem",
              color: "white",
              letterSpacing: "2px",
            }}
          >
            LOGIN
          </h1>
          <Form onSubmit={LoginHandler}>
            <InputPair>
              <Label htmlFor="name">Username</Label>
              <Input
                ref={inputRef}
                type="text"
                name="name"
                autoComplete="off"
                onChange={e => setUsername(e.target.value)}
                required
              />
            </InputPair>
            <InputPair>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                onChange={e => setPassword(e.target.value)}
                required
              />
            </InputPair>
            <Button>Login</Button>
          </Form>
        </LoginForm>
      </LoginWrapper>
    </Section>
  );
}

export default Login;

// Styling using styled components...
const Message = styled.div`
  font-size: 0.75rem;
  height: 5vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 0.25rem;
`;

const Loading = styled.span`
  position: absolute;
  font-size: 1.5rem;
  margin-top: -2.25rem;
  margin-left: 15.65rem;
  display: none;

  @media (max-width: 425px) {
    margin-left: 8.9rem;
  }

  &.active {
    display: block;
  }

  &.rotate {
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const Section = styled.section`
  height: 50vh;
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 425px) {
    height: 50vh;
    width: 100%;
  }
`;

const LoginWrapper = styled.section`
  height: 50vh;
  width: 80%;
  position: relative;
  background: #36393f;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 10px;
  border: 1px solid #36393f;

  @media (max-width: 425px) {
    width: 80%;
    height: 50vh;
  }
`;
const LoginForm = styled.section`
  height: inherit;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputPair = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  width: 50%;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 425px) {
    margin-botton: 1rem;
  }
`;
const Label = styled.label`
  color: white;
  padding-bottom: 10px;
`;
const Input = styled.input`
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: none;
    -webkit-box-shadow: 0 0 0 30px #2f3136 inset !important;
  }
  &:-webkit-autofill {
    -webkit-text-fill-color: #101010d1 !important;
  }

  background: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  color: white;
  padding-bottom: 5px;
`;
const Button = styled.button`
  margin-top: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  text-transform: uppercase;
  font-weight: bolder;
  letter-spacing: 1px;
  width: auto;
  height: 2rem;
  width: 5rem;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.5rem;
  transition: 0.5s;
  background: #101010d1;
  cursor: pointer;

  &:hover {
    color: black;
    background: white;
  }
`;
