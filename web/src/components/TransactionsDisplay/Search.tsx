import React, { useState } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { Searchbar, DropdownSelect } from "@kleros/ui-components-library";
import { decodeURIFilter, encodeURIFilter, useRootPath } from "utils/uri";
import { isEmpty } from "src/utils";
import { IItem } from "@kleros/ui-components-library/dist/lib/dropdown/select/item";

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

const StyledDropdownSelect = styled(DropdownSelect)`
  [class*="button__Container"] {
    [class*="base-item__Item"] {
      border-left: 1px solid transparent;
    }
  }
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

  const handleStatusChange = (selectedItem: IItem) => {
    const newFilters = {
      ...filterObject,
      status: selectedItem.itemValue === "all" ? undefined : selectedItem.itemValue,
    };
    const encodedFilter = encodeURIFilter(newFilters);
    navigate(`${location}/${page}/${order}/${encodedFilter}`);
  };

  return (
    <Container>
      <StyledDropdownSelect
        items={[
          { text: "All States", dot: "grey", itemValue: "all", id: "all" },
          { text: "In Progress", dot: "blue", itemValue: "NoDispute", id: "NoDispute" },
          {
            text: "Settlement - Waiting Buyer",
            dot: "orange",
            itemValue: "WaitingSettlementBuyer",
            id: "WaitingSettlementBuyer",
          },
          {
            text: "Settlement - Waiting Seller",
            dot: "orange",
            itemValue: "WaitingSettlementSeller",
            id: "WaitingSettlementSeller",
          },
          { text: "Raising a Dispute - Waiting Buyer", dot: "blue", itemValue: "WaitingBuyer", id: "WaitingBuyer" },
          {
            text: "Raising a Dispute - Waiting Seller",
            dot: "blue",
            itemValue: "WaitingSeller",
            id: "WaitingSeller",
          },
          { text: "Disputed", dot: "purple", itemValue: "DisputeCreated", id: "DisputeCreated" },
          { text: "Concluded", dot: "green", itemValue: "TransactionResolved", id: "TransactionResolved" },
        ]}
        defaultSelectedKey={decodedFilter.status ?? "all"}
        callback={(item) => handleStatusChange(item)}
      />
      <SearchBarContainer>
        <StyledSearchbar
          type="text"
          inputProps={{ placeholder: "Search By ID" }}
          value={search}
          onChange={(val) => setSearch(val)}
        />
      </SearchBarContainer>
    </Container>
  );
};

export default Search;
