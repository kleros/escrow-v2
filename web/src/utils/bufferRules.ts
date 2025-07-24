export type BufferRule = { fromUnixSec: number; bufferSec: number };

export const BUFFER_RULES: BufferRule[] = [
  { fromUnixSec: 0, bufferSec: 0 }, // there was no buffer between delivery deadline and dispute deadline in the beginning of Escrow V2
  { fromUnixSec: 1753315200, bufferSec: 7 * 24 * 60 * 60 } // starts Jul 24 2025 00:00:00 UTC, buffer = 1 week (604800s)
];

export const pickBufferFor = (creationUnixSec: number) =>
  BUFFER_RULES.reduce(
    (acc, r) => (creationUnixSec >= r.fromUnixSec ? r.bufferSec : acc),
    BUFFER_RULES[0].bufferSec
  );
