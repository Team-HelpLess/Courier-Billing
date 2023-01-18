import { useEffect, useRef, useState } from "react";
import { districts } from "./districtList";
import styled from "styled-components";

function PartyPages(props) {
  const {
    courier_number,
    cweight,
    camount,
    partyName,
    setSubmitables,
    setDeleteId,
    setDeleteTrigger,
  } = props;

  const [cnum, setCnum] = useState(courier_number);
  const [to, setTo] = useState("");
  const [district, setDistrict] = useState("");
  const [weight, setWeight] = useState(cweight);
  const [amount, setAmount] = useState(camount);

  const comp = String(courier_number).length === 9 ? "akash" : "anjani";

  useEffect(() => {
    const TileValues = {
      [props.formNum]: {
        courier_number: parseInt(cnum),
        courier_type: "credit",
        courier_company: comp,
        from_company: partyName,
        to_company: to,
        to_destination: district,
        courier_weight: parseInt(weight),
        courier_rate: parseInt(amount),
        // phone_no: phone,
      },
    };

    setSubmitables(prevSubmits => {
      return { ...prevSubmits, ...TileValues };
    });
  }, [cnum, to, district, weight, amount]);

  return (
    <PartyTileWrapper>
      <PartyTile>
        <Delete
          onClick={e => {
            setDeleteTrigger(true);
            setDeleteId(props.formNum);
          }}
        >
          <Span className="bar"></Span>
          <Span className="bar"></Span>
        </Delete>
        <Div className="cNum">
          <P>C.Num</P>
          <Input
            type="number"
            value={cnum}
            onChange={e => setCnum(e.target.value)}
          />
        </Div>

        <Div className="to">
          <P>To</P>
          <Input
            className="white"
            type="text"
            onChange={e => setTo(e.target.value)}
          />
        </Div>

        <Div className="district">
          <P>Dist</P>
          <Input
            className="white"
            type="text"
            onChange={e => setDistrict(e.target.value)}
            list="availableDistricts"
          />
          <datalist id="availableDistricts">
            {districts.map((item, i) => (
              <option key={i} value={`${item}`}>
                {item}
              </option>
            ))}
          </datalist>
        </Div>

        <Div className="weight">
          <P>Weight</P>
          <Input
            type="number"
            step="50"
            value={weight}
            onChange={e => setWeight(e.target.value)}
          />
        </Div>

        <Div className="amount">
          <P>Rate</P>
          <Input
            type="number"
            step="10"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </Div>
      </PartyTile>
    </PartyTileWrapper>
  );
}
export default PartyPages;

const PartyTileWrapper = styled.div`
  min-height: 29.5vh;
  width: 100%;
  background: #2f3136;

  @media (max-width: 425px) {
    min-height: 35vh;
  }
`;

const PartyTile = styled.section`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas:
    "cNum cNum delete delete"
    "to to district district"
    "weight weight amount amount";
  /* grid-gap: 1rem; */
  padding: 10px;

  @media (max-width: 425px) {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
`;

const Div = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
  justify-content: space-between;
  &.cNum {
    grid-area: cNum;
    align-self: center;
    justify-self: center;
  }

  &.to {
    grid-area: to;
    justify-self: center;
    align-self: center;
  }

  &.district {
    grid-area: district;
    justify-self: center;
    align-self: center;
  }

  &.weight {
    grid-area: weight;
    justify-self: center;
    align-self: center;
  }

  &.amount {
    grid-area: amount;
    justify-self: center;
    align-self: center;
  }
`;

const P = styled.p`
  color: #75787cc3;
`;

const Input = styled.input`
  background: #202225;
  height: 2rem;
  padding: 10px 10px;
  color: #ffffffa0;
  outline: none;
  border: none;

  &.white {
    color: white;
  }
`;

const Delete = styled.div`
  grid-area: delete;
  justify-self: end;
  align-self: center;
  margin-right: 1rem;

  cursor: pointer;
  & .bar:nth-child(1) {
    transform: translateY(5px) rotate(45deg);
  }
  & .bar:nth-child(2) {
    transform: translateY(-8px) rotate(-45deg);
  }

  &:hover {
    .bar {
      background-color: #db1212;
    }
  }

  @media (max-width: 425px) {
    margin-top: -1rem;
    margin-left: 19rem;
  }
`;
const Span = styled.span`
  &.active {
    display: none;
  }

  display: block;
  width: 20px;
  height: 3px;
  margin: 10px auto;
  background-color: white;
  transition: 0.3s;
`;
