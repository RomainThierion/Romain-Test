import styled from "styled-components";

export const Button = styled.button`
  background: #fcd535;
  color: black;
  min-width: 200px;
  font-size: 1em;
  margin: 1em;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    border: none;
  }
`;
