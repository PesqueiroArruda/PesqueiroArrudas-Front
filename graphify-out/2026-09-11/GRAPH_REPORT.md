# Graph Report - pesqueiro-arrudas-front-main  (2026-09-11)

## Corpus Check
- 230 files · ~52,004 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1201 nodes · 2649 edges · 89 communities (68 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.86)
- Token cost: 214,907 input · 0 output

## Community Hubs (Navigation)
- UI Primitives & App Shell
- Reservations Feature Module
- Test Suite
- Project Dependencies Manifest
- ESLint Configuration
- Frontend Dependency List
- Modal & UI Primitives
- Dev Tooling Dependencies
- Stock Merge Duplicates Modal
- TypeScript Configuration
- Cashier Closing Flow
- Stock Filter Nav Header
- Table UI Primitives
- iFood Orders Screen
- Add Product Modal (Command)
- Command Products List
- Command Page & Printing
- Add Product Modal Layout
- Commands State & Delete Modal
- Commands List & Edit Modal
- Cashier Report Page
- Kitchen Completed Orders List
- iFood Order Actions
- Reservations Filters & Tabs
- Stock Delete Item Modal
- Kitchen Order Reducer
- Route Navigation Progress Bar
- Sold Items Page
- Close Command Modal
- Kitchen Order Actions & Service
- Merge Duplicate Products Logic
- Sales Dashboard Stats Builder
- Send To Kitchen Modal
- Commands Add Products Modal
- Sales Dashboard Charts
- Command Payment Modal
- App Shell Layout & Nav
- Commands Page Entry
- Command Products Service
- Commands Products Service
- Closed Cashiers List
- Stock Add Item Modal
- iFood Routing & Add Product
- Backend P1 Findings (Payments)
- Applied Fixes (Reports & Payments)
- App Header Component
- Cashier Report Types & Hook
- Coding Conventions & Command Service
- iFood Product Name Matching
- Admin Page
- Admin & Payments Services
- Login Feature
- NPM Scripts
- Draggable Kitchen Order Card
- Home Page
- Kitchen Orders Service
- Sales Dashboard Nav Header
- Repository Guidelines (AGENTS.md)
- Architecture Overview (CLAUDE.md)
- Products List Layout & Hook
- Command Service Methods
- Add Command Modal
- Cashier Report Download
- Sheet UI Primitive
- Kitchen Check Order Modal
- Sales Dashboard Access Page
- Backend Auth Gap Findings
- Frontend/Backend Contract Findings
- Kitchen Service Methods
- Backend P2 Follow-ups
- Dependency Security Findings
- Stock Edit Item Modal
- Stock Search & Filter Handlers
- Next.js Config
- Commitizen Config
- Sample API Route
- Cashier Feature Service
- Commands Kitchen Service
- Customers Cashier Service
- Home Payments Service
- Sold Items Cashier Service
- Next.js Env Types
- Pesqueiro Arruda's Brand
- Sound Asset Types
- Coding Conventions Note
- Commit Conventions Note
- Vercel Starter Logo
- Local Dev Setup Docs

## God Nodes (most connected - your core abstractions)
1. `react` - 99 edges
2. `cn()` - 79 edges
3. `lucide-react` - 52 edges
4. `parseToBRL()` - 42 edges
5. `Button` - 37 edges
6. `@chakra-ui/react` - 36 edges
7. `Product` - 35 edges
8. `Order` - 30 edges
9. `Command` - 29 edges
10. `Modal()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Applied Fix: Shared HTTP/Socket Backend Config & Reliability` --references--> `API_URL`  [EXTRACTED]
  docs/REPOSITORY_REVIEW.md → src/services/apiConfig.ts
- `Two-Layer Auth Pattern (route-level cookie + role-level localStorage)` --semantically_similar_to--> `P1: Verify Server-Side Authorization (client-only isAuthorized/isAdmin checks insufficient)`  [INFERRED] [semantically similar]
  CLAUDE.md → docs/REPOSITORY_REVIEW.md
- `iFood Order-to-Command Naming Convention (table startsWith 'iFood #')` --references--> `DeliveryStatusBadge()`  [EXTRACTED]
  CLAUDE.md → src/components/DeliveryStatusBadge/index.tsx
