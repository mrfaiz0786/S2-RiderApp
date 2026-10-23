# Test scope

`npm test` runs Node unit tests against pure TypeScript source with a small transpilation loader. TypeScript correctness is checked separately with `npm run typecheck`. Tests exercise real exported reducers/selectors and route metadata, not duplicate test implementations. Native React component rendering, interaction tests and full device automation are not yet configured. Add those with an Expo-compatible test harness after the native runtime baseline is confirmed.
