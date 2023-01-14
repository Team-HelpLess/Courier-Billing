// Imports
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { parties } from "../../components/dashboard components/CompaniesList";

// Particular Cards
const CreditCard = partyName => {
  return (
    <Card>
      <Descript>{partyName.partyName}</Descript>
    </Card>
  );
};

// Credit Functional component
function Credit() {
  const RenderRef = useRef(false);
  const [partiesList, setPartiesList] = useState([]);
  const [filterlist, setFilterList] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {
    if (RenderRef.current) {
      return;
    }
    RenderRef.current = true;

    setPartiesList(Object.keys(parties));
    setFilterList(Object.keys(parties));
  }, []);
  useEffect(() => {
    const filters = partiesList.filter(party =>
      party.toLowerCase().includes(key.toLowerCase())
    );
    setFilterList(filters);
  }, [key]);

  // Actual JSX element for the Functional component
  return (
    <CreditWrapper>
      <Search>
        <Input type="text" onChange={e => setKey(e.target.value)} />
      </Search>

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

const Input = styled.input`
  padding: 10px;
  background: #202225;
  outline: none;
  border: none;
  font-size: 1.25rem;
  color: white;
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
