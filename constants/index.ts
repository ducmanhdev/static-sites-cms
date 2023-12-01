export const DATE_TIME_FORMAT = 'YYYY/MM/DD HH:mm:ss';

export const EVENT_TYPE = {
  BUILD_START: 'build:start',
  BUILD_PROCESSING: 'build:processing',
  BUILD_COMPLETE: 'build:complete',
  BUILD_ERROR: 'build:error',
  PUSH_COMPLETE: 'push:complete',
  LOG_CHANGE: 'log:change',
};

export const BUILD_STATUS = {
  PROCESSING: 0,
  COMPLETE: 1,
  ERROR: 2,
};
