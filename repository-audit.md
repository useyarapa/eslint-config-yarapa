# Repository Audit

## Scope

- ตรวจไฟล์เอกสาร Markdown, source, tests, fixtures, package metadata, workspace/config, CI, release files และไฟล์ที่ติดตามโดย Git ภายใต้ repository นี้
- ข้าม `/Users/joetakara/Developer/yarapa/eslint-config-yarapa/.agents/skills` ทั้งหมดตามข้อกำหนด และไม่ใช้เนื้อหาจาก path ดังกล่าวเป็นหลักฐาน
- ตรวจ `.claude/skills` เพราะอยู่นอกข้อยกเว้น; ไม่ถือว่าเป็น product source ของแพ็กเกจ
- รายงานนี้อ้างอิงสถานะ branch `clean-code` ณ การตรวจครั้งล่าสุด และแยกข้อเท็จจริงจากข้อเสนอเชิงอนุมานอย่างชัดเจน

## Executive summary

- พบ **9 excess / inconsistency candidates**: Knip รายงาน unused files 15 รายการและ unused dependencies 3 รายการ; ยังพบ root self-lint ที่ไล่ตรวจ generated Turbo cache และ fixture inventory ที่ไม่มี consumer
- พบ **5 missing / process gaps**: public README ว่าง, governance surfaces ว่าง, root self-lint ไม่อยู่ใน CI, Knip ไม่อยู่ใน CI และ fixture inventory ไม่มี executable validation
- `pnpm --filter eslint-config-yarapa test` ผ่าน **29/29 tests ใน 6 files**
- `pnpm --filter eslint-config-yarapa check-types` และ `pnpm --filter eslint-config-yarapa build` ผ่าน
- `pnpm lint` ไม่ผ่านด้วย **958 errors ใน 17 files**; output ส่วนใหญ่เกิดจาก `.turbo/cache` generated JSON ที่ root ESLint config ยังไม่ได้ ignore
- รายงานเดิมมีข้อผิดพลาด: อ้าง `packages/typescript-config-yarapa` และ `SECURITY.md` ซึ่งไม่มีอยู่ใน branch นี้, รายงาน test/lint จาก snapshot เก่า และนับ Knip findings ต่ำกว่าผลปัจจุบัน

## Excess / dead / inconsistent

### E1. Unused preset source files reported by Knip

- `packages/eslint-config-yarapa/src/configs/browser.ts:4-13` export `browser` แต่ไม่มี importer ที่ใช้งานจริง
- `packages/eslint-config-yarapa/src/configs/disableTypeChecked.ts:4-9` export `disableTypeChecked` แต่ไม่มี importer ที่ใช้งานจริง
- `packages/eslint-config-yarapa/src/configs/ignores.ts:2-15` ประกาศ ignore preset แต่ root config ใช้ `globalIgnores` ที่ `eslint.config.mjs:12-19` แทน
- `packages/eslint-config-yarapa/src/configs/internal/canonicalTestFileGlobs.ts:1-8` ไม่มี consumer
- `packages/eslint-config-yarapa/src/configs/presetNames.ts:1-16` ไม่มี consumer และไม่ได้อยู่ใน tsdown entries ที่ `packages/eslint-config-yarapa/tsdown.config.ts:5`
- Knip รายงานไฟล์ทั้ง 5 รายการเป็น unused files
- **การตีความ:** เป็น candidates สำหรับลบหรือ wire เข้าสู่ public/internal contract; ห้ามลบก่อนยืนยันว่าเป็น planned API

### E2. Unused fixture project files reported by Knip

Knip รายงานไฟล์ fixture เหล่านี้เป็น unused files:

- `packages/eslint-config-yarapa/fixtures/projects/ava/example.test.js:1`
- `packages/eslint-config-yarapa/fixtures/projects/mixed-runtime/browser.js:1`
- `packages/eslint-config-yarapa/fixtures/projects/mixed-runtime/node.js:1`
- `packages/eslint-config-yarapa/fixtures/projects/testing-library/example.test.js:1`
- `packages/eslint-config-yarapa/fixtures/projects/tooling-out-of-project/invalid.ts:1`
- `packages/eslint-config-yarapa/fixtures/projects/tooling-out-of-project/valid.ts:1`
- `packages/eslint-config-yarapa/fixtures/projects/typed/src/invalid.ts:1`
- `packages/eslint-config-yarapa/fixtures/projects/typed/src/valid.ts:1`
- `packages/eslint-config-yarapa/fixtures/projects/untyped/index.js:1`
- `packages/eslint-config-yarapa/fixtures/projects/vitest/example.test.js:1`

