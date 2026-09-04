# รายงานการวิจัย: การตรวจสอบ Package Tarball และการทดสอบ Consumer Smoke Test ในโอเพนซอร์สชั้นนำ

> **วันที่จัดทำ:** 4 กันยายน 2026  
> **เป้าหมาย:** ศึกษาแนวทางปฏิบัติของโครงการ Open Source Software (OSS) ชั้นนำในการตรวจสอบความถูกต้องของ Publishable Artifacts (.tgz), การใช้งานเครื่องมือมาตรฐาน (publint, attw, pkg-pr-new) เปรียบเทียบกับ Custom Script สำหรับจำลอง Consumer ในสภาพแวดล้อมจริง และจัดทำข้อเสนอแนะเชิงสถาปัตยกรรมสำหรับ `eslint-config-yarapa`

---

## 1. บทสรุปผู้บริหาร (Executive Summary)

จากการสืบค้นและวิเคราะห์ซอร์สโค้ด เวิร์กโฟลว์ CI และสคริปต์ของโครงการ OSS ระดับโลกที่มีผู้ใช้งานสูง (เช่น `typescript-eslint`, `TanStack/query`, `vercel/next.js`, `facebook/react`, `facebook/docusaurus`, `withastro/astro`, `changesets`, `@antfu/eslint-config`, `eslint/eslint`, และ `hono`) พบข้อสรุปหลักดังนี้:

1. **ไม่มีเครื่องมือสากลตัวเดียว (No Universal Turnkey Tool) สำหรับ End-to-End Consumer Simulation:**
   - เครื่องมืออย่าง `publint` และ `@arethetypeswrong/cli` (`attw`) เป็นมาตรฐานอุตสาหกรรมสำหรับ **Static Metadata & Type Linter** แต่ทั้งคู่**ไม่ได้ติดตั้งแพ็กเกจลงในโปรเจกต์จำลองและไม่ได้รันโค้ดจริง (Runtime Execution)**
   - เมื่อต้องการทดสอบว่า "ถ้าผู้ใช้งาน `npm/pnpm install package.tgz` แล้วจะ import ได้จริงหรือไม่ รันผ่านจริงหรือไม่ มีปัญหา resolution หรือ peer dependency ชนกันหรือไม่" **โครงการ OSS ระดับแนวหน้าล้วนเขียน Bespoke Script / Custom Harness เสมอ**
2. **โครงการระดับนำใช้ Custom Pack & Install Harness อย่างแพร่หลาย:**
   - **`typescript-eslint`**: เขียน `packages/integration-tests/tools/pack-packages.ts` ทำการรัน `npm pack` ทุกแพ็กเกจใน monorepo ไปไว้ที่ไดเรกทอรีชั่วคราว (`tarballs`) สร้าง temporary pnpm workspace และสั่ง `pnpm install` tarball เหล่านั้นเพื่อรัน Integration Tests กับ Fixtures หลากหลายเวอร์ชัน
   - **`vercel/next.js`**: มีสคริปต์ `scripts/pack-next.ts` บีบอัด tarballs สำหรับการทดสอบในโปรเจกต์ภายนอก และมีเวิร์กโฟลว์ CI สำหรับรอและดาวน์โหลด preview tarball มาติดตั้งทดสอบใน environment จริง
   - **`facebook/react`**: มีชุดคำสั่ง `scripts/release/shared-commands/test-packaging-fixture.js` และ `fixtures/packaging/build-all.js` รันการทดสอบ build และ bundler ต่างๆ (Webpack, Browserify, RequireJS, SystemJS) กับ build artifact ก่อนปล่อยเวอร์ชันจริง
   - **`facebook/docusaurus`**: ใช้ Docker รัน Verdaccio (Private npm registry ชั่วคราว) สั่ง publish แพ็กเกจทั้งหมด แล้วรันสคริปต์สร้างเว็บไซต์จำลอง (`test-website`) อยู่นอก Monorepo เพื่อทดสอบการติดตั้งผ่านเครือข่ายจำลอง
   - **`@antfu/eslint-config`**: เขียนการทดสอบใน `test/fixtures.test.ts` โดยก๊อปปี้ fixture ออกไปยังโฟลเดอร์ชั่วคราว สร้าง `eslint.config.js` และรัน `npx eslint . --fix` ผ่าน child process เพื่อยืนยันพฤติกรรมจริง
