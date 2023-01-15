import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

function PartyBook(props) {
  const {} = props; //Destructuring props

  const [detail, setDetail] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const partyName = location.state.partyName;

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

        <BookParty></BookParty>
      </PartyPage>
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
    justify-content: space-around;
    width: 95%;
    position: fixed;
    top: 15.5vh;
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
`;
const FrequentParties = styled.div`
  height: 38vh;
  width: 100%;
  background: #202225;
  overflow-y: scroll;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: black;
  }
  &::-webkit-scrollbar-thumb {
    background: #a19c9cd6;
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
  overflow-y: scroll;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: black;
  }
  &::-webkit-scrollbar-thumb {
    background: #a19c9cd6;
  }
`;

const BookParty = styled.section`
  height: 85vh;
  width: 49%;
  background: #202225;
  padding: 10px;
  overflow-y: scroll;

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
    background: #a19c9cd6;
  }

  @media (max-width: 425px) {
    width: 100%;
    height: 80vh;
  }
`;
