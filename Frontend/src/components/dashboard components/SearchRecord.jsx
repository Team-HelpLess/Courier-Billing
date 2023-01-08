// Imports
import { useState } from "react";
import styled from "styled-components";
import useAxiosPrivate from "../../hooks/usePrivateAxios";

// api URL for searching records
const SEARCH_URL = "find_many/";

// SearchRecord component
function SearchRecord(props) {
  // Destructuring props
  const { setRecords } = props;

  // states for the component
  const [keyWord, setKeyWord] = useState("");

  // PrivateAxios instance to send api request
  const axiosPrivate = useAxiosPrivate();
  const handleSearch = async () => {
    const data = { from_company: keyWord };
    try {
      const response = await axiosPrivate.get(SEARCH_URL, JSON.stringify(data));
      console.log(response);
      setRecords(response?.data);
    } catch (err) {
      if (!err?.response) {
        console.log("NO SERVER RESPONSE");
      } else {
        console.log("SOMETHING WRONG");
      }
    }
  };

  return (
    <SearchWrapper>
      <Search>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Input onChange={(e) => setKeyWord(e.target.value)} required />
          <Button type="submit">🔍</Button>
        </Form>
      </Search>
    </SearchWrapper>
  );
}
export default SearchRecord;

// Stylings
const SearchWrapper = styled.div`
  height: 10vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Search = styled.section``;

const Form = styled.form``;

const Input = styled.input`
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  background: transparent;
  padding: 5px 0px;
  color: white;
`;

const Button = styled.button`
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  padding: 5px 0px;
  background: transparent;
  cursor: pointer;
`;
