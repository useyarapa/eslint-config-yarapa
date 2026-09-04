import path from "node:path";
import { describe, expect, it } from "vitest";

import yarapa from "../src/index.js";
import nest from "../src/nest.js";
import next from "../src/next.js";
import react from "../src/react.js";
import { eslintForConfigs, packageRoot } from "./helpers/eslint.js";

const profiles = { nest, next, react, yarapa } as const;

describe("Flat Config validation", () => {
  it.each(Object.entries(profiles))(
    "resolves %s with ESLint itself",
    async (_name, profile) => {
      await expect(
        eslintForConfigs(profile).calculateConfigForFile(
          path.resolve(packageRoot, "fixtures/projects/typed/src/valid.ts"),
        ),
      ).resolves.toBeDefined();
    },
  );
});