- `Dual UI System: Tailwind/shadcn primitives + Chakra UI coexistence` --references--> `Badge()`  [EXTRACTED]
  CLAUDE.md → src/components/ui/badge.tsx
- `Dual UI System: Tailwind/shadcn primitives + Chakra UI coexistence` --references--> `cn()`  [EXTRACTED]
  CLAUDE.md → src/lib/utils.ts

## Import Cycles
- 3-file cycle: `src/pages-components/Stock/components/ItemsTable/index.tsx -> src/pages-components/Stock/index.tsx -> src/pages-components/Stock/layout.tsx -> src/pages-components/Stock/components/ItemsTable/index.tsx`
- 3-file cycle: `src/pages-components/Stock/components/NavHeader/index.tsx -> src/pages-components/Stock/index.tsx -> src/pages-components/Stock/layout.tsx -> src/pages-components/Stock/components/NavHeader/index.tsx`
- 3-file cycle: `src/pages-components/Commands/components/CommandsList/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/CommandsList/index.tsx`
- 3-file cycle: `src/pages-components/Commands/components/NavHeader/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/NavHeader/index.tsx`
- 3-file cycle: `src/pages-components/Command/components/NavHeader/index.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/NavHeader/index.tsx`
- 3-file cycle: `src/pages-components/Command/components/ProductsList/index.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/ProductsList/index.tsx`
- 4-file cycle: `src/pages-components/Stock/components/DeleteItemModal/index.tsx -> src/pages-components/Stock/index.tsx -> src/pages-components/Stock/layout.tsx -> src/pages-components/Stock/components/ItemsTable/index.tsx -> src/pages-components/Stock/components/DeleteItemModal/index.tsx`
- 4-file cycle: `src/pages-components/Stock/components/EditModal/index.tsx -> src/pages-components/Stock/index.tsx -> src/pages-components/Stock/layout.tsx -> src/pages-components/Stock/components/ItemsTable/index.tsx -> src/pages-components/Stock/components/EditModal/index.tsx`
- 4-file cycle: `src/pages-components/Kitchen/components/OrdersList/index.tsx -> src/pages-components/Kitchen/components/OrdersList/layout.tsx -> src/pages-components/Kitchen/index.tsx -> src/pages-components/Kitchen/layout.tsx -> src/pages-components/Kitchen/components/OrdersList/index.tsx`
- 4-file cycle: `src/pages-components/Commands/components/AddProductsModal/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/CommandsList/index.tsx -> src/pages-components/Commands/components/AddProductsModal/index.tsx`
- 4-file cycle: `src/pages-components/Commands/components/CommandsList/index.tsx -> src/pages-components/Commands/components/DeleteCommandModal/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/CommandsList/index.tsx`
- 4-file cycle: `src/pages-components/Commands/components/CommandsList/index.tsx -> src/pages-components/Commands/components/EditCommandModal/index.tsx -> src/pages-components/Commands/index.tsx -> src/pages-components/Commands/layout.tsx -> src/pages-components/Commands/components/CommandsList/index.tsx`
- 4-file cycle: `src/pages-components/Command/components/ProductsList/PayProductModal/index.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/ProductsList/index.tsx -> src/pages-components/Command/components/ProductsList/PayProductModal/index.tsx`
- 4-file cycle: `src/pages-components/Command/components/ProductsList/index.tsx -> src/pages-components/Command/components/ProductsList/layout.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/ProductsList/index.tsx`
- 5-file cycle: `src/pages-components/Command/components/ProductsList/PayProductModal/index.tsx -> src/pages-components/Command/components/ProductsList/PayProductModal/layout.tsx -> src/pages-components/Command/index.tsx -> src/pages-components/Command/layout.tsx -> src/pages-components/Command/components/ProductsList/index.tsx -> src/pages-components/Command/components/ProductsList/PayProductModal/index.tsx`

