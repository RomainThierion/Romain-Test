import styled from "styled-components";

export const OrderList = styled.table`
  min-width: 200px;
  width: 100%;
  font-size: 1em;
  padding: 12px 24px;
  border-collapse: collapse;
`;

export const Th = styled.th`
  min-width: 100px;
  width: 100%;
  font-size: 1em;
  margin: 1em;
  padding: 12px 24px;
`;

export const Tr = styled.tr`
  background: #eaecef;
  color: gray;
  min-width: 100px;
  width: 100%;
  border-bottom: 1px solid #eff2f5;
  padding: 12px 24px;

  &:hover {
    background-color: #eff2f5;
    border-bottom: 1px solid #d2dfec;
  }
`;

export const Td = styled.td`
  background-color: white;
  color: gray;
  min-width: 200px;
  width: 100%;
  padding: 12px 0;
`;
