# Route Audit

The canonical page routes are the 51 paths listed below. The React shell uses the same IDs and paths from `src/data/views.ts`.

| Page range | Canonical paths |
|---:|---|
| 1-10 | `/views/view-01.html` through `/views/view-10.html` |
| 11-20 | `/views/view-11.html` through `/views/view-20.html` |
| 21-30 | `/views/view-21.html` through `/views/view-30.html` |
| 31-40 | `/views/view-31.html` through `/views/view-40.html` |
| 41-51 | `/views/view-41.html` through `/views/view-51.html` |

## Named route aliases

The route map in `src/data/views.ts` covers consumer, merchant, wholesale/B2B, and super-admin aliases, including:

- Consumer: `home`, `price-compare`, `cart`, `checkout`, `product-details`, `auth`, `verification`, `scanner`, `district-demand`, `requests`
- Merchant: `merchant-dashboard`, `inventory`, `orders`, `dispatch`, `customer-requests`, `merchant-portal`
- Wholesale/B2B: `wholesale`, `catalogue`, `rfqs`, `purchase-orders`, `dispatch-matrix`, `supplier-onboarding`, `procurement`, `requisitions`, `suppliers`, `contracts`, `quotation-matrix`, `analytics`
- Super Admin: `admin`, `revenue`, `forecasting`, `fraud`, `users`, `complaints`, `settings`, `audit-logs`, `rbac`

The shell also has an explicit mobile alias map in `src/App.tsx` so shared embedded links can resolve to mobile views when the current viewport mode is mobile.

## Route validation

- 51 manifest entries found.
- 51 matching HTML files found.
- 51 standalone route requests returned HTTP 200.
- Every route contained a document body and the shared runtime script.
