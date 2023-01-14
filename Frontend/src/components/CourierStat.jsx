import { useState } from "react";
import { axiosPublic } from "../api/axios";
import styled from "styled-components";

const STAT_URL = "drs/";

function CourierStat() {
  const [cnum, setCnum] = useState(null);
  const [stat, setStat] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axiosPublic.get(`${STAT_URL}${cnum}/`);
      console.log(response);
      setStat(response);
    } catch (err) {
      if (!err?.response) {
        console.log("No Server Response!");
        setStat("No Response From Server! :( Try again!");
      } else {
        console.log("Something went wrong!");
        setStat("Something Went Wrong!");
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
              onClick={e => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              🔍
            </Button>
          </Form>
        </StatForm>

        <Stat>{JSON.stringify(stat)}</Stat>
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
    height: 60%;
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

  @media (max-width: 425px) {
    height: 1.9rem;
  }
`;

const Stat = styled.section`
  height: 75%;
  width: 90%;
  background: #2f3136;
  color: white;

  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
