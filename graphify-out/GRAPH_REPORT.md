# Graph Report - pesqueiro-arrudas-front-main  (2026-09-11)

## Corpus Check
- 238 files · ~54,149 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1257 nodes · 2797 edges · 98 communities (80 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3a1e2a6e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- Reservations/index.tsx
- downloads.test.cjs
- package.json
- rules
- dependencies
- cn
- devDependencies
- Stock/index.tsx
- compilerOptions
- luxon
- DropdownMenuContent
- Order/layout.tsx
- IfoodOrder.ts
- Product
- Command/layout.tsx
- Command/index.tsx
- parseToBRL
- Commands/index.tsx
- CommandsList/index.tsx
- nookies
- Order
- IfoodOrders
- Reservations/layout.tsx
- ItemsTable/index.tsx
- Kitchen/index.tsx
- AppShell/layout.tsx
- SoldItems/layout.tsx
- PayProductModal/layout.tsx
- Order/index.tsx
- MergeDuplicatesModal/index.tsx
- buildSalesDashboardStats.ts
- SendToKitchenModal/index.tsx
- AddProductsModal
- SalesDashboard/layout.tsx
- PaymentModal/index.tsx
- MenuUsers/layout.tsx
- Commands
- ProductsService
- ProductsService
- AppShell/index.tsx
- AddItemModal/index.tsx
- AddProductModal
- Backend Compatibility and Reliability Review
- Repository Review
- Header/layout.tsx
- Cashier
- Project Overview (CLAUDE.md)
- resolveIfoodItemProduct.ts
- Admin
- serverApi.ts
- MenuUsers/index.tsx
- scripts
- OrdersList/layout.tsx
- @chakra-ui/react
- KitchenOrdersService
- SalesDashboard/NavHeader/index.tsx
- Repository Guidelines (AGENTS.md)
- IfoodOrders/index.tsx
- IfoodOrdersService
- CommandService
- AddCommandModal/index.tsx
- Commands/components/DeleteCommandModal/index.tsx
- sheet.tsx
- CheckOrderModal/index.tsx
- SalesDashboard
- P1: Operational HTTP Routes and Sockets Have No Application Authentication
- Frontend/Backend Compatibility Findings
- Command/services/KitchenService.ts
- P2: Error Propagation, Dates, and Inventory Need Follow-up
- P1: Upgrade Dependencies and Assess Deployment Exposure (Next.js 13.5.11 unsupported)
- EditModal
- Stock/components/NavHeader/index.tsx
- next.config.js
- config
- hello.ts
- loadTypeScript.cjs
- AddProductsModal/layout.tsx
- EditCommandModal/index.tsx
- StockService
- AddProductsModal/index.tsx
- next-env.d.ts
- Pesqueiro & Restaurante Arruda's (business)
- sounds.d.ts
- Coding Conventions (CLAUDE.md)
- Commit Conventions (CLAUDE.md)
- Vercel Logo (SVG)
- Local Development Setup
- DeleteItemModal/index.tsx
- cashiers.test.cjs
- findReservationConflicts.test.cjs
- getReservationDatePreset.test.cjs
- reports.test.cjs
- commandBalance.test.cjs
- findSimilarProductGroups.test.cjs
- payments.test.cjs
- AdminService

## God Nodes (most connected - your core abstractions)
1. `react` - 101 edges
2. `cn()` - 79 edges
3. `lucide-react` - 54 edges
4. `parseToBRL()` - 42 edges
5. `Button` - 39 edges
6. `@chakra-ui/react` - 38 edges
7. `Product` - 35 edges
8. `Command` - 30 edges
9. `Order` - 30 edges
10. `Modal()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `Two-Layer Auth Pattern (route-level cookie + role-level localStorage)` --semantically_similar_to--> `P1: Verify Server-Side Authorization (client-only isAuthorized/isAdmin checks insufficient)`  [INFERRED] [semantically similar]
  CLAUDE.md → docs/REPOSITORY_REVIEW.md
- `Dual UI System: Tailwind/shadcn primitives + Chakra UI coexistence` --references--> `Badge()`  [EXTRACTED]
  CLAUDE.md → src/components/ui/badge.tsx
- `Dual UI System: Tailwind/shadcn primitives + Chakra UI coexistence` --references--> `cn()`  [EXTRACTED]
  CLAUDE.md → src/lib/utils.ts
- `Kitchen/Bar Routing Category Lists Duplicated in Three Places` --references--> `SendToKitchenModal()`  [EXTRACTED]
  CLAUDE.md → src/pages-components/Command/components/SendToKitchenModal/index.tsx
- `Feature Module Pattern (index.tsx/layout.tsx/services/reducers)` --references--> `API_URL`  [EXTRACTED]
  CLAUDE.md → src/services/apiConfig.ts

## Import Cycles
- 3-file cycle: `src/pages-components/Stock/components/ItemsTable/index.tsx -> src/pages-components/Stock/index.tsx -> src/pages-components/Stock/layout.tsx -> src/pages-components/Stock/components/ItemsTable/index.tsx`
- 3-file cycle: `src/pages-components/Stock/components/NavHeader/index.tsx -> src/pages-components/Stock/index.tsx -> src/pages-components/Stock/layout.tsx -> src/pages-components/Stock/components/NavHeader/index.tsx`
- 3-file cycle: `src/pages-components/Commands/components/NavHeader/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/NavHeader/index.tsx`
- 3-file cycle: `src/pages-components/Commands/components/CommandsList/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/CommandsList/index.tsx`
- 3-file cycle: `src/pages-components/Command/components/NavHeader/index.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/NavHeader/index.tsx`
- 3-file cycle: `src/pages-components/Command/components/ProductsList/index.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/ProductsList/index.tsx`
- 4-file cycle: `src/pages-components/Stock/components/EditModal/index.tsx -> src/pages-components/Stock/index.tsx -> src/pages-components/Stock/layout.tsx -> src/pages-components/Stock/components/ItemsTable/index.tsx -> src/pages-components/Stock/components/EditModal/index.tsx`
- 4-file cycle: `src/pages-components/Stock/components/DeleteItemModal/index.tsx -> src/pages-components/Stock/index.tsx -> src/pages-components/Stock/layout.tsx -> src/pages-components/Stock/components/ItemsTable/index.tsx -> src/pages-components/Stock/components/DeleteItemModal/index.tsx`
- 4-file cycle: `src/pages-components/Kitchen/components/OrdersList/index.tsx -> src/pages-components/Kitchen/components/OrdersList/layout.tsx -> src/pages-components/Kitchen/index.tsx -> src/pages-components/Kitchen/layout.tsx -> src/pages-components/Kitchen/components/OrdersList/index.tsx`
- 4-file cycle: `src/pages-components/Commands/components/AddProductsModal/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/CommandsList/index.tsx -> src/pages-components/Commands/components/AddProductsModal/index.tsx`
- 4-file cycle: `src/pages-components/Commands/components/CommandsList/index.tsx -> src/pages-components/Commands/components/DeleteCommandModal/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/CommandsList/index.tsx`
- 4-file cycle: `src/pages-components/Commands/components/CommandsList/index.tsx -> src/pages-components/Commands/components/EditCommandModal/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/CommandsList/index.tsx`
- 4-file cycle: `src/pages-components/Command/components/ProductsList/PayProductModal/index.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/ProductsList/index.tsx -> src/pages-components/Command/components/ProductsList/PayProductModal/index.tsx`
- 4-file cycle: `src/pages-components/Command/components/ProductsList/index.tsx -> src/pages-components/Command/components/ProductsList/layout.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/ProductsList/index.tsx`
- 5-file cycle: `src/pages-components/Command/components/ProductsList/PayProductModal/index.tsx -> src/pages-components/Command/components/ProductsList/PayProductModal/layout.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/ProductsList/index.tsx -> src/pages-components/Command/components/ProductsList/PayProductModal/index.tsx`

## Hyperedges (group relationships)
- **P1 Payment/Data-Integrity Findings (Backend Review)** — docs_backend_review_p1_payment_bypass, docs_backend_review_p1_concurrent_payments, docs_backend_review_p1_command_closing_not_atomic, docs_backend_review_p1_cashier_trusts_client [EXTRACTED 1.00]
- **Kitchen/Bar Routing Category Lists Kept in Sync Across Three Locations** — claude_kitchen_bar_routing_duplication, src_pages_components_command_components_sendtokitchenmodal_index_sendtokitchenmodal, src_pages_components_command_components_addproductmodal_index_addproductmodal, backend_ifoodcontroller_ifoodcontroller [EXTRACTED 1.00]
- **Authorization Gap Traced Across CLAUDE.md, Repository Review, and Backend Review** — claude_auth_pattern, docs_repository_review_p1_verify_server_auth, docs_backend_review_p1_no_auth [INFERRED 0.85]

## Communities (98 total, 17 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (49): lucide-react, @radix-ui/react-label, react, react-hook-form, Button, LegacyButtonProps, Modal(), Props (+41 more)

### Community 1 - "Reservations/index.tsx"
Cohesion: 0.05
Nodes (45): @supabase/supabase-js, CONFIG, Props, CONFIG, Props, ReservationOperationalStatusBadge(), CONFIG, Props (+37 more)

### Community 2 - "downloads.test.cjs"
Cohesion: 0.22
Nodes (3): assert, loadTypeScript, test

### Community 3 - "package.json"
Cohesion: 0.04
Nodes (48): next, prettier, name, private, version, autoprefixer, clsx, cz-conventional-changelog (+40 more)

### Community 4 - "rules"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, typescript, next (+31 more)

### Community 5 - "dependencies"
Cohesion: 0.05
Nodes (38): dependencies, axios, @chakra-ui/react, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/modifiers, @dnd-kit/sortable (+30 more)

### Community 6 - "cn"
Cohesion: 0.15
Nodes (20): @radix-ui/react-separator, ModalLayout(), Props, SIZE_CLASSNAMES, DialogContent, DialogDescription, DialogFooter(), DialogHeader() (+12 more)

### Community 7 - "devDependencies"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, cz-conventional-changelog, eslint, eslint-config-airbnb, eslint-config-next, eslint-config-prettier, eslint-plugin-import (+19 more)

### Community 8 - "Stock/index.tsx"
Cohesion: 0.16
Nodes (9): Action, Stock(), handleDownload(), StockContextProps, StockLayout(), Action, productsReducer(), ProductsState (+1 more)

### Community 9 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowJs, allowUnreachableCode, allowUnusedLabels, baseUrl, declaration, esModuleInterop, forceConsistentCasingInFileNames (+17 more)

### Community 10 - "luxon"
Cohesion: 0.08
Nodes (29): Applied Fix: Shared HTTP/Socket Backend Config & Reliability, luxon, socket.io-client, bitter, manrope, socket, SocketContext, socketContextValue (+21 more)

### Community 11 - "DropdownMenuContent"
Cohesion: 0.17
Nodes (9): DropdownMenuContent, DropdownMenuItem, filterOptions, NavHeaderLayout(), Props, sortOptions, filterOptions, Props (+1 more)

### Community 12 - "Order/layout.tsx"
Cohesion: 0.24
Nodes (15): Table, TableBody, TableCell, TableHead, TableHeader, TableRow, productColumns, listColumns (+7 more)

### Community 13 - "IfoodOrder.ts"
Cohesion: 0.18
Nodes (10): IfoodBenefit, IfoodCustomer, IfoodDelivery, IfoodDeliveryAddress, IfoodOrderPayload, IfoodOrderTotal, IfoodPaymentCard, IfoodPaymentCash (+2 more)

### Community 14 - "Product"
Cohesion: 0.12
Nodes (22): AllProductsAction, ProductNoAmount, Props, SetAmountModal(), Props, Props, DeleteCommandModalLayout(), Props (+14 more)

### Community 15 - "Command/layout.tsx"
Cohesion: 0.18
Nodes (9): NavHeader(), AmountProduct, ProductsList(), handleActiveEditFishAmount(), handleUpdateProductAmount(), TODO: Verify if amount in stock is available, TODO: verify if when I'm decrementing the total will be less than total payed, CommandLayout() (+1 more)

### Community 16 - "Command/index.tsx"
Cohesion: 0.28
Nodes (7): DeleteCommandModal(), Command(), initialState, Props, StockProductsAction, productsReducer(), stockProductsReducer()

### Community 17 - "parseToBRL"
Cohesion: 0.13
Nodes (17): useClickOutsideToClose(), AddProductModalLayout(), FavoriteToggle(), filterOptions, ProductNoAmount, productsColumns, Props, ActiveEditFish (+9 more)

### Community 18 - "Commands/index.tsx"
Cohesion: 0.24
Nodes (7): Action, commandsReducer(), CommandsState, Action, State, stockProductsReducer(), ContextProps

### Community 19 - "CommandsList/index.tsx"
Cohesion: 0.38
Nodes (4): CommandsList(), NavHeader(), CommandsLayout(), Props

### Community 20 - "nookies"
Cohesion: 0.13
Nodes (8): nookies, Props, ReportError(), useCashierReport(), Cashier(), Props, Customers(), Props

### Community 21 - "Order"
Cohesion: 0.20
Nodes (12): Props, CompletedOrdersList(), Props, Props, Props, Props, OrdersList(), Props (+4 more)

### Community 22 - "IfoodOrders"
Cohesion: 0.20
Nodes (3): IfoodOrders(), handleCloseRejectModal(), handleConfirmReject()

### Community 23 - "Reservations/layout.tsx"
Cohesion: 0.15
Nodes (16): TabsContent, TabsList, TabsTrigger, canOpenCommand(), DATE_PRESET_OPTIONS, ENVIRONMENT_LABEL, formatDate(), formatTime() (+8 more)

### Community 24 - "ItemsTable/index.tsx"
Cohesion: 0.27
Nodes (8): Props, EditModalLayout(), Props, FavoriteStatus, Item, EMPTY_MENU_CONFIG, MenuConfig, uploadFileToPresignedUrl()

### Community 25 - "Kitchen/index.tsx"
Cohesion: 0.24
Nodes (7): Kitchen(), reconcileOrder(), KitchenLayout(), allOrdersReducer(), State, AllOrdersReducerAction, KitchenContextProps

### Community 26 - "AppShell/layout.tsx"
Cohesion: 0.24
Nodes (7): AppShellLayout(), NavList(), Props, navItems, Phase, RouteProgressBar(), useRouteChanging()

### Community 27 - "SoldItems/layout.tsx"
Cohesion: 0.20
Nodes (6): Props, SoldItems(), columns, ProductRenderProps, SoldItemsLayout(), CashierProduct

### Community 28 - "PayProductModal/layout.tsx"
Cohesion: 0.21
Nodes (13): DiscountModal(), handleCloseModal(), handleEditDiscount(), Props, DiscountLayout(), PayProductModal(), handleCloseModal(), handlePayProduct() (+5 more)

### Community 29 - "Order/index.tsx"
Cohesion: 0.39
Nodes (5): CheckOneOrder, CheckOneProduct, ReorderPayload, UpdateOrderFlags, OrderProduct

### Community 30 - "MergeDuplicatesModal/index.tsx"
Cohesion: 0.18
Nodes (11): MergeDuplicatesModal(), Props, MergeDuplicatesModalLayout(), extractSignature(), findSimilarProductGroups(), isSimilar(), levenshteinDistance(), normalize() (+3 more)

### Community 31 - "buildSalesDashboardStats.ts"
Cohesion: 0.22
Nodes (13): allPayments(), buildSalesDashboardStats(), canonicalWaiterName(), HourStat, ItemStat, MonthStat, RepeatCustomerStat, round2() (+5 more)

### Community 32 - "SendToKitchenModal/index.tsx"
Cohesion: 0.15
Nodes (10): categoriesToBarPrepare, categoriesToKitchenPrepare, Props, SendToKitchenModal(), StoreKitchen, SendToKitchenModalLayout(), OrderActions(), Props (+2 more)

### Community 33 - "AddProductsModal"
Cohesion: 0.33
Nodes (4): AddProductsModal(), handleAddProduct(), handleAddProductsInCommand(), handleCloseModal()

### Community 34 - "SalesDashboard/layout.tsx"
Cohesion: 0.25
Nodes (6): PIE_PALETTE, PieChart(), Props, SalesDashboardLayout(), SalesDashboardStats, ShareStat

### Community 35 - "PaymentModal/index.tsx"
Cohesion: 0.16
Nodes (12): CloseCommandModal(), handleCloseCommand(), Props, CloseCommandModalLayout(), PaymentModal(), handleCloseConfirmModal(), handleOpenCloseCommandModal(), Props (+4 more)

### Community 36 - "MenuUsers/layout.tsx"
Cohesion: 0.43
Nodes (6): Avatar, AvatarFallback, AvatarImage, formatDateTime(), initials(), MenuUsersLayout()

### Community 37 - "Commands"
Cohesion: 0.20
Nodes (3): DeleteCommandModal(), Commands(), CommandsService

### Community 40 - "AppShell/index.tsx"
Cohesion: 0.18
Nodes (11): AppShell(), Props, CashierLayout(), Props, columns, contarNomesRepetidos(), CustomersLayout(), Props (+3 more)

### Community 41 - "AddItemModal/index.tsx"
Cohesion: 0.27
Nodes (8): AddItemModal(), cleanFields(), handleChangeUnitPrice(), handleSubmit(), Props, AddItemModalLayout(), checkImageURL(), formatPrice()

### Community 42 - "AddProductModal"
Cohesion: 0.25
Nodes (6): IfoodController.js (backend, auto-routes accepted iFood orders), Kitchen/Bar Routing Category Lists Duplicated in Three Places, AddProductModal(), handleAddProduct(), handleAddProductsInCommand(), handleCloseModal()

### Community 43 - "Backend Compatibility and Reliability Review"
Cohesion: 0.22
Nodes (10): Backend Compatibility and Reliability Review, P1: Cashier Closing Trusts Client-Supplied Payment Records, P1: Command Closing Is Neither Idempotent Nor Atomic, P1: Concurrent Payments Can Overwrite Each Other, P1: Payment Validation Can Be Bypassed Through Direct API Calls, Applied: Safer Command Closing in the Frontend (GET-before-close, request lock), MongoDB: Atomicity and Transactions (write operations), CashierController.js (backend) (+2 more)

### Community 44 - "Repository Review"
Cohesion: 0.22
Nodes (9): Applied Fix: Monthly Reports Calculation Moved Out of Render, Repository Review, P3: Continue Maintainability Work (lint warnings, any types, CI, integration tests), Applied Fix: Payment History Query Deduplication & Stale-Response Handling, Applied Fix: Payment Validation, Cents-based Change Calculation, Resolved: Report Navigation Persistence (drop cashierByMonthObject localStorage), Validation Summary (17 regression tests, build, lint warnings), React useEffect Reference Guidance (+1 more)

### Community 45 - "Header/layout.tsx"
Cohesion: 0.22
Nodes (5): Header(), Props, headerButtons, HeaderLayout(), Props

### Community 46 - "Cashier"
Cohesion: 0.24
Nodes (10): emptyCashier, Props, NavHeader(), Props, NavHeaderLayout(), getCashierReport(), Cashier, CashierByMonth (+2 more)

### Community 47 - "Project Overview (CLAUDE.md)"
Cohesion: 0.33
Nodes (6): Coding Style & Naming Conventions (AGENTS.md), index.tsx/layout.tsx Presentation Split (AGENTS.md), Two-Layer Auth Pattern (route-level cookie + role-level localStorage), Feature Module Pattern (index.tsx/layout.tsx/services/reducers), Project Overview (CLAUDE.md), Dual UI System: Tailwind/shadcn primitives + Chakra UI coexistence

### Community 48 - "resolveIfoodItemProduct.ts"
Cohesion: 0.39
Nodes (6): iFood Item-to-Catalog-Product Matching (normalized name + remembered mapping), IfoodOrderItem, IfoodProductMapping, normalizeName(), stripIfoodToken(), resolveIfoodItemProduct()

### Community 49 - "Admin"
Cohesion: 0.28
Nodes (5): Admin(), handleCloseConfirmationModal(), handleCloseResetModal(), handleOpenResetModal(), handleResetSystem()

### Community 50 - "serverApi.ts"
Cohesion: 0.08
Nodes (12): CashierService, Pay, PaymentsService, UpdateCommand, KitchenService, CashierService, AuthService, CommandService (+4 more)

### Community 51 - "MenuUsers/index.tsx"
Cohesion: 0.23
Nodes (7): axios, MenuUsers(), Props, api, MenuUsersService, MenuUser, MenuUserFilters

### Community 52 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, commit, dev, lint, start, test, typecheck

### Community 53 - "OrdersList/layout.tsx"
Cohesion: 0.32
Nodes (6): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, DraggableOrder(), Props, Props

### Community 54 - "@chakra-ui/react"
Cohesion: 0.15
Nodes (10): @chakra-ui/react, DeleteProductModal(), handleCloseModal(), handleDeleteProduct(), Props, DeleteProductModalLayout(), DecreaseAmount, FavoriteStatus (+2 more)

### Community 56 - "SalesDashboard/NavHeader/index.tsx"
Cohesion: 0.29
Nodes (6): NavHeader(), Props, monthOptions, NavHeaderLayout(), Props, yearOptions

### Community 57 - "Repository Guidelines (AGENTS.md)"
Cohesion: 0.33
Nodes (7): Commit & Pull Request Guidelines (AGENTS.md), Project Structure & Module Organization, Repository Guidelines (AGENTS.md), Testing Guidelines (AGENTS.md), Regression Test Coverage Added (Node tests + typecheck script), Pesqueiro Arruda's Frontend README, Validation Commands (README)

### Community 58 - "IfoodOrders/index.tsx"
Cohesion: 0.23
Nodes (11): iFood Order-to-Command Naming Convention (table startsWith 'iFood #'), use-sound, DeliveryStatusBadge(), ItemSelection, SelectionsState, IfoodOrdersLayout(), ItemSelection, PAYMENT_METHOD_LABEL (+3 more)

### Community 61 - "AddCommandModal/index.tsx"
Cohesion: 0.25
Nodes (5): AddCommandInputs, AddCommandModal(), Props, AddCommandModalLayout(), CommandsContext

### Community 62 - "Commands/components/DeleteCommandModal/index.tsx"
Cohesion: 0.25
Nodes (6): Props, DeleteCommandModalLayout(), DecreaseAmount, FavoriteStatus, IncreaseAmount, VerifyAmount

### Community 63 - "sheet.tsx"
Cohesion: 0.33
Nodes (6): class-variance-authority, @radix-ui/react-dialog, SheetContent, SheetContentProps, SheetOverlay, sheetVariants

### Community 64 - "CheckOrderModal/index.tsx"
Cohesion: 0.33
Nodes (4): CheckOrderModal(), Props, CheckOrderModalLayout(), KitchenContext

### Community 66 - "P1: Operational HTTP Routes and Sockets Have No Application Authentication"
Cohesion: 0.40
Nodes (5): Security & Configuration (AGENTS.md), P1: Operational HTTP Routes and Sockets Have No Application Authentication, P1: Verify Server-Side Authorization (client-only isAuthorized/isAdmin checks insufficient), index.js (backend entrypoint, socket connections & error middleware), routes.js (backend)

### Community 67 - "Frontend/Backend Compatibility Findings"
Cohesion: 0.22
Nodes (9): Socket.IO Real-time Update Pattern (no central event bus), Frontend/Backend Compatibility Findings, kitchen-order-* Socket Event Contracts (created/updated/deleted payload shapes), Partial Payments Do Not Create a Payment Record (existing behavior), PUT /commands/:id?updateTotal=true contract, POST /kitchen/orders/reorder Declared by Frontend but Missing in Backend, Applied Fix: Socket Lifecycle Management (connect/disconnect in effect, per-subscription cleanup), PaymentsRepository.create (backend, Luxon UTC-3 DateTime) (+1 more)

### Community 68 - "Command/services/KitchenService.ts"
Cohesion: 0.22
Nodes (4): DiminishOrder, KitchenService, Product, Store

### Community 69 - "P2: Error Propagation, Dates, and Inventory Need Follow-up"
Cohesion: 0.50
Nodes (4): P2: Error Propagation, Dates, and Inventory Need Follow-up, /webhook/ifood/order Only Logs and Acknowledges, Does Not Persist or Authenticate, P2: Finish Asynchronous and Date Consistency Work ('pt-BR' used as zone, not locale), CashiersRepository.findAll(date) (backend)

### Community 70 - "P1: Upgrade Dependencies and Assess Deployment Exposure (Next.js 13.5.11 unsupported)"
Cohesion: 0.50
Nodes (4): P1: Upgrade Dependencies and Assess Deployment Exposure (Next.js 13.5.11 unsupported), GHSA-2xp9-vwfh-vxw4 (AVIF Image Optimization RCE), GHSA-p293-qw3h-jr36 (Windows Server RCE), Next.js Support Policy

### Community 71 - "EditModal"
Cohesion: 0.50
Nodes (4): EditModal(), handleMenuImageChange(), handleSubmit(), onClose()

### Community 72 - "Stock/components/NavHeader/index.tsx"
Cohesion: 0.25
Nodes (4): NavHeader(), Props, NavHeaderLayout(), StockContext

### Community 74 - "config"
Cohesion: 0.67
Nodes (3): path, config, commitizen

### Community 76 - "loadTypeScript.cjs"
Cohesion: 0.29
Nodes (6): typescript, { createRequire }, fs, path, ts, vm

### Community 77 - "AddProductsModal/layout.tsx"
Cohesion: 0.29
Nodes (5): FavoriteToggle(), filterOptions, ProductNoAmount, productsColumns, Props

### Community 78 - "EditCommandModal/index.tsx"
Cohesion: 0.29
Nodes (4): EditCommandInputs, EditCommandModal(), Props, EditCommandModalLayout()

### Community 80 - "AddProductsModal/index.tsx"
Cohesion: 0.33
Nodes (4): ProductNoAmount, Props, TODO: check if there are enough amount of product selected in stock, SetAmountModal()

### Community 89 - "DeleteItemModal/index.tsx"
Cohesion: 0.40
Nodes (5): DeleteItemModal(), handleCloseModal(), handleDeleteItem(), Props, DeleteItemModalLayout()

### Community 90 - "cashiers.test.cjs"
Cohesion: 0.33
Nodes (5): assert, cashiers, { groupCashiersByMonth }, loadTypeScript, test

### Community 91 - "findReservationConflicts.test.cjs"
Cohesion: 0.33
Nodes (4): assert, { findReservationConflicts }, loadTypeScript, test

### Community 92 - "getReservationDatePreset.test.cjs"
Cohesion: 0.33
Nodes (5): assert, { DateTime }, { getReservationDatePreset }, loadTypeScript, test

### Community 93 - "reports.test.cjs"
Cohesion: 0.40
Nodes (5): assert, createService(), grouping, loadTypeScript, test

### Community 94 - "commandBalance.test.cjs"
Cohesion: 0.40
Nodes (4): assert, { getCommandBalance }, loadTypeScript, test

### Community 95 - "findSimilarProductGroups.test.cjs"
Cohesion: 0.40
Nodes (4): assert, { findSimilarProductGroups }, loadTypeScript, test

### Community 96 - "payments.test.cjs"
Cohesion: 0.40
Nodes (4): assert, { calculatePayment }, loadTypeScript, test

## Knowledge Gaps
- **412 isolated node(s):** `root`, `browser`, `es2021`, `node`, `plugin:react/recommended` (+407 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 568 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Reservations/index.tsx`, `package.json`, `cn`, `Stock/index.tsx`, `luxon`, `DropdownMenuContent`, `Order/layout.tsx`, `Product`, `Command/layout.tsx`, `Command/index.tsx`, `parseToBRL`, `Commands/index.tsx`, `CommandsList/index.tsx`, `nookies`, `Order`, `Reservations/layout.tsx`, `ItemsTable/index.tsx`, `Kitchen/index.tsx`, `AppShell/layout.tsx`, `SoldItems/layout.tsx`, `PayProductModal/layout.tsx`, `Order/index.tsx`, `MergeDuplicatesModal/index.tsx`, `SendToKitchenModal/index.tsx`, `SalesDashboard/layout.tsx`, `PaymentModal/index.tsx`, `MenuUsers/layout.tsx`, `AppShell/index.tsx`, `AddItemModal/index.tsx`, `Header/layout.tsx`, `Cashier`, `MenuUsers/index.tsx`, `OrdersList/layout.tsx`, `@chakra-ui/react`, `SalesDashboard/NavHeader/index.tsx`, `IfoodOrders/index.tsx`, `AddCommandModal/index.tsx`, `Commands/components/DeleteCommandModal/index.tsx`, `sheet.tsx`, `CheckOrderModal/index.tsx`, `Stock/components/NavHeader/index.tsx`, `AddProductsModal/layout.tsx`, `EditCommandModal/index.tsx`, `AddProductsModal/index.tsx`, `DeleteItemModal/index.tsx`?**
  _High betweenness centrality (0.310) - this node is a cross-community bridge._
- **Why does `Repository Review` connect `Repository Review` to `P1: Operational HTTP Routes and Sockets Have No Application Authentication`, `Frontend/Backend Compatibility Findings`, `P2: Error Propagation, Dates, and Inventory Need Follow-up`, `P1: Upgrade Dependencies and Assess Deployment Exposure (Next.js 13.5.11 unsupported)`, `luxon`, `Backend Compatibility and Reliability Review`, `Repository Guidelines (AGENTS.md)`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `API_URL` connect `luxon` to `serverApi.ts`, `Project Overview (CLAUDE.md)`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `root`, `browser`, `es2021` to the rest of the system?**
  _412 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05516596540439458 - nodes in this community are weakly interconnected._
- **Should `Reservations/index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05242566510172144 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._