## Hyperedges (group relationships)
- **Kitchen/Bar Routing Category Lists Kept in Sync Across Three Locations** — claude_kitchen_bar_routing_duplication, src_pages_components_command_components_sendtokitchenmodal_index_sendtokitchenmodal, src_pages_components_command_components_addproductmodal_index_addproductmodal, backend_ifoodcontroller_ifoodcontroller [EXTRACTED 1.00]
- **P1 Payment/Data-Integrity Findings (Backend Review)** — docs_backend_review_p1_payment_bypass, docs_backend_review_p1_concurrent_payments, docs_backend_review_p1_command_closing_not_atomic, docs_backend_review_p1_cashier_trusts_client [EXTRACTED 1.00]
- **Authorization Gap Traced Across CLAUDE.md, Repository Review, and Backend Review** — claude_auth_pattern, docs_repository_review_p1_verify_server_auth, docs_backend_review_p1_no_auth [INFERRED 0.85]

## Communities (89 total, 20 thin omitted)

### Community 0 - "UI Primitives & App Shell"
Cohesion: 0.06
Nodes (50): lucide-react, react, react-hook-form, AppShell(), Props, Button, LegacyButtonProps, DeliveryStatusBadge() (+42 more)

### Community 1 - "Reservations Feature Module"
Cohesion: 0.06
Nodes (36): axios, class-variance-authority, @supabase/supabase-js, CONFIG, Props, CONFIG, Props, ReservationOperationalStatusBadge() (+28 more)

### Community 2 - "Test Suite"
Cohesion: 0.04
Nodes (35): typescript, assert, cashiers, { groupCashiersByMonth }, loadTypeScript, test, assert, { getCommandBalance } (+27 more)

### Community 3 - "Project Dependencies Manifest"
Cohesion: 0.04
Nodes (44): next, prettier, name, private, version, autoprefixer, clsx, cz-conventional-changelog (+36 more)

### Community 4 - "ESLint Configuration"
Cohesion: 0.05
Nodes (39): jsx, env, browser, es2021, node, extends, typescript, next (+31 more)

### Community 5 - "Frontend Dependency List"
Cohesion: 0.05
Nodes (38): dependencies, axios, @chakra-ui/react, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/modifiers, @dnd-kit/sortable (+30 more)

### Community 6 - "Modal & UI Primitives"
Cohesion: 0.13
Nodes (22): @radix-ui/react-label, @radix-ui/react-separator, ModalLayout(), Props, SIZE_CLASSNAMES, DialogContent, DialogDescription, DialogFooter() (+14 more)

### Community 7 - "Dev Tooling Dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, cz-conventional-changelog, eslint, eslint-config-airbnb, eslint-config-next, eslint-config-prettier, eslint-plugin-import (+19 more)

### Community 8 - "Stock Merge Duplicates Modal"
Cohesion: 0.12
Nodes (13): Props, MergeDuplicatesModalLayout(), Action, Stock(), handleDownload(), StockContextProps, StockLayout(), Action (+5 more)

### Community 9 - "TypeScript Configuration"
Cohesion: 0.08
Nodes (25): compilerOptions, allowJs, allowUnreachableCode, allowUnusedLabels, baseUrl, declaration, esModuleInterop, forceConsistentCasingInFileNames (+17 more)

### Community 10 - "Cashier Closing Flow"
Cohesion: 0.18
Nodes (13): luxon, CashierLayout(), CloseCashier(), Props, CloseCashierLayout(), Props, PayedCommands(), PayedCommandsLayout() (+5 more)

### Community 11 - "Stock Filter Nav Header"
Cohesion: 0.10
Nodes (15): DropdownMenuContent, DropdownMenuItem, filterOptions, NavHeaderLayout(), Props, sortOptions, filterOptions, NavHeaderLayout() (+7 more)

### Community 12 - "Table UI Primitives"
Cohesion: 0.25
Nodes (15): Table, TableBody, TableCell, TableHead, TableHeader, TableRow, productColumns, listColumns (+7 more)

### Community 13 - "iFood Orders Screen"
Cohesion: 0.12
Nodes (17): ItemSelection, SelectionsState, IfoodOrdersLayout(), Props, IfoodBenefit, IfoodCancellationReason, IfoodCustomer, IfoodDelivery (+9 more)

### Community 14 - "Add Product Modal (Command)"
Cohesion: 0.14
Nodes (15): AllProductsAction, ProductNoAmount, Props, SetAmountModal(), Props, Props, State, Action (+7 more)

