// Imports
import styled from "styled-components";
import CourierStat from "../../components/CourierStat";

// functional Dashboard component
function Dashboard() {
  return (
    <DashWrapper>
      <CourierStat />
    </DashWrapper>
  );
}
export default Dashboard;

// Stylings
const DashWrapper = styled.div`
  min-height: 100vh;
  min-width: 100%;
  background: #2f3136;
`;
