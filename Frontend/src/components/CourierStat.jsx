import { useState } from "react";
import axiosPublic from "../api/axios";
import styled from "styled-components";

const STAT_URL = "";

function CourierStat() {
  const [cnum, setCnum] = useState(null);
  const [stat, setStat] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axiosPublic.post(`${STAT_URL}${cnum}/`);
      console.log(response);
      setStat(response);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response!");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  return (
    <CourierStatWrapper>
      <StatContainer>
        <StatForm>
          <Form>
            <Input
              type="number"
              onChange={e => setCnum(e.target.value)}
              required
            />
            <Button
              type="submit"
              onClick={() => {
                handleSubmit;
              }}
            >
              🔍
            </Button>
          </Form>
        </StatForm>

        <Stat>{stat}</Stat>
      </StatContainer>
    </CourierStatWrapper>
  );
}
export default CourierStat;

// Stylings
const CourierStatWrapper = styled.div`
  height: 90vh;
  width: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatContainer = styled.section`
  height: 70%;
  width: 70%;
  border: 1px solid #36393f;
  background: #36393f;
  padding: 15px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 425px) {
    width: 90%;
  }
`;

const StatForm = styled.div`
  height: 20%;
  width: 90%;
  background: #2f3136;
  padding: 15px;

  @media (max-width: 425px) {
    height: 10%;
  }
`;

const Form = styled.form`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  height: 100%;
  width: 90%;
  padding: 15px;
  color: white;

  outline: none;
  border: none;
  background: #202225;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: none;
    -webkit-box-shadow: 0 0 0 30px black inset !important;
  }
  &:-webkit-autofill {
    -webkit-text-fill-color: #202225 !important;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const Button = styled.button`
  height: 100%;
  width: 10%;
  cursor: pointer;
  background: #202225;
  border: none;
  outline: none;
`;

const Stat = styled.section`
  height: 75%;
  width: 90%;
  background: #2f3136;
`;