### Community 15 - "Command Products List"
Cohesion: 0.12
Nodes (14): @chakra-ui/react, NavHeader(), AmountProduct, ProductsList(), handleActiveEditFishAmount(), handleUpdateProductAmount(), TODO: Verify if amount in stock is available, TODO: verify if when I'm decrementing the total will be less than total payed (+6 more)

### Community 16 - "Command Page & Printing"
Cohesion: 0.13
Nodes (13): react-to-print, DeleteCommandModal(), DeleteProductModal(), handleCloseModal(), handleDeleteProduct(), Command(), initialState, Props (+5 more)

### Community 17 - "Add Product Modal Layout"
Cohesion: 0.13
Nodes (14): AddProductModalLayout(), FavoriteToggle(), filterOptions, ProductNoAmount, productsColumns, Props, AddProductModalLayout(), FavoriteToggle() (+6 more)

### Community 18 - "Commands State & Delete Modal"
Cohesion: 0.15
Nodes (14): Props, Props, DeleteCommandModalLayout(), Props, ContextProps, Props, Action, commandsReducer() (+6 more)

### Community 19 - "Commands List & Edit Modal"
Cohesion: 0.18
Nodes (11): CommandsList(), Props, DeleteCommandModalLayout(), EditCommandInputs, EditCommandModal(), Props, EditCommandModalLayout(), NavHeader() (+3 more)

### Community 20 - "Cashier Report Page"
Cohesion: 0.14
Nodes (8): ReportError(), useCashierReport(), Cashier(), Props, Customers(), Props, contarNomesRepetidos(), CustomersLayout()

### Community 21 - "Kitchen Completed Orders List"
Cohesion: 0.16
Nodes (14): Props, Props, CompletedOrdersList(), Props, Props, Props, Props, OrdersList() (+6 more)

### Community 22 - "iFood Order Actions"
Cohesion: 0.13
Nodes (4): IfoodOrders(), handleCloseRejectModal(), handleConfirmReject(), IfoodOrdersService

### Community 23 - "Reservations Filters & Tabs"
Cohesion: 0.20
Nodes (12): @radix-ui/react-tabs, TabsContent, TabsList, TabsTrigger, HomeLayout(), Props, ENVIRONMENT_LABEL, formatDate() (+4 more)

### Community 24 - "Stock Delete Item Modal"
Cohesion: 0.20
Nodes (11): DeleteItemModal(), handleCloseModal(), handleDeleteItem(), Props, DeleteItemModalLayout(), Props, EditModalLayout(), Props (+3 more)

### Community 25 - "Kitchen Order Reducer"
Cohesion: 0.22
Nodes (8): react-scroll, use-sound, Kitchen(), reconcileOrder(), allOrdersReducer(), State, AllOrdersReducerAction, KitchenContextProps

### Community 26 - "Route Navigation Progress Bar"
Cohesion: 0.16
Nodes (11): socket.io-client, NavList(), Phase, RouteProgressBar(), useRouteChanging(), bitter, manrope, socket (+3 more)

### Community 27 - "Sold Items Page"
Cohesion: 0.16
Nodes (9): Props, Props, Props, SoldItems(), columns, ProductRenderProps, Props, SoldItemsLayout() (+1 more)

### Community 28 - "Close Command Modal"
Cohesion: 0.18
Nodes (11): CloseCommandModal(), handleCloseCommand(), Props, CloseCommandModalLayout(), DiscountModal(), handleCloseModal(), handleEditDiscount(), Props (+3 more)

### Community 29 - "Kitchen Order Actions & Service"
Cohesion: 0.23
Nodes (9): OrderActionsLayout(), DiminishOrder, Product, Store, CheckOneOrder, CheckOneProduct, ReorderPayload, UpdateOrderFlags (+1 more)

### Community 30 - "Merge Duplicate Products Logic"
Cohesion: 0.21
Nodes (9): MergeDuplicatesModal(), extractSignature(), findSimilarProductGroups(), isSimilar(), levenshteinDistance(), normalize(), ProductLike, Signature (+1 more)

### Community 31 - "Sales Dashboard Stats Builder"
Cohesion: 0.22
Nodes (13): allPayments(), buildSalesDashboardStats(), canonicalWaiterName(), HourStat, ItemStat, MonthStat, RepeatCustomerStat, round2() (+5 more)

