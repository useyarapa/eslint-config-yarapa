## Summary

<!-- What changes, and why? Link the controlling issue. -->

Closes/Tracks #

## Change classification

- [ ] Behavior/rule change
- [ ] Verification/CI change
- [ ] Dependency/tooling change
- [ ] Documentation/governance change

## Required evidence

- [ ] `check-types` passes
- [ ] `build` passes
- [ ] `lint` passes
- [ ] tests pass
- [ ] Rule Inventory is unchanged or its diff is reviewed
- [ ] packed-consumer / `publint` / ATTW checks pass when package shape or dependencies change
- [ ] compatibility/Windows checks pass when supported-runtime behavior is affected

## Behavioral and supply-chain review

- [ ] New/tighter diagnostics are identified as behavioral SemVer impact
- [ ] Autofix changes have idempotence/regression evidence
- [ ] Dependency changes are intentional and reviewable
- [ ] No CI/security control was weakened to obtain a green run
- [ ] No npm publication, npm publishing credential/configuration, tag, or GitHub Release is part of this PR unless separately and explicitly authorized

## Review conversations

- [ ] Every review finding has a visible disposition reply before resolution
- [ ] Any externally blocked/admin-only step is documented rather than claimed complete
