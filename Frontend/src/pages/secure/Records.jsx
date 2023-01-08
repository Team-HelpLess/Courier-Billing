// Imports
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useAxiosPrivate from "../../hooks/usePrivateAxios";
import Popup from "../../components/Popup";
import ReadOnlyRow from "../../components/dashboard components/ReadOnlyRow";
import EditableRow from "../../components/dashboard components/EditableRow";

// Records api URL
const RECORDS_URL = "";
// delete api url
const DELETE_URL = "delete/";

// Records Functional component
function Records() {
  // Constants for the states and miscallaneous
  const [deleteRecTrigger, setDeleteRecTrigger] = useState(false);
  const [deleteRecId, setDeleteRecId] = useState(null);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const dataFetchedRef = useRef(false);
  const axiosPrivate = useAxiosPrivate();

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

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.delete(
        `${DELETE_URL}${deleteRecId}/`
      );
      console.log(response);
      getRecords();
    } catch (err) {
      if (!err?.response) {
        console.log("NO SEVER RESPONSE");
      } else {
        console.log("SOMETHING WRONG");
      }
    }

    setDeleteRecTrigger(false);
  };

  // useEffect hook to run the getRecords function while component loads.
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getRecords();
  }, []);

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
              <Th>Edit</Th>
              <Th>Delete</Th>
            </Tr>
            {records.map((record, index) => {
              return editId === record.courier_number ? (
                <EditableRow
                  record={record}
                  index={index}
                  setEditId={setEditId}
                  getRecords={getRecords}
                />
              ) : (
                <ReadOnlyRow
                  record={record}
                  index={index}
                  setEditId={setEditId}
                  setDeleteRecId={setDeleteRecId}
                  setDeleteRecTrigger={setDeleteRecTrigger}
                />
              );
            })}
          </Tbody>
        </RecordsTable>
      )}

      <Popup
        trigger={deleteRecTrigger}
        setTrigger={setDeleteRecTrigger}
        actionName={`Delete ${deleteRecId}?`}
        actionFunc={handleDelete}
      />
    </RecordsWrapper>
  );
}
export default Records;

// Stylings
const RecordsWrapper = styled.div`
  padding-top: 5vh;
  min-height: 100vh;
  width: 100%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: 0.3s ease;

  & > * {
    transition: 0.3s ease;
  }
`;

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
  font-size: 0.85rem;
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