### Community 32 - "Send To Kitchen Modal"
Cohesion: 0.18
Nodes (8): categoriesToBarPrepare, categoriesToKitchenPrepare, Props, SendToKitchenModal(), StoreKitchen, SendToKitchenModalLayout(), OrderActions(), capitalizeFirstLetter()

### Community 33 - "Commands Add Products Modal"
Cohesion: 0.17
Nodes (8): AddProductsModal(), handleAddProduct(), handleAddProductsInCommand(), handleCloseModal(), ProductNoAmount, Props, TODO: check if there are enough amount of product selected in stock, SetAmountModal()

### Community 34 - "Sales Dashboard Charts"
Cohesion: 0.19
Nodes (9): CommandsListLayout(), PIE_PALETTE, PieChart(), Props, SalesDashboardLayout(), ItemsTableLayout(), SalesDashboardStats, ShareStat (+1 more)

### Community 35 - "Command Payment Modal"
Cohesion: 0.24
Nodes (8): PaymentModal(), handleCloseConfirmModal(), handleOpenCloseCommandModal(), Props, PaymentModalLayout(), calculatePayment(), PaymentInput, getCommandBalance()

### Community 36 - "App Shell Layout & Nav"
Cohesion: 0.24
Nodes (7): @radix-ui/react-avatar, AppShellLayout(), Props, navItems, Avatar, AvatarFallback, AvatarImage

### Community 37 - "Commands Page Entry"
Cohesion: 0.22
Nodes (3): DeleteCommandModal(), Commands(), CommandsService

### Community 38 - "Command Products Service"
Cohesion: 0.18
Nodes (5): DecreaseAmount, FavoriteStatus, IncreaseAmount, ProductsService, VerifyAmount

### Community 39 - "Commands Products Service"
Cohesion: 0.18
Nodes (5): DecreaseAmount, FavoriteStatus, IncreaseAmount, ProductsService, VerifyAmount

### Community 40 - "Closed Cashiers List"
Cohesion: 0.31
Nodes (8): ClosedCashiersLayout(), formatDate(), renderRows(), columns, Props, NavHeader(), Props, Cashier

### Community 41 - "Stock Add Item Modal"
Cohesion: 0.27
Nodes (8): AddItemModal(), cleanFields(), handleChangeUnitPrice(), handleSubmit(), Props, AddItemModalLayout(), checkImageURL(), formatPrice()

### Community 42 - "iFood Routing & Add Product"
Cohesion: 0.22
Nodes (7): IfoodController.js (backend, auto-routes accepted iFood orders), iFood Order-to-Command Naming Convention (table startsWith 'iFood #'), Kitchen/Bar Routing Category Lists Duplicated in Three Places, AddProductModal(), handleAddProduct(), handleAddProductsInCommand(), handleCloseModal()

### Community 43 - "Backend P1 Findings (Payments)"
Cohesion: 0.22
Nodes (10): Backend Compatibility and Reliability Review, P1: Cashier Closing Trusts Client-Supplied Payment Records, P1: Command Closing Is Neither Idempotent Nor Atomic, P1: Concurrent Payments Can Overwrite Each Other, P1: Payment Validation Can Be Bypassed Through Direct API Calls, Applied: Safer Command Closing in the Frontend (GET-before-close, request lock), MongoDB: Atomicity and Transactions (write operations), CashierController.js (backend) (+2 more)

### Community 44 - "Applied Fixes (Reports & Payments)"
Cohesion: 0.20
Nodes (10): Applied Fix: Shared HTTP/Socket Backend Config & Reliability, Applied Fix: Monthly Reports Calculation Moved Out of Render, Repository Review, P3: Continue Maintainability Work (lint warnings, any types, CI, integration tests), Applied Fix: Payment History Query Deduplication & Stale-Response Handling, Applied Fix: Payment Validation, Cents-based Change Calculation, Resolved: Report Navigation Persistence (drop cashierByMonthObject localStorage), Validation Summary (17 regression tests, build, lint warnings) (+2 more)

### Community 45 - "App Header Component"
Cohesion: 0.22
Nodes (5): Header(), Props, headerButtons, HeaderLayout(), Props

### Community 46 - "Cashier Report Types & Hook"
Cohesion: 0.33
Nodes (6): emptyCashier, getCashierReport(), CashierByMonth, CashierCommand, CashierProduct, groupCashiersByMonth()

