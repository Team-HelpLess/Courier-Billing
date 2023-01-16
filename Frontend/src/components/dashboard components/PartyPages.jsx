import styled from "styled-components";

function PartyPages() {
  return (
    <PartyTileWrapper>
      <PartyTile></PartyTile>
    </PartyTileWrapper>
  );
}
export default PartyPages;

const PartyTileWrapper = styled.div`
  min-height: 30vh;
  width: 100%;
  background: #2f3136;

  @media (max-width: 425px) {
    min-height: 40vh;
  }
`;

const PartyTile = styled.section`
  height: 100%;
  width: 100%;
  display: grid;
`;
