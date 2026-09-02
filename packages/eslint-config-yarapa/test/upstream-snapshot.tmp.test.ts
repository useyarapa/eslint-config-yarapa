import { configs as commentsConfigs } from "@eslint-community/eslint-plugin-eslint-comments";
import js from "@eslint/js";
import { configs as importXConfigs } from "eslint-plugin-import-x";
import { configs as jsdocConfigs } from "eslint-plugin-jsdoc";
import { configs as jsoncConfigs } from "eslint-plugin-jsonc";
import { configs as packageJsonConfigs } from "eslint-plugin-package-json";
import { configs as perfectionistConfigs } from "eslint-plugin-perfectionist";
import promisePlugin from "eslint-plugin-promise";
import { configs as regexpConfigs } from "eslint-plugin-regexp";
import securityPlugin from "eslint-plugin-security";
import { configs as tseslintConfigs } from "typescript-eslint";
import { describe, it } from "vitest";

/**
 * Temporary diagnostic used only to capture the exact pinned upstream rule
 * surfaces before replacing implicit recommended spreads with static YARAPA
 * policy. This file is removed before the implementation PR leaves Draft.
 */
describe("upstream rule snapshot", () => {
  it("prints pinned rule maps", () => {
    const securityConfigs = securityPlugin.configs;
    const snapshot = {
      commentsRecommended: commentsConfigs.recommended.rules,
      eslintRecommended: js.configs.recommended.rules,
      importRecommended: importXConfigs["flat/recommended"]?.rules,
      importTypescript: importXConfigs["flat/typescript"]?.rules,
      jsdocRecommendedJs: jsdocConfigs["flat/recommended-error"]?.rules,
      jsdocRecommendedTs:
        jsdocConfigs["flat/recommended-typescript-error"]?.rules,
      jsoncRecommended:
        jsoncConfigs["flat/recommended-with-jsonc"]?.map(config => config.rules),
      packageJsonRecommended: packageJsonConfigs.recommended?.rules,
      packageJsonStylistic: packageJsonConfigs.stylistic?.rules,
      perfectionistNatural:
        perfectionistConfigs["recommended-natural"]?.rules,
      promiseRecommended: promisePlugin.configs["flat/recommended"]?.rules,
      regexpRecommended: regexpConfigs["flat/recommended"]?.rules,
      securityRecommended: securityConfigs.recommended?.rules,
      typescriptRecommended: tseslintConfigs.recommended?.map(config => config.rules),
      typescriptRecommendedTypeChecked:
        tseslintConfigs.recommendedTypeChecked?.map(config => config.rules),
    };

    console.log(`YARAPA_UPSTREAM_SNAPSHOT=${JSON.stringify(snapshot)}`);
  });
});