### Community 47 - "Coding Conventions & Command Service"
Cohesion: 0.25
Nodes (5): Coding Style & Naming Conventions (AGENTS.md), index.tsx/layout.tsx Presentation Split (AGENTS.md), Feature Module Pattern (index.tsx/layout.tsx/services/reducers), CommandService, API_URL

### Community 48 - "iFood Product Name Matching"
Cohesion: 0.39
Nodes (6): iFood Item-to-Catalog-Product Matching (normalized name + remembered mapping), IfoodOrderItem, IfoodProductMapping, normalizeName(), stripIfoodToken(), resolveIfoodItemProduct()

### Community 49 - "Admin Page"
Cohesion: 0.28
Nodes (5): Admin(), handleCloseConfirmationModal(), handleCloseResetModal(), handleOpenResetModal(), handleResetSystem()

### Community 50 - "Admin & Payments Services"
Cohesion: 0.22
Nodes (4): AdminService, Pay, PaymentsService, serverApi

### Community 51 - "Login Feature"
Cohesion: 0.25
Nodes (3): Login(), LoginLayout(), LoginService

### Community 52 - "NPM Scripts"
Cohesion: 0.25
Nodes (8): scripts, build, commit, dev, lint, start, test, typecheck

### Community 53 - "Draggable Kitchen Order Card"
Cohesion: 0.32
Nodes (6): @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, DraggableOrder(), Props, Props

### Community 56 - "Sales Dashboard Nav Header"
Cohesion: 0.29
Nodes (6): NavHeader(), Props, monthOptions, NavHeaderLayout(), Props, yearOptions

### Community 57 - "Repository Guidelines (AGENTS.md)"
Cohesion: 0.33
Nodes (7): Commit & Pull Request Guidelines (AGENTS.md), Project Structure & Module Organization, Repository Guidelines (AGENTS.md), Testing Guidelines (AGENTS.md), Regression Test Coverage Added (Node tests + typecheck script), Pesqueiro Arruda's Frontend README, Validation Commands (README)

### Community 58 - "Architecture Overview (CLAUDE.md)"
Cohesion: 0.29
Nodes (7): Two-Layer Auth Pattern (route-level cookie + role-level localStorage), Project Overview (CLAUDE.md), Socket.IO Real-time Update Pattern (no central event bus), Dual UI System: Tailwind/shadcn primitives + Chakra UI coexistence, kitchen-order-* Socket Event Contracts (created/updated/deleted payload shapes), Applied Fix: Socket Lifecycle Management (connect/disconnect in effect, per-subscription cleanup), SocketContext / socket.io-client instance (_app.tsx)

### Community 59 - "Products List Layout & Hook"
Cohesion: 0.38
Nodes (5): useClickOutsideToClose(), ActiveEditFish, AmountProduct, columns, ProductsListLayout()

### Community 61 - "Add Command Modal"
Cohesion: 0.29
Nodes (4): AddCommandInputs, AddCommandModal(), Props, AddCommandModalLayout()

### Community 62 - "Cashier Report Download"
Cohesion: 0.29
Nodes (5): handleDownload(), ClosedCashiers(), handleDownloadCashiers(), downloadFile(), Props

### Community 63 - "Sheet UI Primitive"
Cohesion: 0.40
Nodes (5): @radix-ui/react-dialog, SheetContent, SheetContentProps, SheetOverlay, sheetVariants

### Community 64 - "Kitchen Check Order Modal"
Cohesion: 0.33
Nodes (4): CheckOrderModal(), Props, CheckOrderModalLayout(), KitchenContext

### Community 66 - "Backend Auth Gap Findings"
Cohesion: 0.40
Nodes (5): Security & Configuration (AGENTS.md), P1: Operational HTTP Routes and Sockets Have No Application Authentication, P1: Verify Server-Side Authorization (client-only isAuthorized/isAdmin checks insufficient), index.js (backend entrypoint, socket connections & error middleware), routes.js (backend)

### Community 67 - "Frontend/Backend Contract Findings"
Cohesion: 0.40
Nodes (5): Frontend/Backend Compatibility Findings, Partial Payments Do Not Create a Payment Record (existing behavior), PUT /commands/:id?updateTotal=true contract, POST /kitchen/orders/reorder Declared by Frontend but Missing in Backend, PaymentsRepository.create (backend, Luxon UTC-3 DateTime)