3. **การประเมินสำหรับ `eslint-config-yarapa`:**
   - สคริปต์ `scripts/verify-tarball.mts` ในปัจจุบัน**สอดคล้องกับ Best Practice ของโครงการระดับแถวหน้าอย่างมาก** เพราะสามารถดักจับช่องโหว่ที่ Unit Tests และ Static Linters มองไม่เห็น เช่น Monorepo Symlink Leakage, Missing Files ใน `package.json#files`, Peer Dependency Incompatibilities, และ Node Native ESM Resolution Errors
   - แนะนำให้ปรับโครงสร้างเล็กน้อยเพื่อ DX ที่ดีขึ้น: แยก `publint` และ `attw` ออกมาเป็น npm scripts อิสระสำหรับรันแบบ Fast-fail และคง `test:consumer` (`verify-tarball.mts`) ไว้เป็น Gatekeeper หลักใน CI Matrix

---

## 2. การสำรวจโครงการ OSS ชั้นนำ (Case Studies from Real-World Projects)

### 2.1 `typescript-eslint`
- **โครงสร้างและการทำงาน:**
  - เป็น Monorepo ขนาดใหญ่ที่ใช้ pnpm และ Nx
  - ในแต่ละแพ็กเกจ (เช่น `@typescript-eslint/eslint-plugin`) มี target:
    ```bash
    pnpm pack --out attw-check.tgz && attw attw-check.tgz --profile node16 ...
    ```
  - **Custom Pack-and-Install Harness:** มีแพ็กเกจชื่อ `@typescript-eslint/integration-tests` โดยในไฟล์ `tools/pack-packages.ts` มีการทำงานที่เหมือนกับแนวคิดของ `verify-tarball.mts`:
    1. อ่านทุกแพ็กเกจที่เป็นสาธารณะใน `packages/`
    2. รัน `npm pack` ไปยังโฟลเดอร์ชั่วคราวใน OS (`os.tmpdir()/typescript-eslint-integration-tests/tarballs`)
    3. สร้าง temporary workspace พร้อมไฟล์ `package.json`, `.npmrc` (`node-linker=hoisted`), และ `pnpm-workspace.yaml` ที่ตั้งค่า `overrides` ชี้ไปยัง tarball ที่แพ็กไว้ (`file:...tarball.tgz`)
    4. สั่ง `pnpm install --no-frozen-lockfile` เพื่อแคชลง store
    5. ก๊อปปี้ Fixtures แต่ละตัวลงโฟลเดอร์ทดสอบ และสั่งรัน integration tests
- **แหล่งอ้างอิง:**
  - [`typescript-eslint/packages/eslint-plugin/package.json`](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/package.json)
  - [`typescript-eslint/packages/integration-tests/tools/pack-packages.ts`](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/integration-tests/tools/pack-packages.ts)

### 2.2 `TanStack/query`
- **โครงสร้างและการทำงาน:**
  - ใช้ `tsdown` ในการคอมไพล์โค้ด
  - ในแต่ละแพ็กเกจ (เช่น `@tanstack/query-core`) กำหนดคำสั่งใน `package.json`:
    ```json
    "test:build": "publint --strict && attw --pack"
    ```
  - มีโฟลเดอร์ `integrations/` (เช่น `react-nodenext`, `react-next-14`, `react-next-15`, `react-next-16`, `react-vite`, `react-webpack-4`, `react-webpack-5`)
  - แต่ละ integration จะจำลองโปรเจกต์ของ Consumer และทดสอบคอมไพล์ด้วย TypeScript หลายเวอร์ชัน (`ts56`, `ts57`, `ts58`, `ts59`, `ts70`)
