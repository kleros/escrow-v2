import React from "react";

import { useNavigate, useParams } from "react-router-dom";
import { DropdownSelect } from "@kleros/ui-components-library";

import { useIsList } from "context/IsListProvider";
import useIsDesktop from "hooks/useIsDesktop";
import { decodeURIFilter, encodeURIFilter, useRootPath } from "utils/uri";

import ListIcon from "svgs/icons/list.svg";
import GridIcon from "svgs/icons/grid.svg";
import clsx from "clsx";

const iconStyles = clsx(
  "transition duration-100 cursor-pointer overflow-hidden",
  "fill-klerosUIComponentsPrimaryBlue hover:fill-klerosUIComponentsSecondaryBlue"
);

const Filters: React.FC = () => {
  const { order, filter } = useParams();
  const { ...filterObject } = decodeURIFilter(filter ?? "all");
  const navigate = useNavigate();
  const location = useRootPath();

  const handleOrderChange = (value: string | number) => {
    const encodedFilter = encodeURIFilter({ ...filterObject });
    navigate(`${location}/1/${value}/${encodedFilter}`);
  };

  const { isList, setIsList } = useIsList();
  const isDesktop = useIsDesktop();

  return (
    <div className="flex justify-end gap-3 w-fit">
      <DropdownSelect
        smallButton
        simpleButton
        items={[
          { id: "desc", itemValue: "desc", text: "Newest" },
          { id: "asc", itemValue: "asc", text: "Oldest" },
        ]}
        defaultSelectedKey={order}
        callback={(item) => handleOrderChange(item.itemValue)}
      />
      {isDesktop ? (
        <div className="flex justify-center items-center gap-1">
          {isList ? (
            <GridIcon width={16} height={16} className={iconStyles} onClick={() => setIsList(false)} />
          ) : (
            <ListIcon
              width={16}
              height={16}
              className={iconStyles}
              onClick={() => {
                if (isDesktop) {
                  setIsList(true);
                }
              }}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Filters;