มีการใช้ typed fixtures บางส่วนจริงใน `packages/eslint-config-yarapa/test/behavior.test.ts:24-29` และ `packages/eslint-config-yarapa/test/config-validation.test.ts:16-19`; ดังนั้นผล Knip บางรายการควรตรวจเทียบกับ resolver/test semantics ก่อนลบ

### E3. Candidate unused dependencies

- Knip รายงาน `eslint-config-prettier` และ `eslint-import-resolver-typescript` ที่ `packages/eslint-config-yarapa/package.json:65-68` เป็น unused dependencies
- Knip รายงาน `@arethetypeswrong/cli` ที่ `packages/eslint-config-yarapa/package.json:81-84` เป็น unused devDependency
- **การตีความ:** เป็น candidates ไม่ใช่หลักฐานเพียงพอสำหรับลบทันที เพราะ dependency บางตัวอาจถูกโหลดผ่าน config/plugin หรือ script ที่ static analysis ไม่ trace ได้ครบ; ยืนยันด้วย package scripts และ packed-consumer verification ก่อน

### E4. Fixture inventory ไม่ถูก consume และอ้างไฟล์ที่ไม่มีอยู่

- `packages/eslint-config-yarapa/fixtures/cases.json:1-182` เก็บ matrix ของ preset และ paths เช่น `fixtures/valid/recommended/case.js` ที่ `cases.json:5-6` อ้างถึง
- ไม่พบ test/script ที่อ่าน `cases.json`; tests ใช้ paths และ source แบบ hard-coded ที่ `packages/eslint-config-yarapa/test/behavior.test.ts:24-29` และ `packages/eslint-config-yarapa/test/autofix.test.ts:44-107`
- directory ที่ inventory อ้างถึงมี `.gitkeep` เช่น `packages/eslint-config-yarapa/fixtures/valid/recommended/.gitkeep:1` แทน `case.js`
- **การตีความ:** inventory เป็น stale data หรือเป็น harness ที่ยังไม่ถูก wire; ควรเลือกทางเดียวระหว่างเติม consumer/fixtures กับลบ inventory และ placeholders

### E5. Generated Turbo cache ถูก root self-lint ตรวจ

- `.gitignore:17-18` ระบุ `.turbo` เป็น generated/cache output
- root ESLint ignores ที่ `eslint.config.mjs:12-19` ครอบคลุม `dist` และ `fixtures` แต่ไม่ครอบคลุม `.turbo`
- `pnpm lint` ล่าสุดรายงาน 958 errors ใน 17 files โดยไฟล์ที่มีจำนวนสูงสุดเป็น generated manifests ภายใต้ `.turbo/cache`, เช่น `.turbo/cache/1878b1560e2cfef7-manifest.json:1`
- **ข้อเท็จจริง:** generated cache ทำให้ self-lint ล้มเหลวและกลบ diagnostics ของ source จริง
- **ข้อเสนอ:** เพิ่ม ignore ที่ root config หรือปรับ lint target ให้ไม่รวม cache; เลือกวิธีที่ไม่ซ่อน source ที่ควรตรวจ

## Missing / process gaps

### M1. Public README ไม่มีเนื้อหา

- `README.md:1` เป็นไฟล์ว่าง 0 bytes
- package metadata ระบุว่าเป็น public package ที่ `packages/eslint-config-yarapa/package.json:1-10` และมี public exports ที่ `packages/eslint-config-yarapa/package.json:24-41`
- **ความมั่นใจสูง:** consumer ไม่มีเอกสารติดตั้ง วิธีใช้ profile หรือ compatibility contract จาก repository root
- `.claude/skills/caveman/README.md:51-52` ยังชี้ผู้อ่านกลับมายัง root README ทำให้ pointer นี้นำไปสู่เอกสารว่าง

### M2. Governance/documentation surfaces ว่าง

- `CODE_OF_CONDUCT.md:1` เป็นไฟล์ว่าง
- `.github/pull_request_template.md:1` เป็นไฟล์ว่าง
- **ความมั่นใจสูงในข้อเท็จจริง:** files มีอยู่แต่ไม่มีเนื้อหา; ความจำเป็นของแต่ละไฟล์เป็น product decision ไม่ใช่เหตุผลให้เพิ่ม generic boilerplate โดยอัตโนมัติ

### M3. CI ไม่ได้รัน repository self-lint

