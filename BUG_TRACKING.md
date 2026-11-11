# VeriGrocery AI Bug Tracking

| ID | Severity | Area | Finding | Status | Evidence |
|---|---|---|---|---|---|
| BUG-001 | High | Toolchain | `vite@8` could not resolve the declared `esbuild@^0.25.0` peer range. | Fixed | `npm install`, `npm run lint`, and `npm run build` pass after updating `package.json`. |
| BUG-002 | Medium | Document metadata | 38 standalone views had no `<title>`. | Fixed | All 51 view documents now contain descriptive titles. |
| BUG-003 | Medium | Document metadata | Four merchant mobile views used the generic `VeriGrocery Merchant Hub` title. | Fixed | Views 23-26 now use manifest-specific titles. |
| BUG-004 | High | Currency encoding | 1,522 hardcoded Rupee literals were stored as the mojibake string `â‚¹` across 38 source HTML documents and one static AI Studio export. | Fixed | Replaced only the corrupted Rupee sequence with the UTF-8 `₹` character; numeric values and layout were preserved. |
| BUG-005 | Medium | Currency formatting | Runtime cart, tax, delivery, promo, and total values manually concatenated the Rupee symbol and locale output. | Fixed | Added `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` formatters in `src/utils/currency.ts` and the shared standalone runtime. |
| OBS-001 | Low | Delivery/performance | Standalone views load Tailwind from the CDN and emit the documented production warning. | Open observation | Browser smoke pass captured the warning on rendered views. |

No unverified rendering or routing defect was promoted to a bug. The smoke pass reported no HTTP failures, missing bodies, or missing shared runtime loads.

## Currency verification

- All HTML documents already declare UTF-8 with a charset meta tag.
- Source files were rewritten as UTF-8 without BOM during the literal repair.
- `₹95`, `₹124`, `₹190`, `₹1,214`, `₹10,000`, and `₹1,00,000` were verified with the Indian locale formatter.
- A source/runtime search after the fix found zero `â‚¹` occurrences (the only remaining text matches are the literal root-cause description in this tracking document).