### Community 69 - "Backend P2 Follow-ups"
Cohesion: 0.50
Nodes (4): P2: Error Propagation, Dates, and Inventory Need Follow-up, /webhook/ifood/order Only Logs and Acknowledges, Does Not Persist or Authenticate, P2: Finish Asynchronous and Date Consistency Work ('pt-BR' used as zone, not locale), CashiersRepository.findAll(date) (backend)

### Community 70 - "Dependency Security Findings"
Cohesion: 0.50
Nodes (4): P1: Upgrade Dependencies and Assess Deployment Exposure (Next.js 13.5.11 unsupported), GHSA-2xp9-vwfh-vxw4 (AVIF Image Optimization RCE), GHSA-p293-qw3h-jr36 (Windows Server RCE), Next.js Support Policy

### Community 71 - "Stock Edit Item Modal"
Cohesion: 0.67
Nodes (3): EditModal(), handleSubmit(), onClose()

### Community 74 - "Commitizen Config"
Cohesion: 0.67
Nodes (3): path, config, commitizen

## Knowledge Gaps
- **404 isolated node(s):** `root`, `browser`, `es2021`, `node`, `plugin:react/recommended` (+399 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 554 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `UI Primitives & App Shell` to `Reservations Feature Module`, `Project Dependencies Manifest`, `Modal & UI Primitives`, `Stock Merge Duplicates Modal`, `Cashier Closing Flow`, `Stock Filter Nav Header`, `Table UI Primitives`, `iFood Orders Screen`, `Add Product Modal (Command)`, `Command Products List`, `Command Page & Printing`, `Add Product Modal Layout`, `Commands State & Delete Modal`, `Commands List & Edit Modal`, `Cashier Report Page`, `Kitchen Completed Orders List`, `Reservations Filters & Tabs`, `Stock Delete Item Modal`, `Kitchen Order Reducer`, `Route Navigation Progress Bar`, `Sold Items Page`, `Close Command Modal`, `Kitchen Order Actions & Service`, `Send To Kitchen Modal`, `Commands Add Products Modal`, `Sales Dashboard Charts`, `Command Payment Modal`, `App Shell Layout & Nav`, `Closed Cashiers List`, `Stock Add Item Modal`, `App Header Component`, `Cashier Report Types & Hook`, `Login Feature`, `Draggable Kitchen Order Card`, `Sales Dashboard Nav Header`, `Products List Layout & Hook`, `Add Command Modal`, `Sheet UI Primitive`, `Kitchen Check Order Modal`?**
  _High betweenness centrality (0.296) - this node is a cross-community bridge._
- **Why does `@chakra-ui/react` connect `Command Products List` to `UI Primitives & App Shell`, `Reservations Feature Module`, `Project Dependencies Manifest`, `Stock Merge Duplicates Modal`, `Cashier Closing Flow`, `iFood Orders Screen`, `Add Product Modal (Command)`, `Command Page & Printing`, `Commands State & Delete Modal`, `Commands List & Edit Modal`, `Stock Delete Item Modal`, `Kitchen Order Reducer`, `Route Navigation Progress Bar`, `Close Command Modal`, `Kitchen Order Actions & Service`, `Send To Kitchen Modal`, `Commands Add Products Modal`, `Command Payment Modal`, `Stock Add Item Modal`, `App Header Component`, `Login Feature`, `Add Command Modal`, `Kitchen Check Order Modal`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `Repository Review` connect `Applied Fixes (Reports & Payments)` to `Backend Auth Gap Findings`, `Backend P2 Follow-ups`, `Dependency Security Findings`, `Backend P1 Findings (Payments)`, `Repository Guidelines (AGENTS.md)`, `Architecture Overview (CLAUDE.md)`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `root`, `browser`, `es2021` to the rest of the system?**
  _404 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Primitives & App Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.06466916354556804 - nodes in this community are weakly interconnected._
- **Should `Reservations Feature Module` be split into smaller, more focused modules?**
  _Cohesion score 0.0647307924984876 - nodes in this community are weakly interconnected._
- **Should `Test Suite` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._