- root script `lint` build package แล้ว lint repository ผ่าน root config ที่ `package.json:9-13`
- CI lint job รันเพียง package build และ package lint ที่ `.github/workflows/ci.yml:20-30`
- `AGENTS.md:14-34` บันทึก root `pnpm lint` เป็น workflow แยกจาก package lint
- **ความมั่นใจสูง:** CI ไม่ตรวจ root config path; ผล `pnpm lint` ปัจจุบันแสดงว่าช่องว่างนี้ซ่อน failure จริงของ repository

### M4. CI ไม่มี Knip gate

- root มี script `knip` ที่ `package.json:10-12` และ config ที่ `knip.json:1-9`
- Knip ปัจจุบันรายงาน unused files 15 รายการและ unused dependencies 3 รายการ
- CI jobs ใน `.github/workflows/ci.yml:20-159` ไม่มี step รัน `pnpm knip`
- **ความมั่นใจปานกลาง:** หาก unused findings เป็น quality contract ควรเพิ่ม gate; หากเป็น intentional files ควร encode exclusions/ownership ใน config หรือเอกสาร

### M5. Fixture inventory ไม่มี executable validation

- inventory อยู่ที่ `packages/eslint-config-yarapa/fixtures/cases.json:1-182`
- tests ที่มีอยู่ใช้ fixture paths โดยตรง เช่น `packages/eslint-config-yarapa/test/behavior.test.ts:24-29` และ `packages/eslint-config-yarapa/test/config-validation.test.ts:16-19`; ไม่อ่าน inventory
- **ความมั่นใจปานกลาง:** การเปลี่ยน fixture หรือ `cases.json` สามารถ drift โดยไม่มี test failure ที่ชี้ตรงไปยัง inventory
- ทางเลือกที่ evidence-backed คือเพิ่ม test ตรวจ paths/expected rules หรือเอา inventory ที่ไม่ถูกใช้และ placeholders ออก

## ตรวจแล้วไม่พบปัญหาในขอบเขตที่ตรวจ

- public entrypoints ที่ build ตรงกับ exports: `packages/eslint-config-yarapa/tsdown.config.ts:5` และ `packages/eslint-config-yarapa/package.json:24-41`
- package จำกัดไฟล์ publish เป็น `dist` ที่ `packages/eslint-config-yarapa/package.json:43-47`
- tests, typecheck และ build ผ่านตามผลตรวจที่ระบุใน Executive summary; test configuration ครอบคลุม `test/**/*.test.ts` ที่ `packages/eslint-config-yarapa/vitest.config.ts:4-12`
- CI มี compatibility matrix สำหรับ Node/ESLint/TypeScript ที่ `.github/workflows/ci.yml:76-104`, framework profiles ที่ `.github/workflows/ci.yml:106-145` และ Windows consumer ที่ `.github/workflows/ci.yml:147-159`
- release pipeline verify ก่อน pack ที่ `.github/workflows/release.yml:66-91` และใช้ OIDC permission ตอน publish ที่ `.github/workflows/release.yml:93-121`
- `.gitignore:2-27` ครอบคลุม dependencies, coverage, Turbo และ build output; generated `.turbo`/`dist` จึงไม่ใช่ package source ที่ควร publish
- Changesets มีทั้ง flow สำหรับ release และ empty changeset ที่ `.changeset/README.md:1-18`
- ไม่ยืนยันรายงานเดิมเรื่อง `packages/typescript-config-yarapa` หรือ `SECURITY.md` เพราะสอง path นี้ไม่มีอยู่ใน branch นี้

## Verification record

คำสั่งหลักที่ใช้บน branch นี้:

- inventory ด้วย `find`/`git ls-files` โดยข้าม `.agents/skills`
- `pnpm --filter eslint-config-yarapa test` — 6 files, 29 tests passed
- `pnpm --filter eslint-config-yarapa check-types` — passed
- `pnpm --filter eslint-config-yarapa build` — passed
- `pnpm knip` — failed as expected because it reported 15 unused files and 3 unused dependencies
- `pnpm lint` — failed with 958 errors in 17 files, dominated by generated `.turbo/cache` JSON

## Constraints

- ไม่อ่าน ไม่ตรวจ และไม่อ้างเนื้อหาจาก `.agents/skills`
- ไม่ได้ตรวจ GitHub-side settings เช่น branch protection, required checks, npm Trusted Publishing configuration หรือสถานะจริงของ security features เพราะพิสูจน์จากไฟล์ใน repository ไม่ได้
- Knip findings เป็น static-analysis candidates; ก่อนลบ dependency/source ต้องยืนยัน public contract, dynamic loading และ packed-consumer behavior
- รายงานนี้เป็น audit ไม่ใช่คำสั่งให้ลบหรือเพิ่มไฟล์ทันที
