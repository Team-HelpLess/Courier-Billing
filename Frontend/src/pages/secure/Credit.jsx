// Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { parties } from "../../components/dashboard components/CompaniesList";

// Particular Cards
const CreditCard = partyName => {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/partyBook", { state: { partyName: partyName.partyName } });
  }

  return (
    <Card onClick={handleClick}>
      <Descript>{partyName.partyName}</Descript>
    </Card>
  );
};

// Credit Functional component
function Credit() {
  const [partiesList] = useState(Object.keys(parties).sort());
  const [filterlist, setFilterList] = useState(Object.keys(parties).sort());
  const [key, setKey] = useState("");
  const [toggle, setToggle] = useState(false);
  const [newParty, setNewParty] = useState("");

  // useEffect hook to run whenever the key changes
  useEffect(() => {
    const filters = partiesList.filter(party =>
      party.toLowerCase().includes(key.toLowerCase())
    );
    setFilterList(filters);
  }, [key]);

  const handleAddParty = () => {
    parties[newParty] = [];
    setToggle(!toggle);
  };

  // Actual JSX element for the Functional component
  return (
    <CreditWrapper>
      <Search>
        <Input
          title="Search 🔍 Party"
          type="text"
          onChange={e => setKey(e.target.value)}
        />

        <Button
          title="Add a Party"
          onClick={e => {
            e.preventDefault();
            setToggle(!toggle);
          }}
          className="plus-btn"
        >
          +
        </Button>
      </Search>

      <AddWrapper className={toggle ? "active" : ""}>
        <AddParty>
          <Input
            className="addParty"
            type="text"
            onChange={e => setNewParty(e.target.value)}
          />
          <Button
            title="click to add party"
            className="addParty-btn"
            onClick={e => {
              e.preventDefault();
              handleAddParty;
            }}
          >
            ADD
          </Button>
        </AddParty>
      </AddWrapper>

      <CreditTiles>
        {filterlist.map((party, index) => (
          <CreditCard partyName={party} key={index} />
        ))}
      </CreditTiles>
    </CreditWrapper>
  );
}
export default Credit;

// Stylings for the particular cards
const Card = styled.div`
  height: 14rem;
  width: 15rem;
  border-radius: 10px;
  border: 1px solid #202225;
  background: #202225;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  transition: 0.9s ease;

  &:hover {
    border: 1px solid white;

    & > * {
      color: white;
    }
  }

  @media (max-width: 425px) {
    height: 9.5rem;
    width: 9.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    padding: 10px;
  }
`;

const Descript = styled.p`
  color: #ffffff86;
  position: absolute;
  text-transform: uppercase;
  font-weight: bolder;
  font-size: 30px;
  width: 12rem;
  cursor: pointer;
  margin-top: 5rem;
  transition: 0.5s ease;

  @media (max-width: 425px) {
    margin-top: 3rem;
    font-size: 20px;
    width: 8rem;
  }
`;

// Stylings for the credit page
const CreditWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #2f3136;
`;

const Search = styled.div`
  height: 15vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddWrapper = styled.div`
  height: 25vh;
  width: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transition: opacity 0.7s ease-in-out;
  opacity: 0;

  &.active {
    display: flex;
    opacity: 1;
  }
`;
const AddParty = styled.div`
  height: 90%;
  width: 80%;
  background: #202225;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  padding: 10px;
  background: #202225;
  outline: none;
  border: none;
  font-size: 1.25rem;
  color: white;

  &.addParty {
    background: #2f3136;
  }
  @media (max-width: 425px) {
    width: 10rem;
  }
`;

const Button = styled.button`
  padding: 7.5px;
  font-size: 1.5rem;
  border: none;
  outline: none;
  width: 3rem;
  cursor: pointer;
  transition: 0.5s;

  &.plus-btn {
    position: absolute;
    margin-left: 75%;

    @media (max-width: 425px) {
      margin-left: 70%;
      position: absolute;
    }
  }
  &.addParty-btn {
    padding: 12.5px;
    width: 5rem;
    font-size: 1rem;
    font-weight: bolder;
  }
  &:hover {
    background: white;
  }

  @media (max-width: 425px) {
    padding: 7px;
  }
`;

const CreditTiles = styled.section`
  height: inherit;
  width: 80%;
  margin: auto;
  padding-bottom: 4rem;

  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  transition: 0.5s ease;

  @media (max-width: 425px) {
    gap: 0;
    justify-content: space-between;
    width: 85%;
    padding-bottom: 1rem;
  }
`;
