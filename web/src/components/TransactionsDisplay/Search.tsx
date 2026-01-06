import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { Searchbar, DropdownSelect } from "@kleros/ui-components-library";
import { decodeURIFilter, encodeURIFilter, useRootPath } from "utils/uri";
import { isEmpty } from "src/utils";

const dropdownItems = [
  { id: "all", text: "All States", dot: "grey", itemValue: "all" },
  { id: "NoDispute", text: "In Progress", dot: "blue", itemValue: "NoDispute" },
  {
    id: "WaitingSettlementBuyer",
    text: "Settlement - Waiting Buyer",
    dot: "orange",
    itemValue: "WaitingSettlementBuyer",
  },
  {
    id: "WaitingSettlementSeller",
    text: "Settlement - Waiting Seller",
    dot: "orange",
    itemValue: "WaitingSettlementSeller",
  },
  { id: "WaitingBuyer", text: "Raising a Dispute - Waiting Buyer", dot: "blue", itemValue: "WaitingBuyer" },
  { id: "WaitingSeller", text: "Raising a Dispute - Waiting Seller", dot: "blue", itemValue: "WaitingSeller" },
  { id: "DisputeCreated", text: "Disputed", dot: "purple", itemValue: "DisputeCreated" },
  { id: "TransactionResolved", text: "Concluded", dot: "green", itemValue: "TransactionResolved" },
];

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
    <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
      <DropdownSelect
        items={dropdownItems}
        defaultSelectedKey={decodedFilter.status ?? "all"}
        callback={(item) => handleStatusChange(item.itemValue)}
      />
      <div className="flex flex-wrap gap-2 w-full mb-1.5 z-0">
        <Searchbar
          className="flex-1 basis-80"
          type="text"
          aria-label="Search by ID"
          placeholder="Search By ID"
          value={search}
          onChange={setSearch}
        />
      </div>
    </div>
  );
};

export default Search;
