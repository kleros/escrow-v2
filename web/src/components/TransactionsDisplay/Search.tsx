import React, { useState } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { Searchbar, DropdownSelect } from "@kleros/ui-components-library";
import { decodeURIFilter, encodeURIFilter, useRootPath } from "utils/uri";
import { isEmpty } from "src/utils";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${landscapeStyle(
  () =>
    css`
        flex-direction: row;
        gap: 16px;
      `
)}
`;

const SearchBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 5px;
  z-index: 0;
`;

const StyledSearchbar = styled(Searchbar)`
  flex: 1;
  flex-basis: 310px;
  input {
    font-size: 16px;
    height: 45px;
    padding-top: 0px;
    padding-bottom: 0px;
  }
`;

const Search: React.FC = () => {
  const { page, order, filter } = useParams();
  const location = useRootPath();
  const decodedFilter = decodeURIFilter(filter ?? "all");
  const { id: searchValue, ...filterObject } = decodedFilter;
  const [search, setSearch] = useState(searchValue ?? "");
  const navigate = useNavigate();

  useDebounce(
    () => {
      const newFilters = isEmpty(search) ? { ...filterObject } : { ...filterObject, id: search };
      const encodedFilter = encodeURIFilter(newFilters);
      navigate(`${location}/${page}/${order}/${encodedFilter}`);
    },
    500,
    [search]
  );

  const handleStatusChange = (selectedValue) => {
    const newFilters = { ...filterObject, status: selectedValue === "all" ? undefined : selectedValue };
    const encodedFilter = encodeURIFilter(newFilters);
    navigate(`${location}/${page}/${order}/${encodedFilter}`);
  };

  return (
    <Container>
      <DropdownSelect
        items={[
          { text: "All States", dot: "grey", value: "all" },
          { text: "In Progress", dot: "blue", value: "NoDispute" },
          { text: "Settlement - Waiting Buyer", dot: "orange", value: "WaitingSettlementBuyer" },
          { text: "Settlement - Waiting Seller", dot: "orange", value: "WaitingSettlementSeller" },
          { text: "Raising a Dispute - Waiting Buyer", dot: "blue", value: "WaitingBuyer" },
          { text: "Raising a Dispute - Waiting Seller", dot: "blue", value: "WaitingSeller" },
          { text: "Disputed", dot: "purple", value: "DisputeCreated" },
          { text: "Concluded", dot: "green", value: "TransactionResolved" },
        ]}
        defaultValue={decodedFilter.status ?? "all"}
        callback={(value) => handleStatusChange(value)}
      />
      <SearchBarContainer>
        <StyledSearchbar
          type="text"
          placeholder="Search By ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBarContainer>
    </Container>
  );
};

export default Search;
