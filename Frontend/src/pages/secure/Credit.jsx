// Imports
import styled from "styled-components";
import { parties } from "../../components/dashboard components/CompaniesList";

const CreditCard = partyName => {
  return (
    <Card>
      <Span></Span>
      <Descript>{partyName.partyName}</Descript>
    </Card>
  );
};

const Card = styled.div`
  height: 15rem;
  width: 20rem;
  border-radius: 10px;
  background: gray;
  display: flex;
  align-items: center;
  padding: 15px;
  cursor: pointer;

  @media (max-width: 425px) {
    height: 9.5rem;
    width: 9.5rem;
    border-radius: 10px;
    background: gray;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    padding: 10px;
  }
`;
const Span = styled.div`
  margin-left: -15px;
  margin-top: 4rem;
  position: absolute;
  width: inherit;
  height: 9rem;
  background: brown;

  @media (max-width: 425px) {
    display: none;
  }
`;
const Descript = styled.p`
  position: absolute;
  text-transform: uppercase;
  font-weight: bolder;
  font-size: 35px;
  width: 18rem;
  cursor: pointer;
  margin-top: 6rem;

  @media (max-width: 425px) {
    margin-top: 4rem;
    font-size: 20px;
    width: 8rem;
  }
`;

// Credit Functional component
function Credit() {
  // Actual JSX element for the Functional component
  return (
    <CreditWrapper>
      <CreditTiles>
        {Object.keys(parties).map((party, index) => (
          <CreditCard partyName={party} key={index} />
        ))}
      </CreditTiles>
    </CreditWrapper>
  );
}
export default Credit;

// Stylings
const CreditWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: black;
`;

const CreditTiles = styled.section`
  height: inherit;
  width: 80%;
  margin: auto;
  padding: 4rem 0;

  display: flex;
  flex-wrap: wrap;
  gap: 3.85rem;

  @media (max-width: 425px) {
    gap: 0;
    justify-content: space-between;
    width: 85%;
    padding: 2rem 0;
  }
`;
