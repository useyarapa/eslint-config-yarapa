#!/usr/bin/env node

import process from "node:process";

import { checkCanonicalConfig } from "./check-canonical-config.js";

process.exitCode = checkCanonicalConfig(process.cwd()) ? 0 : 1;
