import styled from "styled-components";

export const PositiveTicker = styled.div`
  min-width: 100px;
  font-size: 1.5em;
  margin: 0 1em 1em 1em;
  color: rgb(14, 203, 129);
  &:hover {
    opacity: 0.8;
  }
`;

export const NegativeTicker = styled(PositiveTicker)`
  color: rgb(246, 70, 93);
`;
