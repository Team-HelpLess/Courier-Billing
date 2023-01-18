import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/usePrivateAxios";
import PartyPages from "./PartyPages";
import styled from "styled-components";
import Popup from "../Popup";
import Summary from "./Summary";

const POST_URL = "";

function PartyBook(props) {
  const {} = props; //Destructuring props

  const [submitables, setSubmitables] = useState({});
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [summaryTrigger, setSummaryTrigger] = useState(false);
  const [notify, setNotify] = useState(false);
  const [status, setStatus] = useState(0);

  const [detail, setDetail] = useState(false);
  const [partyTiles, setPartyTiles] = useState([]);
  const [cnum, setCnum] = useState();
  const [nums, setNums] = useState(0);

  const [active, setActive] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const partyName = location?.state?.partyName;

  const handlePages = e => {
    e.preventDefault();
    setActive(true);

    const newTiles = [];
    for (let i = 0; i < nums; i++) {
      newTiles.push(
        <PartyPages
          key={i}
          formNum={i}
          courier_number={parseInt(cnum) + i}
          partyName={partyName}
          cweight={50}
          camount={40}
          submitables={submitables}
          setSubmitables={setSubmitables}
          setDeleteId={setDeleteId}
          setDeleteTrigger={setDeleteTrigger}
        />
      );
    }

    setPartyTiles(newTiles);
  };

  const handleReset = () => {
    setPartyTiles([]);
    setResetTrigger(false);
    setActive(false);
  };

  const deletePage = () => {
    setPartyTiles(partyTiles.filter(tile => tile.key !== String(deleteId)));
    setSubmitables(prevSubmitables => {
      const { [deleteId]: deleted, ...rest } = prevSubmitables;
      return rest;
    });
    setDeleteTrigger(false);
  };

  const axiosPrivate = useAxiosPrivate();
  const postToApi = async data => {
    try {
      const response = await axiosPrivate.post(POST_URL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      setStatus(response?.status);
    } catch (err) {
      if (!err?.response) {
        console.log("NO SERVER RESPONSE");
        setStatus(err?.response?.status);
      } else {
        console.log(err);
        setStatus(err?.response?.status);
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
      if (partyTiles.length === 0) {
        handleReset();
      }
    }
  };

  const BACK = "< Back";
  return (
    <PartyWrapper>
      <MobileButtons>
        <Button
          className="mobile-btn"
          onClick={e => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          {BACK}
        </Button>
        <Button
          className="mobile-detail-btn"
          onClick={e => {
            e.preventDefault();
            setDetail(!detail);
          }}
        >
          Details
        </Button>
      </MobileButtons>
      <PartyPage>
        <PartyInfo className={detail ? "active" : ""}>
          <Button
            className="desktop-btn"
            onClick={e => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            {BACK}
          </Button>
          <FrequentParties>
            <Head>{partyName}</Head>
          </FrequentParties>
          <PreviousBooks></PreviousBooks>
        </PartyInfo>

        <BookParty>
          <Form
            onSubmit={handlePages}
            method="none"
            className={active ? "active" : ""}
          >
            <Input
              className="courier_number"
              type="number"
              onChange={e => setCnum(e.target.value)}
              required
            />
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

            <Button className="go-btn" type="submit">
              GO
            </Button>
          </Form>
          <Reset className={active ? "active" : ""}>
            <Button className="reset-btn" onClick={e => setResetTrigger(true)}>
              Reset
            </Button>
          </Reset>
          <Pages>{partyTiles}</Pages>
          <BookButton
            className={active ? "active" : ""}
            onClick={e => {
              e.preventDefault();
              setSummaryTrigger(true);
            }}
          >
            BOOK
          </BookButton>

          <Popup
            trigger={deleteTrigger}
            setTrigger={setDeleteTrigger}
            actionName="Confirm Delete?"
            actionFunc={deletePage}
          />
        </BookParty>
      </PartyPage>

      <Popup
        trigger={resetTrigger}
        setTrigger={setResetTrigger}
        actionName="Confirm Reset?"
        actionFunc={handleReset}
      />

      <Popup
        trigger={notify}
        setTrigger={setNotify}
        actionName="Add BookList!"
      />

      <Summary
        trigger={summaryTrigger}
        setTrigger={setSummaryTrigger}
        submitables={submitables}
        action={handleSubmit}
      />
    </PartyWrapper>
  );
}
export default PartyBook;

const PartyWrapper = styled.div`
  min-height: 90vh;
  width: 100%;
  background: #2f3136;
  padding: 1rem;
`;

const MobileButtons = styled.div`
  height: 5vh;
  width: 100%;
  display: none;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 425px) {
    display: flex;
  }
`;

const PartyPage = styled.div`
  height: inherit;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 425px) {
    justify-content: space-around;
  }
`;

const PartyInfo = styled.section`
  height: 85vh;
  width: 49%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 425px) {
    z-index: 1;
    justify-content: space-around;
    width: 95%;
    position: fixed;
    top: 16.5vh;
    left: -100%;
    transition: 0.5s ease;
    background: #2f3136;

    &.active {
      left: 0.65rem;
    }
  }
`;
const Button = styled.button`
  height: 2rem;
  width: 5rem;
  padding: 5px;
  border: none;
  outline: none;
  border-radius: 10px;
  text-transform: uppercase;
  color: #ffffff86;
  letter-spacing: 1px;
  background: #202225;
  margin-bottom: 0.25rem;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    color: white;
  }

  @media (max-width: 425px) {
    &.desktop-btn {
      display: none;
    }

    &.mobile-btn {
      margin-bottom: 1rem;
    }

    &.mobile-detail-btn {
      margin-bottom: 1rem;
    }
  }

  &.go-btn {
    background: #ffffff86;
    color: #202225;
    width: 2.5rem;
    height: 2rem;
    margin-left: 1rem;

    &:hover {
      color: white;
    }
  }

  &.reset-btn {
    background: #ffffff86;
    color: #202225;
    width: 5rem;
    height: 2rem;
    margin-left: 1rem;

    &:hover {
      color: white;
    }

    @media (max-width: 425px) {
      margin-left: 0;
    }
  }
`;
const FrequentParties = styled.div`
  height: 38vh;
  width: 100%;
  background: #202225;
  overflow-y: auto;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: black;
  }
  &::-webkit-scrollbar-thumb {
    background: #2f3136;
  }
`;
const Head = styled.p`
  height: 2rem;
  width: inherit;
  color: whitesmoke;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: #2f3136;
  padding: 0px 5px;
  display: flex;
  align-items: center;
`;
const PreviousBooks = styled.div`
  height: 38vh;
  width: 100%;
  background: #202225;
  overflow-y: auto;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: black;
  }
  &::-webkit-scrollbar-thumb {
    background: #2f3136;
  }
`;

const BookParty = styled.section`
  height: 85vh;
  width: 49%;
  background: #202225;
  padding: 10px;

  @media (max-width: 425px) {
    width: 100%;
    height: 77.5vh;
  }
`;

const Pages = styled.div`
  height: 66vh;
  width: 100%;
  overflow-y: auto;
  padding: 0 10px;

  display: flex;
  flex-direction: column;
  gap: 15px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: black;
  }
  &::-webkit-scrollbar-thumb {
    background: #2f3136;
  }

  @media (max-width: 425px) {
    max-height: 80%;
  }
`;

const Form = styled.form`
  height: 10%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    display: none;
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
  color: #d8d9da;
  padding-bottom: 5px;
  padding-left: 5px;
  width: 5rem;

  &.courier_number {
    width: 5rem;
    height: 2rem;
    padding: 5px 0px;
    margin-bottom: 10px;

    @media (max-width: 425px) {
      margin-bottom: 10px;
    }
  }
`;

const Dec = styled.button`
  height: 22px;
  width: 30px;
  background: transparent;
  outline: none;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  margin-left: 10px;

  @media (max-width: 425px) {
    margin-bottom: 3px;
    height: 25px;
    width: 32px;
  }
`;
const Inc = styled(Dec)`
  margin-left: 0;
`;

const Reset = styled.div`
  height: 10%;
  width: 100%;
  display: none;
  align-items: center;
  justify-content: center;

  &.active {
    display: flex;
  }
`;

const BookButton = styled.button`
  &.active {
    display: block;
  }

  display: none;
  outline: none;
  border: none;
  height: 2rem;
  width: 5rem;
  border-radius: 25px;
  transition: 0.4s ease;
  cursor: pointer;

  margin-top: 1rem;
  margin-left: 18rem;

  &:hover {
    background: black;
    color: white;
  }

  @media (max-width: 425px) {
    margin-left: 9rem;
  }
`;
