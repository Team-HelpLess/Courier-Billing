import styled from "styled-components";

function PartyPages(props) {
  const {} = props;

  return (
    <PartyTileWrapper>
      <PartyTile>
        <Delete>
          <Span className="bar"></Span>
          <Span className="bar"></Span>
        </Delete>
        <Input className="cNum" />
        <Input className="to" />
        <Input className="district" />
        <Input className="weight" />
        <Input className="amount" />
      </PartyTile>
    </PartyTileWrapper>
  );
}
export default PartyPages;

const PartyTileWrapper = styled.div`
  min-height: 29.5vh;
  width: 100%;
  background: #2f3136;

  @media (max-width: 425px) {
    min-height: 35vh;
  }
`;

const PartyTile = styled.section`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas:
    "cNum other delete"
    "to district none"
    "weight amount none";
  /* grid-gap: 1rem; */
  padding: 10px;

  @media (max-width: 425px) {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
`;

const Input = styled.input`
  background: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid white;

  &.cNum {
    grid-area: cNum;
    justify-self: center;
    align-self: center;
  }

  &.to {
    grid-area: to;
    justify-self: center;
    align-self: center;
  }

  &.district {
    grid-area: district;
    justify-self: center;
    align-self: center;
  }

  &.weight {
    grid-area: weight;
    justify-self: center;
    align-self: center;
  }

  &.amount {
    grid-area: amount;
    justify-self: center;
    align-self: center;
  }
`;

const Delete = styled.div`
  grid-area: delete;
  justify-self: end;
  align-self: center;
  margin-right: 1rem;

  cursor: pointer;
  & .bar:nth-child(1) {
    transform: translateY(5px) rotate(45deg);
  }
  & .bar:nth-child(2) {
    transform: translateY(-8px) rotate(-45deg);
  }

  &:hover {
    .bar {
      background-color: #db1212;
    }
  }

  @media (max-width: 425px) {
    margin-top: -1rem;
    margin-left: 17.5rem;
  }
`;
const Span = styled.span`
  &.active {
    display: none;
  }

  display: block;
  width: 20px;
  height: 3px;
  margin: 10px auto;
  background-color: white;
  transition: 0.3s;
`;
