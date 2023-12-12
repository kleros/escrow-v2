export const responsiveSize = (minSize: number, maxSize: number, minScreen: number = 375, maxScreen: number = 1250) =>
  `calc(${minSize}px + (${maxSize} - ${minSize}) * (min(max(100vw, ${minScreen}px), ${maxScreen}px) - ${minScreen}px) / (${
    maxScreen - minScreen
  }))`;
