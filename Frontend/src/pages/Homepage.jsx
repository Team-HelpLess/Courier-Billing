// Imports
import styled from "styled-components";
import Login from "../components/Login";
import InfoSection from "../components/InfoSection";
import CourierStat from "../components/CourierStat";

// Homepage functional component
function Homepage() {
  return (
    <>
      <Section>
        <CourierStat />

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
  min-height: -webkit-fill-available;
  width: 100%;
  background: #2f3136;
`;
const SubSection = styled.section`
  height: 90vh;
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
