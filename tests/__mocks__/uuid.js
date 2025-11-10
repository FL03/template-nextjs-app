// Simple CommonJS mock for uuid used in tests
module.exports = {
  v1: () => "mock-uuid-v1",
  v4: () => "mock-uuid-v4",
  // keep a default export shape in case some code uses `import uuid from "uuid"`
  default: {
    v1: () => "mock-uuid-v1",
    v4: () => "mock-uuid-v4",
  },
};
