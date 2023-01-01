import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/usePrivateAxios";
import styled from "styled-components";

const RECORDS_URL = "";

function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [once, setOnce] = useState(true);
  const axiosPrivate = useAxiosPrivate();

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

  useEffect(() => {
    if (once) {
      getRecords();
    }
    setOnce(false);
  }, []);

  function renderTableHeader() {
    let header = Object.keys(records[0]);
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  }

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
      return (
        <tr key={index}>
          <td>{courier_number}</td>
          <td>{courier_type}</td>
          <td>{courier_company}</td>
          <td>{from_company}</td>
          <td>{to_company}</td>
          <td>{to_destination}</td>
          <td>{courier_weight}</td>
          <td>{courier_rate}</td>
          <td>{phone_no}</td>
          <td>{booked_date}</td>
          <td>{booked_time}</td>
        </tr>
      );
    });
  }

  return (
    <RecordsWrapper>
      {loading ? (
        <P>Loading...</P>
      ) : (
        <RecordsTable id="records">
          <tbody>
            <tr>{renderTableHeader()}</tr>
            {renderTableRecord()}
          </tbody>
        </RecordsTable>
      )}
    </RecordsWrapper>
  );
}
export default Records;

const P = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: black;
`;

const RecordsWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
`;

const RecordsTable = styled.table``;
