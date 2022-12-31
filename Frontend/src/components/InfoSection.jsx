import styled from "styled-components";

function InfoSection() {
  return (
    <Div>
      <Wrapper>
        <Text>CB</Text>
      </Wrapper>
    </Div>
  );
}
export default InfoSection;

const Div = styled.div`
  height: 30vh;
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 425px) {
    height: 20vh;
    width: 100%;
  }
`;

const Wrapper = styled.section`
  height: 50%;
  width: 80%;
  background: rgb(221 143 70 / 40%);
  /* box-shadow: 0 8px 32px 0 rgb(216, 26, 90); */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 10px;
  border: 1px solid rgb(221 143 70 / 40%);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.p`
  color: #101010d1;
  font-size: 5rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  font-weight: 900;

  @media (max-width: 425px) {
    font-size: 3rem;
  }
`;
