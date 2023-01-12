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
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [district, setDistrict] = useState("");
  const [type, setType] = useState("");
  const [comp, setComp] = useState("");

  // PrivateAxios instance to send api request
  const axiosPrivate = useAxiosPrivate();
  const handleSearch = async () => {
    const data = {};
    if (from !== "") data["from_company"] = from;
    if (to !== "") data["to_company"] = to;
    if (district !== "") data["to_destination"] = district;
    if (type !== "") data["courier_type"] = type;
    if (comp !== "") data["courier_company"] = comp;

    try {
      const response = await axiosPrivate.post(SEARCH_URL, data);
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
          onSubmit={e => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <Input
            onChange={e => setFrom(e.target.value)}
            placeholder="From Party"
            name="from_company"
          />
          <Input
            onChange={e => setTo(e.target.value)}
            placeholder="To Party"
            name="to_company"
          />
          <Input
            onChange={e => setDistrict(e.target.value)}
            placeholder="District"
            name="to_destination"
          />
          <Input
            onChange={e => setType(e.target.value)}
            placeholder="cash / credit"
            name="courier_type"
          />
          <Input
            onChange={e => setComp(e.target.value)}
            placeholder="akash / anjani"
            name="courier_company"
          />
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

  @media (max-width: 425px) {
    height: 20vh;
  }
`;

const Search = styled.section`
  width: 100%;
`;

const Form = styled.form`
  margin: auto;
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 425px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Input = styled.input`
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  background: transparent;
  padding: 5px 0px;
  color: white;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: none;
    -webkit-box-shadow: 0 0 0 30px black inset !important;
  }
  &:-webkit-autofill {
    -webkit-text-fill-color: #2f3136 !important;
  }
`;

const Button = styled.button`
  outline: none;
  border: none;
  padding: 5px 0px;
  background: transparent;
  cursor: pointer;
  transition: 0.3s ease;
  width: 2rem;
  border-radius: 10px;

  &:hover {
    background: white;
  }
`;
