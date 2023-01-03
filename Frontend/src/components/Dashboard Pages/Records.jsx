// Imports
import { format } from "date-fns";
import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/usePrivateAxios";
import styled from "styled-components";

// Records api URL
const RECORDS_URL = "";

// Records Functional component
function Records() {
  // Constants for the states and miscallaneous
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataFetchedRef = useRef(false);
  const axiosPrivate = useAxiosPrivate();

  // Options for Time and Date formatting
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const dateOptions = { day: "2-digit", month: "2-digit", year: "numeric" };

  // Async Await axios request to the API for getting the records
  const getRecords = async () => {
    try {
      const response = await axiosPrivate.get(RECORDS_URL);
      console.log(response.data);
      setRecords(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to run the getRecords function while component loads.
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getRecords();
  }, []);

  // Function to render the Table records in the table
  function renderTableRecord() {
    return records.map((record, index) => {
      const {
        courier_number,
        courier_type,
        courier_company,
        from_company,
        to_company,
        to_destination,
        courier_weight,
        courier_rate,
        phone_no,
        booked_date,
        booked_time,
      } = record;

      // Formatting Date
      const formattedDate = format(new Date(booked_date), "dd/MM/yyyy");
      // Formatting Time
      const [hours, minutes, seconds] = booked_time.split(":");
      const time = new Date(0, 0, 0, hours, minutes, seconds);
      const timeFormatter = new Intl.DateTimeFormat("en-US", timeOptions);
      const formattedTime = timeFormatter.format(time);

      return (
        <Tr key={index}>
          <Td data-label="C.Number">{courier_number}</Td>
          <Td data-label="C.Type">{courier_type}</Td>
          <Td data-label="C.Company">{courier_company}</Td>
          <Td data-label="From">{from_company}</Td>
          <Td data-label="To">{to_company}</Td>
          <Td data-label="Destination">{to_destination}</Td>
          <Td data-label="Weight">{courier_weight}</Td>
          <Td data-label="Amount">{courier_rate}</Td>
          <Td data-label="Phone">{phone_no}</Td>
          <Td data-label="Date">{formattedDate}</Td>
          <Td data-label="Time">{formattedTime}</Td>
        </Tr>
      );
    });
  }

  // Actual records JSX element.
  return (
    <RecordsWrapper>
      {loading ? (
        <P>Loading...</P>
      ) : (
        <RecordsTable id="records">
          <Tbody>
            <Tr>
              <Th>C.Number</Th>
              <Th>C.Type</Th>
              <Th>C.Company</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Destination</Th>
              <Th>Weight</Th>
              <Th>Amount</Th>
              <Th>Phone</Th>
              <Th>Date</Th>
              <Th>Time</Th>
            </Tr>
            {renderTableRecord()}
          </Tbody>
        </RecordsTable>
      )}
    </RecordsWrapper>
  );
}
export default Records;

// Stylings
const P = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: black;
`;

const RecordsTable = styled.table`
  width: 90%;
  border-collapse: collapse;

  @media (max-width: 425px) {
    display: block;
  }
`;

const Tbody = styled.tbody`
  & Tr:nth-child(even) {
    background-color: #2929296c;
  }

  & Th {
    top: 10vh;
    position: sticky;
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

  @media (max-width: 425px) {
    display: none;
  }
`;

const Td = styled.td`
  padding: 10px;
  text-align: center;

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

const RecordsWrapper = styled.div`
  padding-top: 5vh;
  min-height: 100vh;
  width: 100%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;
