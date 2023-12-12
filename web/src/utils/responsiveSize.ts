export const responsiveSize = (minSize, maxSize) =>
  `calc(${minSize}px + (${maxSize} - ${minSize}) * (min(max(100vw, 375px), 1250px) - 375px) / 875)`;
