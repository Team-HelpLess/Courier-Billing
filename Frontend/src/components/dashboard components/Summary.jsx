import styled from "styled-components";

function Summary(props) {
  const { trigger, setTrigger, submitables, action } = props;

  const bookListRow = (rec) => {
    const {
      courier_number,
      from_company,
      to_company,
      to_destination,
      phone_no,
      courier_weight,
      courier_rate,
    } = rec;

    return (
      <Tr>
        <Td data-label="C.Number">{courier_number}</Td>
        <Td data-label="From">{from_company}</Td>
        <Td data-label="To">{to_company}</Td>
        <Td data-label="Destination">{to_destination}</Td>
        <Td data-label="Phone">{phone_no}</Td>
        <Td data-label="Weight">{courier_weight} g</Td>
        <Td data-label="Rate">{courier_rate}</Td>
      </Tr>
    );
  };

  return trigger ? (
    <SummaryWrapper>
      <Sumry>
        <H3>BOOKING SUMMARY</H3>
        <br />

        <Section>
          <BookListTable>
            <Tbody>
              <Tr>
                <Th>C.Number</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Destination</Th>
                <Th>Phone</Th>
                <Th>Weight</Th>
                <Th>Amount</Th>
              </Tr>
              {Object.keys(submitables).map((key) => {
                return bookListRow(submitables[key]);
              })}
            </Tbody>
          </BookListTable>
        </Section>

        <ButtonSection>
          <Button onClick={() => action()}>BOOK</Button>
          <Button onClick={() => setTrigger(false)}>Cancel</Button>
        </ButtonSection>
      </Sumry>
    </SummaryWrapper>
  ) : (
    ""
  );
}
export default Summary;

const SummaryWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;

  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Sumry = styled.section`
  position: relative;
  padding: 10px;

  height: 60vh;
  width: 65%;
  color: white;

  @media (max-width: 425px) {
    width: 90%;
  }

  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const H3 = styled.h3``;

const Section = styled.section`
  height: 75%;
  width: 95%;
  margin: auto;

  overflow: auto;
  overflow-x: hidden;
`;

const BookListTable = styled.table`
  height: 70%;
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 425px) {
    display: block;
  }
`;
const Tbody = styled.tbody`
  & Tr:nth-child(even) {
    background-color: #2929296c;
  }

  @media (max-width: 425px) {
    display: block;
  }
`;
const Tr = styled.tr`
  @media (max-width: 425px) {
    display: block;
    margin-bottom: 25px;
    border: 1px solid gray;
  }
`;
const Th = styled.th`
  background: blue;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 12px;
  top: 0;
  position: sticky;

  @media (max-width: 425px) {
    display: none;
  }
`;
const Td = styled.td`
  padding: 10px;
  text-align: center;
  transition: 0.3s ease;

  @media (max-width: 425px) {
    color: white;
    display: block;
    text-align: right;
    position: relative;
    padding-left: 50%;

    &::before {
      content: attr(data-label);
      color: grey;
      position: absolute;
      left: 0;
      width: 50%;
      font-weight: 900;
      text-align: left;
      padding-left: 10px;
    }
  }
`;

const ButtonSection = styled.section`
  width: 25%;
  height: 10vh;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media (max-width: 425px) {
    width: 60%;
  }
`;
const Button = styled.button`
  height: 2rem;
  width: 5rem;
  background: #ffffffc8;
  color: black;
  cursor: pointer;
  transition: 0.5s ease;
  border-radius: 10px;

  &:hover {
    background: white;
    color: black;
  }
`;