- **แหล่งอ้างอิง:**
  - [`TanStack/query/packages/query-core/package.json`](https://github.com/TanStack/query/blob/main/packages/query-core/package.json)
  - [`TanStack/query/integrations/react-nodenext/package.json`](https://github.com/TanStack/query/blob/main/integrations/react-nodenext/package.json)

### 2.3 `vercel/next.js`
- **โครงสร้างและการทำงาน:**
  - มีสคริปต์ bespoke ขนาดใหญ่ชื่อ `scripts/pack-next.ts` สำหรับสร้างแพ็กเกจ tarball จากโปรเจกต์ภายใน (`next.tar`, `next-swc.tar`, `next-env.tar` ฯลฯ)
  - รองรับการ patching `package.json` ของโปรเจกต์ปลายทางเพื่อทดสอบ
  - ใน CI (`.github/workflows/build_and_test.yml`) มีขั้นตอนการอัปโหลด preview tarballs และมี job `wait-for-preview-tarball` เพื่อให้ deploy tests และ matrix tests อื่นๆ ดาวน์โหลด tarball จริงมาทดสอบกับ consumer apps
- **แหล่งอ้างอิง:**
  - [`vercel/next.js/scripts/pack-next.ts`](https://github.com/vercel/next.js/blob/canary/scripts/pack-next.ts)
  - [`vercel/next.js/.github/workflows/build_and_test.yml`](https://github.com/vercel/next.js/blob/canary/.github/workflows/build_and_test.yml)

### 2.4 `facebook/react`
- **โครงสร้างและการทำงาน:**
  - React มีโฟลเดอร์ `fixtures/packaging/` ซึ่งบรรจุ consumer scenarios หลากหลายประเภท เช่น `webpack`, `browserify`, `requirejs`, `systemjs`, `babel-standalone`
  - มีสคริปต์ `scripts/release/shared-commands/test-packaging-fixture.js` และ `fixtures/packaging/build-all.js`
  - เวิร์กโฟลว์ release จะรันการ build fixtures ติดตั้งและ bundle จริง จากนั้นเปิดเว็บเซิร์ฟเวอร์ชั่วคราว (`pushstate-server`) และใช้ Headless Chrome (`puppeteer`) เข้าไปตรวจสอบว่าหน้าเว็บแสดงผล `"Hello World!"` ได้ถูกต้อง ไม่มี runtime error
- **แหล่งอ้างอิง:**
  - [`facebook/react/scripts/release/shared-commands/test-packaging-fixture.js`](https://github.com/facebook/react/blob/main/scripts/release/shared-commands/test-packaging-fixture.js)
  - [`facebook/react/fixtures/packaging/build-all.js`](https://github.com/facebook/react/blob/main/fixtures/packaging/build-all.js)

### 2.5 `facebook/docusaurus`
- **โครงสร้างและการทำงาน:**
  - Docusaurus ใช้วิธีระดับ Local Registry Simulation ใน `admin/scripts/test-release.sh`
  - สคริปต์จะสตาร์ต Docker container ของ **Verdaccio** (พอร์ต 4873)
  - รัน `lerna publish` ด้วยเวอร์ชัน canary ชั่วคราวไปยัง registry จำลองนี้
  - สั่ง `create-docusaurus` สร้างโปรเจกต์ใหม่นอกไดเรกทอรี monorepo (`../test-website`) โดยชี้ `npm_config_registry` ไปยัง Verdaccio เพื่อให้ package manager (Yarn v1, npm, pnpm) ติดตั้งแพ็กเกจผ่าน protocol มาตรฐานเสมือนดาวน์โหลดจาก npmjs จริง
  - ทดสอบ build เว็บไซต์จริงใน CI Matrix
- **แหล่งอ้างอิง:**
  - [`facebook/docusaurus/admin/scripts/test-release.sh`](https://github.com/facebook/docusaurus/blob/main/admin/scripts/test-release.sh)
  - [`facebook/docusaurus/.github/workflows/tests-e2e.yml`](https://github.com/facebook/docusaurus/blob/main/.github/workflows/tests-e2e.yml)

### 2.6 `@antfu/eslint-config`
- **โครงสร้างและการทำงาน:**
  - เป็น Config คล้ายคลึงกับ `eslint-config-yarapa` (ESLint Flat Config บน ESM)
  - ใน `test/fixtures.test.ts` ใช้ฟังก์ชัน `runWithConfig` ที่ก๊อปปี้ input fixtures ไปยังโฟลเดอร์ชั่วคราว `_fixtures/<name>`
  - เขียนไฟล์ `eslint.config.js` ขึ้นมาใหม่ในโฟลเดอร์นั้น
  - สั่ง execute `npx eslint . --fix` ผ่าน child process (`tinyexec`) โดยตั้งค่า `cwd` ไปยังไดเรกทอรี fixture
  - ตรวจสอบ snapshot ของไฟล์ผลลัพธ์ว่า lint และ autofix ทำงานถูกต้อง
- **แหล่งอ้างอิง:**
  - [`antfu/eslint-config/test/fixtures.test.ts`](https://github.com/antfu/eslint-config/blob/main/test/fixtures.test.ts)

### 2.7 `changesets`
- **โครงสร้างและการทำงาน:**
  - ใช้ `publint` ตรวจสอบความถูกต้องของ package
  - ใช้ `pkg-pr-new` ใน GitHub Actions (`.github/workflows/pkg-pr-new.yml`) เพื่อ publish preview packages อัตโนมัติในทุก PR ที่ติด label `pkg.pr.new` ทำให้ผู้พัฒนาสามารถนำ tarball URL จาก CDN ไปทดสอบใน Consumer Repo จริงได้ทันที
- **แหล่งอ้างอิง:**
  - [`changesets/changesets/.github/workflows/pkg-pr-new.yml`](https://github.com/changesets/changesets/blob/main/.github/workflows/pkg-pr-new.yml)

### 2.8 โครงการอื่นๆ ในระบบนิเวศ (`withastro`, `eslint/eslint`, `hono`)
- **`withastro/astro`**: รัน `publint` ตรวจสอบทุกแพ็กเกจ และมีสคริปต์ `scripts/smoke/check.js` รัน `astro check` กับ examples ทั้งหมด
- **`eslint/eslint`**: ใช้ `attw --pack` ในคำสั่ง `lint:types` และมีไดเรกทอรี `tests/pnpm` จำลอง consumer ที่ติดตั้ง eslint ผ่าน `file:../..` เพื่อยืนยันว่าทำงานกับ pnpm strict resolution ได้
- **`honojs/hono`**: มี lifecycle `postbuild: publint` และรัน runtime tests แยกตาม matrix (Node, Deno, Bun, Cloudflare Workers, Fastly)

---

## 3. ภูมิทัศน์ของเครื่องมือในปัจจุบัน (Tooling Landscape)

| กลุ่มเครื่องมือ | รายชื่อเครื่องมือ | จุดเด่น | ขอบเขตและข้อจำกัด |
| :--- | :--- | :--- | :--- |
| **Static Packaging & Export Linters** | `publint` | ตรวจสอบโครงสร้างไฟล์, ฟิลด์ `exports`, `main`, `types`, และ extension mismatch ระหว่าง CJS/ESM อย่างรวดเร็ว | ตรวจเฉพาะ metadata และไฟล์ในดิสก์ ไม่ได้รันโค้ดจริง ไม่รู้ว่าเมื่อ runtime จะติด unresolved dependencies หรือไม่ |
| **TypeScript Definition Linters** | `@arethetypeswrong/cli` (`attw`) | ตรวจสอบการ match ของ declaration files (`.d.ts`, `.d.mts`) ภายใต้ resolution modes (`node16`, `nodenext`, `bundler`) ตรวจ Dual Package Hazard | เน้นเฉพาะ Type checking resolution ไม่ได้ทดสอบ JavaScript execution หรือ peer dependencies |
| **Ephemeral Release & Preview CDN** | `pkg-pr-new` (StackBlitz Labs) | ปล่อย Continuous Releases บน GitHub Actions โดยไม่ต้องใช้ npm token, สร้าง tarball URL ให้ทดสอบได้ทันที | เหมาะกับการแชร์ให้มนุษย์หรือ bot นำไปทดสอบภายนอก ไม่ได้เป็นตัวรัน test harness ในตัวมันเอง |
| **Local Package Registry Simulators** | `Verdaccio` | จำลอง npm registry เต็มรูปแบบ รองรับ `npm publish`, `npm install`, token auth, cache | หนักและช้า ต้องรัน daemon/docker เหมาะกับ monorepo ยักษ์ใหญ่ (เช่น Docusaurus, Angular) |
| **Bundlers with Built-in Export Rules** | `tsdown`, `unbuild`, `pkgroll`, `packemon` | สร้าง build output, source maps, และ dts พร้อมจัดโครงสร้างตาม best practice อัตโนมัติ | จัดการเฉพาะขั้นตอน Build ไม่ครอบคลุมขั้นตอน Consumer Validation |
| **Bespoke Pack & Smoke Test Scripts** | Custom Scripts (เช่น `verify-tarball.mts`, `pack-packages.ts`) | ควบคุมได้ 100%: แพ็ก `.tgz` จริง, สร้าง sandbox นอก workspace, ติดตั้งข้ามเวอร์ชัน dependencies, รัน process ย่อย | ต้องดูแลโค้ดสคริปต์เอง ต้องจัดการ cleanup โฟลเดอร์ชั่วคราว |

### สรุปคำถามสำคัญ: มีเครื่องมือสำเร็จรูปสำหรับ End-to-End Consumer Smoke Test หรือไม่?
**คำตอบคือ: ไม่มีเครื่องมือ CLI สำเร็จรูปที่เป็นมาตรฐานกลาง (No single standard CLI)**  
เนื่องจากความต้องการของ Consumer แต่ละประเภทแตกต่างกันอย่างสิ้นเชิง (เช่น ESLint config ต้องการให้รัน ESLint CLI, React library ต้องการให้ bundle ผ่าน Webpack/Vite, Backend library ต้องการให้รัน Node/Bun/Deno) ดังนั้น **การเขียน bespoke script ในการ pack -> temp dir -> install -> assert จึงเป็น "De Facto Industry Standard" ของโครงการโอเพนซอร์สชั้นนำเมื่อต้องการความมั่นใจระดับสูงสุด**

---

## 4. การวิเคราะห์ความเสี่ยงที่ Unit Test มองไม่เห็น (Failure Modes & Risks)

การทดสอบเฉพาะ Unit Tests (หรือการ import โค้ดจาก `src/` หรือ `dist/` ภายใน workspace เดียวกัน) มีช่องโหว่ร้ายแรงที่มักหลุดรอดไปถึง production ดังต่อไปนี้:

```
[ ช่องโหว่ที่เกิดขึ้นบ่อยใน npm packages ]
 ├── 1. Monorepo / Workspace Symlink Leakage
 │     └── โค้ดเรียกใช้ dependencies ที่อยู่ใน root devDependencies แต่ลืมใส่ใน package.json dependencies
 │         (Unit test ผ่านเพราะ pnpm symlink ไว้ให้ แต่ Consumer ภายนอกจะเจอ MODULE_NOT_FOUND)
 ├── 2. Omission from Tarball (package.json#files & .npmignore)
 │     └── ลืมรวมโฟลเดอร์หรือไฟล์สำคัญลงใน npm package
 │         (ทดสอบในเครื่องผ่านเพราะไฟล์มีอยู่จริงบนดิสก์ แต่ใน .tgz ไม่มีไฟล์นั้น)
 ├── 3. Native ESM Resolution & Export Map Hazards
 │     └── Node.js runtime ปฏิบัติต่อ package exports เข้มงวดมาก (ห้ามละเว้น .js extension, dual package hazard)
 │         (Unit test ที่รันผ่าน Vitest/Babel มักมี resolver พิเศษที่ผ่อนปรน ทำให้ไม่เจอบั๊ก)
 ├── 4. Peer Dependencies Matrix Collision
 │     └── เวอร์ชันของ peer dependencies (เช่น ESLint 10 vs ESLint 9, TypeScript 5 vs 6) ไม่เข้ากัน
 └── 5. Operating System Path Delimiters
       └── Windows vs POSIX path separator (`\` vs `/`) ใน export maps หรือ glob patterns
```

### ทำไม `verify-tarball.mts` ถึงป้องกันสิ่งเหล่านี้ได้?
1. **ตัดขาดจาก Workspace:** การสร้าง temporary directory นอก monorepo (`os.tmpdir()`) และสร้าง `package.json` เปล่าที่มีเฉพาะ tarball ทำให้ pnpm ไม่สามารถ fallback กลับไปหา dependencies ของ monorepo ได้
2. **ทดสอบจาก Artifact จริง:** การรัน `pnpm pack` นำเฉพาะไฟล์ที่จะถูก publish จริงขึ้นมาทดสอบ หาก `package.json#files` ขาด `dist/` หรือไฟล์ใดไป การทดสอบจะพังทันที
3. **รันบน Node.js Native Runtime:** การใช้ `node verify.mjs` โดยตรง ไม่ผ่าน bundler หรือ vitest transform ทำให้ได้การตรวจสอบ native ESM resolution 100%
4. **ครอบคลุม Matrix จริง:** เวิร์กโฟลว์ CI ของ `eslint-config-yarapa` ได้ทดสอบ runtime matrix ทั้ง Node versions, ESLint versions, TypeScript versions และ Frameworks (Next.js, React, Nest) บน tarball เดียวกันอย่างแท้จริง

---

## 5. การเปรียบเทียบเชิงเปรียบเทียบ (Tradeoff Analysis)

| มิติ | 1. Bespoke Script แบบครบวงจร (`verify-tarball.mts`) | 2. แยกเป็น npm scripts ย่อย (`plint`, `attw`, `smoke`) | 3. ใช้เฉพาะ Unit Tests & Build Check |
| :--- | :--- | :--- | :--- |
| **ความมั่นใจในการ Publish (Release Confidence)** | **สูงสุด (99-100%)** ครอบคลุมทั้ง metadata, types, tarball, install, และ runtime | **สูงมาก (95-98%)** หากมี smoke test script แยกต่างหาก | **ปานกลาง-ต่ำ (60-70%)** เสี่ยงเจอปัญหา missing files, import resolution บน npm |
| **ความเร็วในการวนรอบพัฒนา (Developer Velocity / DX)** | ช้ากว่าเมื่อรันทั้งลูป (ต้อง pack และ install ทุกครั้ง ใช้เวลาหลายวินาที) | เร็วมากสำหรับ fast-feedback (รัน `pnpm publint` หรือ `pnpm attw` รู้ผลในเสี้ยววินาที) | เร็วที่สุด แต่ขาด safety net |
| **ความชัดเจนของ Error Output** | หากคำสั่งรวมกัน อาจต้องดู log ยาวว่า fail ที่ publint, attw หรือ pnpm install | แสดงผล error ชัดเจนตรงจุดของเครื่องมือนั้นๆ ในขั้นตอน CI | เห็นเฉพาะ unit test failure |
| **ภาระในการบำรุงรักษา (Maintenance Overhead)** | ต้องดูแลโค้ด TypeScript/Node.js script เอง (~300 บรรทัด) | ค่าใช้จ่ายต่ำเพราะใช้ CLI สำเร็จรูป แต่ยังต้องมี script จำลอง consumer | ต่ำที่สุด |
| **ความสอดคล้องกับมาตรฐานอุตสาหกรรม** | สอดคล้องกับโปรเจกต์ระดับ Top-tier (`typescript-eslint`, `Next.js`, `React`) | สอดคล้องกับโปรเจกต์กระแสหลัก (`TanStack`, `Changesets`, `Astro`) | ไม่แนะนำสำหรับ publishable library ที่ต้องการความเสถียรสูง |

---

## 6. ข้อเสนอแนะเชิงสถาปัตยกรรมสำหรับ `eslint-config-yarapa`

จากการศึกษาบริบทของ `eslint-config-yarapa` ซึ่งมีเป้าหมายเป็น **Strict Banking Baseline** สำหรับสถาบันการเงินที่ต้องการความแน่นอน (Deterministic) และเสถียรภาพสูงสุด:

### 1. ยืนยันการคงอยู่ของ Consumer Smoke Test (Keep the Bespoke Script)
- **ห้ามยกเลิก `verify-tarball.mts`:** กลไกการ pack `.tgz` และติดตั้งลง sandbox เป็นปราการด่านสำคัญที่สุดที่รับรองว่า config จะไม่ระเบิดเมื่อถูกดึงไปใช้ใน repositories ภายนอก
- แนวทางนี้สอดคล้องกับโครงการชั้นนำอย่าง `typescript-eslint` (`pack-packages.ts`) และ `facebook/docusaurus` (`test-release.sh`)

### 2. ปรับสถาปัตยกรรมสคริปต์ให้แยกส่วน (Decouple for Better DX and Fast-Fail)
ปัจจุบัน `verify-tarball.mts` เรียก `publint` และ `attw` ฝังอยู่ภายใน `try-catch` บล็อกเดียวกัน แนะนำให้ปรับเป็น:
- เพิ่ม standalone npm scripts ใน `packages/eslint-config-yarapa/package.json`:
  ```json
  "check:publint": "publint",
  "check:attw": "attw --pack --profile esm-only"
  ```
- สิ่งนี้จะช่วยให้:
  - Developer สามารถรัน `pnpm check:publint` หรือ `pnpm check:attw` ได้ทันทีในระหว่างแก้โค้ด โดยไม่ต้องรอรันขั้นตอนติดตั้ง consumer ทั้งหมด
  - ใน CI สามารถรัน `check:publint` และ `check:attw` ในขั้นตอน build/lint job เพื่อให้ fast-fail ก่อนที่จะเข้าสู่ consumer matrix job
- ใน `verify-tarball.mts` สามารถคงการเรียก `publint` และ `attw` ไว้เพื่อเป็น self-contained verification สำหรับ local execution หรือแยกให้รับผิดชอบเฉพาะขั้นตอน **Pack & Consumer Simulation** เพียงอย่างเดียว

### 3. ประโยชน์ที่ได้รับสำหรับงานระดับ Banking Baseline
- **ป้องกัน Dependency Leakage:** ป้องกันไม่ให้ plugin หรือ rule ภายในเรียกหา peer dependency ที่ consumer ไม่ได้ลง
- **รับประกัน Compatibility Matrix:** ตรวจสอบให้มั่นใจว่าทั้งโปรเจกต์ที่ใช้ Node 24, TypeScript 5/6, ESLint 10, รวมถึง Next.js / Nest / React จะติดตั้งและทำงานร่วมกับ config ได้โดยไม่เกิด semantic versioning drift

---

## 7. แหล่งอ้างอิงปฐมภูมิ (Primary Sources & References)

1. **TypeScript ESLint:**
   - Monorepo attw target: [eslint-plugin/package.json](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/package.json)
   - Integration Pack Harness: [packages/integration-tests/tools/pack-packages.ts](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/integration-tests/tools/pack-packages.ts)
2. **TanStack Query:**
   - Package test:build script: [packages/query-core/package.json](https://github.com/TanStack/query/blob/main/packages/query-core/package.json)
   - Matrix Integration Consumer: [integrations/react-nodenext/package.json](https://github.com/TanStack/query/blob/main/integrations/react-nodenext/package.json)
3. **Vercel Next.js:**
   - Packing script: [scripts/pack-next.ts](https://github.com/vercel/next.js/blob/canary/scripts/pack-next.ts)
   - CI Workflow: [.github/workflows/build_and_test.yml](https://github.com/vercel/next.js/blob/canary/.github/workflows/build_and_test.yml)
4. **Facebook React:**
   - Packaging Fixtures Runner: [scripts/release/shared-commands/test-packaging-fixture.js](https://github.com/facebook/react/blob/main/scripts/release/shared-commands/test-packaging-fixture.js)
   - Fixture Build Script: [fixtures/packaging/build-all.js](https://github.com/facebook/react/blob/main/fixtures/packaging/build-all.js)
5. **Facebook Docusaurus:**
   - Local Verdaccio Release Harness: [admin/scripts/test-release.sh](https://github.com/facebook/docusaurus/blob/main/admin/scripts/test-release.sh)
   - E2E Tests Workflow: [.github/workflows/tests-e2e.yml](https://github.com/facebook/docusaurus/blob/main/.github/workflows/tests-e2e.yml)
6. **Anthony Fu ESLint Config:**
   - Subprocess Fixtures Runner: [test/fixtures.test.ts](https://github.com/antfu/eslint-config/blob/main/test/fixtures.test.ts)
7. **Changesets:**
   - CI & pkg-pr-new workflows: [.github/workflows/ci.yml](https://github.com/changesets/changesets/blob/main/.github/workflows/ci.yml) & [pkg-pr-new.yml](https://github.com/changesets/changesets/blob/main/.github/workflows/pkg-pr-new.yml)
8. **เครื่องมือมาตรฐาน:**
   - Publint: [https://publint.dev](https://publint.dev) และ [GitHub: publint](https://github.com/bluwy/publint)
   - Are The Types Wrong: [https://arethetypeswrong.github.io](https://arethetypeswrong.github.io) และ [GitHub: @arethetypeswrong/cli](https://github.com/arethetypeswrong/arethetypeswrong)
   - pkg-pr-new: [https://pkg.pr.new](https://pkg.pr.new) และ [GitHub: stackblitz-labs/pkg.pr.new](https://github.com/stackblitz-labs/pkg.pr.new)
