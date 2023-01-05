// Imports
import styled from "styled-components";
import Login from "../components/Login";
import InfoSection from "../components/InfoSection";
import homepageBG from "../assets/brownEnvelope1.png";

// Homepage functional component
function Homepage() {
  return (
    <>
      <Section>
        <SubSection>
          <InfoSection />

          <Login />
        </SubSection>
      </Section>
    </>
  );
}
export default Homepage;

// Stylings
const Section = styled.section`
  background-image: url(${homepageBG});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: -webkit-fill-available;
  width: 100%;
`;
const SubSection = styled.section`
  height: 100vh;
  width: 70%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 425px) {
    width: 90%;
  }
`;
