// Imports
import styled from "styled-components";
import brownEnvelope2 from "../assets/brownEnvelope2.png";

// functional Dashboard component
function Dashboard() {
  return <DashWrapper></DashWrapper>;
}
export default Dashboard;

// Stylings
const DashWrapper = styled.div`
  min-height: 100vh;
  min-width: 100%;
  background-image: url(${brownEnvelope2});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;
