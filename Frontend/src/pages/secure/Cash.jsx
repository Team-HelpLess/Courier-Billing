// Imports
import { useEffect, useState } from "react";
import styled from "styled-components";
import Tiles from "../../components/dashboard components/Tiles";
import Popup from "../../components/Popup";
import Summary from "../../components/dashboard components/Summary";
import useAxiosPrivate from "../../hooks/usePrivateAxios";

const POST_URL = "";

// Cash functional component
function Cash() {
  // Custom hook
  const axiosPrivate = useAxiosPrivate();

  // triggers for Summary
  const [summaryTrigger, setSummaryTrigger] = useState(false);

  // Triggers for Popups
  const [trigger, setTrigger] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [notify, setNotify] = useState(false);

  // State for the Final Submitables
  const [submitables, setSubmitables] = useState({});

  // State for the cash input field values
  const [from, setFrom] = useState(" ");
  const [cn, setCn] = useState(NaN);
  const [phone, setPhone] = useState(undefined);
  const [nums, setNums] = useState(0);

  // State for the Tiles
  const [tiles, setTiles] = useState([]);

  // State for the Generate and Reset actions
  const [active, setActive] = useState(false);

  // Debugging and miscellaneous goes here
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const postToApi = async data => {
    try {
      const response = await axiosPrivate.post(POST_URL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
    } catch (err) {
      if (!err?.response) {
        console.log("NO SERVER RESPONSE");
      } else {
        console.log(err);
      }
    }
  };
  const handleSubmit = () => {
    if (Object.keys(submitables).length !== 0) {
      Object.keys(submitables).map(key => {
        const data = submitables[key];
        return postToApi(data);
      });
      setSummaryTrigger(false);
      handleReset();
    } else {
      setNotify(true);
      if (tiles.length === 0) {
        handleReset();
      }
    }
  };

  // Function to handle the Generate button for generating Tiles
  const handleGenerate = e => {
    e.preventDefault();

    setActive(true);
    const newTiles = [];
    for (let i = 0; i < nums; i++) {
      newTiles.push(
        <Tiles
          key={i}
          formId={i}
          cn={parseInt(cn) + i}
          from={from}
          phone={phone}
          shadow={
            cn.toString().length === 10
              ? "anjani"
              : cn.toString().length === 9
              ? "akash"
              : ""
          }
          setDeleteTrigger={setDeleteTrigger}
          setDeleteId={setDeleteId}
          submitables={submitables}
          setSubmitables={setSubmitables}
        />
      );
    }
    setTiles(newTiles);
  };

  // Function to handle the Reset button
  function handleReset() {
    setNums(0);
    setTiles([]);
    setActive(false);
    setSubmitables({});
    setTrigger(false);
  }

  // Function to delete a Tile from the cash component after generated
  const deleteTile = () => {
    setTiles(tiles.filter(tile => tile.key !== String(deleteId)));
    setSubmitables(prevSubmitables => {
      const { [deleteId]: deleted, ...rest } = prevSubmitables;
      return rest;
    });
    setDeleteTrigger(false);
  };

  // Actual Cash Component JSX
  return (
    <CashComponent>
      <Section className={active ? "active" : ""}>
        <Form onSubmit={handleGenerate} method="none">
          <Div>
            <InputPair>
              <Label>From</Label>
              <Input
                type="text"
                style={{ width: "16ch" }}
                onChange={e => setFrom(e.target.value)}
                required
              />
            </InputPair>
            <InputPair>
              <Label>C.Number</Label>
              <Input
                type="number"
                style={{ width: "12ch" }}
                onChange={e => setCn(e.target.value)}
                required
              />
            </InputPair>
            <InputPair>
              <Label>Ph.Number</Label>
              <Input
                type="number"
                style={{ width: "12ch" }}
                onChange={e => setPhone(e.target.value)}
              />
            </InputPair>
            <InputPair>
              <Label className="NumsCourierlbl">CouriersCount</Label>
              <Dec
                onClick={e => {
                  e.preventDefault();
                  setNums(prevNums => prevNums - 1);
                }}
              >
                -
              </Dec>
              <Input
                required
                className="NumsCourier"
                type="number"
                value={nums}
                style={{
                  width: "5ch",
                  textAlign: "center",
                  paddingRight: "5px",
                }}
                onChange={e => setNums(e.target.value)}
              />
              <Inc
                onClick={e => {
                  e.preventDefault();
                  setNums(prevNums => prevNums + 1);
                }}
              >
                +
              </Inc>
            </InputPair>
            <Button type="submit">GENERATE</Button>
          </Div>
        </Form>
      </Section>
      <Reset className={active ? "active" : ""}>
        <Button onClick={e => setTrigger(true)}>Reset</Button>
      </Reset>
      <CashWrapper>{tiles}</CashWrapper>
      <ButtonWrapper>
        <Button
          onClick={e => {
            setSummaryTrigger(true);
          }}
        >
          BOOK
        </Button>
      </ButtonWrapper>

      <Summary
        trigger={summaryTrigger}
        setTrigger={setSummaryTrigger}
        submitables={submitables}
        action={handleSubmit}
      />

      <Popup
        trigger={trigger}
        setTrigger={setTrigger}
        actionName="Reset"
        actionFunc={handleReset}
      />
      <Popup
        trigger={deleteTrigger}
        setTrigger={setDeleteTrigger}
        actionName="Delete"
        actionFunc={deleteTile}
      />
      <Popup
        trigger={notify}
        setTrigger={setNotify}
        actionName="Add BookList!"
      />
    </CashComponent>
  );
}
export default Cash;

//  Styling of the Cash Component
const CashComponent = styled.div`
  padding-top: 2.5rem;
  background: #2f3136;

  @media (max-width: 425px) {
    padding-top: 2rem;
  }
`;

const CashWrapper = styled.section`
  width: 100%;
  min-height: 75vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  & > * {
    margin-top: 3rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 425px) {
    min-height: 50vh;

    & > * {
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }
  }
`;

const Form = styled.form`
  height: inherit;
  width: inherit;
  display: flex;
  justify-content: space-around;
`;

const Section = styled.section`
  height: 10vh;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  &.active {
    display: none;
  }

  @media (max-width: 425px) {
    height: 30vh;
    width: auto;
    flex-direction: column;
    align-items: center;
    margin: auto;

    & > * {
      margin-right: 0;
    }
  }
`;

const Reset = styled.div`
  width: 100%;
  height: auto;
  display: none;
  align-items: center;
  justify-content: center;

  &.active {
    display: flex;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  font-size: 0.7rem;
  height: 2rem;
  width: 5rem;
  background: #ffffffc8;
  color: black;
  cursor: pointer;
  transition: 0.5s ease;
  border-radius: 10px;

  &:hover {
    background: white;
  }
`;

const Div = styled.div`
  height: inherit;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 425px) {
    width: 60%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`;

const InputPair = styled.div`
  display: flex;

  @media (max-width: 425px) {
    margin-bottom: 5px;
  }
`;
const Label = styled.label`
  color: white;
  padding-bottom: 5px;
  padding-right: 5px;
  border-bottom: 1px solid white;

  @media (max-width: 425px) {
    &.NumsCourierlbl {
      margin-bottom: 5px;
    }
  }
`;
const Input = styled.input`
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: none;
    -webkit-box-shadow: 0 0 0 30px black inset !important;
  }
  &:-webkit-autofill {
    -webkit-text-fill-color: #2f3136 !important;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  background: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  border-left: 1px solid white;
  color: #d8d9da;
  padding-bottom: 5px;
  padding-left: 5px;
  width: 5rem;

  @media (max-width: 425px) {
    width: 100%;
  }

  &.NumsCourier {
    border-left: 0;

    @media (max-width: 425px) {
      margin-bottom: 5px;
    }
  }
`;

const Dec = styled.button`
  width: 30px;
  background: transparent;
  outline: none;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  margin-left: 10px;

  @media (max-width: 425px) {
    margin-top: auto;
    margin-bottom: 5px;
    height: 32px;
    width: 32px;
  }
`;
const Inc = styled(Dec)`
  margin-left: 0;
`;
