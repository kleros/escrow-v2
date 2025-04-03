import React from "react";

import styled, { css } from "styled-components";
import { hoverShortTransitionTiming } from "styles/commonStyles";

import { useNavigate, useParams } from "react-router-dom";
import { DropdownSelect } from "@kleros/ui-components-library";

import { useIsList } from "context/IsListProvider";
import useIsDesktop from "hooks/useIsDesktop";
import { decodeURIFilter, encodeURIFilter, useRootPath } from "utils/uri";

import ListIcon from "svgs/icons/list.svg";
import GridIcon from "svgs/icons/grid.svg";
import { IItem } from "@kleros/ui-components-library/dist/lib/dropdown/select/item";

const Container = styled.div`
  display: flex;
  justify-content: end;
  gap: 12px;
  width: fit-content;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const BaseIconStyles = css`
  ${hoverShortTransitionTiming}
  cursor: pointer;
  fill: ${({ theme }) => theme.primaryBlue};
  width: 16px;
  height: 16px;
  overflow: hidden;

  :hover {
    fill: ${({ theme }) => theme.secondaryBlue};
  }
`;

const StyledGridIcon = styled(GridIcon)`
  ${BaseIconStyles}
`;

const StyledListIcon = styled(ListIcon)`
  ${BaseIconStyles}
`;

const Filters: React.FC = () => {
  const { order, filter } = useParams();
  const { ...filterObject } = decodeURIFilter(filter ?? "all");
  const navigate = useNavigate();
  const location = useRootPath();

  const handleOrderChange = (item: IItem) => {
    const encodedFilter = encodeURIFilter({ ...filterObject });
    navigate(`${location}/1/${item.itemValue}/${encodedFilter}`);
  };

  const { isList, setIsList } = useIsList();
  const isDesktop = useIsDesktop();

  return (
    <Container>
      <DropdownSelect
        smallButton
        simpleButton
        items={[
          { id: "desc", itemValue: "desc", text: "Newest" },
          { id: "asc", itemValue: "asc", text: "Oldest" },
        ]}
        defaultSelectedKey={order}
        callback={handleOrderChange}
      />
      {isDesktop ? (
        <IconsContainer>
          {isList ? (
            <StyledGridIcon onClick={() => setIsList(false)} />
          ) : (
            <StyledListIcon
              onClick={() => {
                if (isDesktop) {
                  setIsList(true);
                }
              }}
            />
          )}
        </IconsContainer>
      ) : null}
    </Container>
  );
};

export default Filters;
