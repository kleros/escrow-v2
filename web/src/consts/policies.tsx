import React from "react";
import PolicyIcon from "svgs/icons/policy.svg";
import DocIcon from "svgs/icons/doc.svg";

export const POLICIES = [
  {
    id: "general",
    text: "General Policy",
    icon: <PolicyIcon className="fill-klerosUIComponentsPrimaryBlue w-4 h-4 mr-2" />,
    itemValue: "ipfs/QmZe1boH5yQZexSNnmqKuYVfR7xUH9iU3HLQecCnHRbYqe"
  },
  {
    id: "good_practices",
    text: "Good Practices",
    icon: <DocIcon className="fill-klerosUIComponentsPrimaryBlue w-4 h-4 mr-2" />,
    itemValue: "ipfs/QmZkUiAbBRNmmbCosJV5yepcSXZjec7oXWy4uxj7y4L29U"
  },
];
