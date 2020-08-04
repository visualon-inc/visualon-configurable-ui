export interface ProgressInfo {
  position: number;
  duration: number;
  live: boolean;
  range: any;
  validBufferLength: number;
};

export const ProgressInfoObj = {
  position: 0,
  duration: 0,
  live: false,
  range: { start: 0, end: 0},
  validBufferLength: 0,
};