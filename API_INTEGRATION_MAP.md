# Documento de Integração Frontend ↔ Backend API

Este documento detalha todos os endpoints da API backend (`digital-products-api`), contratos de dados, permissões RBAC requeridas, parâmetros aceitos e o componente/página do frontend correspondente.

---

## 1. Padrão Global de Comunicação

- **URL Base:** `http://localhost:3000/api/v1` (configurável via `VITE_API_URL`)
- **Envelope de Sucesso Padrão:**
```json
{
  "success": true,
  "message": "Mensagem descritiva da operação",
  "data": { ... } | [ ... ] | null,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```
- **Envelope de Erro Padrão:**
```json
{
  "success": false,
  "message": "Mensagem amigável de erro",
  "errors": [
    { "field": "nome_do_campo", "message": "Validação falhou" }
  ]
}
```

---

## 2. Tabela de Mapeamento de Endpoints

| Endpoint | Método | Auth | Permissão RBAC | Parâmetros / Body | Formato de Resposta | Página / Componente Frontend |
|---|---|---|---|---|---|---|
| `/health` | `GET` | Não | Nenhuma | Nenhum | `{ status: "UP", uptime: number, timestamp: string }` | Status indicator / health check |
| `/api/v1/categories` | `GET` | Não | Nenhuma | Nenhum | `Category[]` | StoreHeader, StorePage, AdminCategories, ProductForm |
| `/api/v1/categories/:id` | `GET` | Não | Nenhuma | `id: number` (path) | `Category` | AdminCategories (edição) |
| `/api/v1/categories` | `POST` | Sim (JWT) | `products.create` | `{ name: string, slug?: string, description?: string, is_active?: boolean }` | `Category` | AdminCategoriesModal |
| `/api/v1/categories/:id` | `PUT` | Sim (JWT) | `products.update` | `id` (path), `{ name?, slug?, description?, is_active? }` | `Category` | AdminCategoriesModal |
| `/api/v1/categories/:id` | `DELETE` | Sim (JWT) | `products.delete` | `id` (path) | `null` | AdminCategories (exclusão) |
| `/api/v1/products` | `GET` | Não | Nenhuma | `page?`, `limit?`, `search?`, `category_id?`, `status?`, `product_type?`, `sort_by?`, `sort_order?` | `Product[]` com `meta` | StorePage (Catálogo), AdminProducts |
| `/api/v1/products/slug/:slug` | `GET` | Não | Nenhuma | `slug: string` (path) | `Product & { category_name?, file? }` | StoreProductSalesPage (Hero, Prévias, Bônus) |
| `/api/v1/products/:id` | `GET` | Não | Nenhuma | `id: number` (path) | `Product & { category_name?, file? }` | CheckoutPage, AdminProductModal |
| `/api/v1/products` | `POST` | Sim (JWT) | `products.create` | `multipart/form-data`: `name, slug?, description, price, category_id, product_type, status?, thumbnail_url?, file?` | `Product` | AdminProductCreateModal |
| `/api/v1/products/:id` | `PUT` | Sim (JWT) | `products.update` | `id` (path), `{ name?, slug?, description?, price?, category_id?, status?, thumbnail_url?, product_type? }` | `Product` | AdminProductEditModal |
| `/api/v1/products/:id/file` | `POST` | Sim (JWT) | `products.update` | `id` (path), `multipart/form-data`: `file` | `ProductFile` (versionado) | AdminProductUploadModal |
| `/api/v1/products/:id` | `DELETE` | Sim (JWT) | `products.delete` | `id` (path) | `null` | AdminProducts (arquivar/excluir) |
| `/api/v1/products/:id/files` | `GET` | Sim (JWT) | `products.view` | `id` (path) | `ProductFile[]` | AdminProductVersionHistoryModal |
| `/api/v1/checkout` | `POST` | Não | Nenhuma | `{ customer: { name, email }, items: [{ product_id, quantity }], payment_method: "pix" \| "credit_card" \| "bank_slip" \| "simulated", gateway?: string }` | `{ order: Order, payment: { gatewayName, transactionId, paymentUrl, qrCodePix, status } }` | CheckoutPage |
| `/api/v1/checkout/orders/:uuid` | `GET` | Não | Nenhuma | `uuid: string` (path) | `{ uuid, status, payment_status, total_amount, currency, paid_at, created_at, customer: { name, email }, items: [...] }` | PaymentStatusPage, OrderSuccessPage |
| `/api/v1/downloads/:token` | `GET` | Não | Nenhuma | `token: string` (path) | Stream binário do arquivo (Download) | CustomerDownloadPage |
| `/api/v1/auth/login` | `POST` | Não | Nenhuma | `{ email: string, password: string }` | `{ admin: { id, uuid, name, email, is_super_admin, roles, permissions }, accessToken, refreshToken }` | AdminLoginPage |
| `/api/v1/auth/refresh` | `POST` | Não | Nenhuma | `{ refreshToken: string }` | `{ accessToken, refreshToken }` | Axios Interceptor / AuthContext |
| `/api/v1/auth/logout` | `POST` | Não | Nenhuma | `{ refreshToken?: string }` | `null` | AdminNavbar / SessionManager |
| `/api/v1/auth/forgot-password` | `POST` | Não | Nenhuma | `{ email: string }` | `null` | AdminForgotPasswordPage |
| `/api/v1/auth/reset-password` | `POST` | Não | Nenhuma | `{ token: string, password: string }` | `null` | AdminResetPasswordPage |
| `/api/v1/auth/me` | `GET` | Sim (JWT) | Nenhuma | Header `Authorization: Bearer <token>` | `AdminProfile` | AuthContext (Revalidação de Sessão) |
| `/api/v1/admin/dashboard` | `GET` | Sim (JWT) | `reports.view` | Nenhum | `{ financial, orders, deliveries, catalog, topProducts, salesByPeriod }` | AdminDashboardPage |
| `/api/v1/admin/orders` | `GET` | Sim (JWT) | `orders.view` | `page?`, `limit?`, `status?`, `payment_status?`, `customer_id?`, `search?`, `from_date?`, `to_date?` | `Order[]` (com customer embutido) e `meta` | AdminOrdersPage, AdminCustomersPage |
| `/api/v1/admin/orders/:id` | `GET` | Sim (JWT) | `orders.view` | `id: number` (path) | `Order` (completo com items, customer, payment, statusHistory) | AdminOrderDetailModal |
| `/api/v1/admin/orders/:id/status` | `PUT` | Sim (JWT) | `orders.update` | `id` (path), `{ status: string, reason?: string }` | `Order` | AdminOrderDetailModal (Ações) |
| `/api/v1/admin/deliveries` | `GET` | Sim (JWT) | `deliveries.view` | `page?`, `limit?`, `status?`, `search?` | `DigitalDelivery[]` e `meta` | AdminDeliveriesPage |
| `/api/v1/admin/deliveries/:id` | `GET` | Sim (JWT) | `deliveries.view` | `id: number` (path) | `DigitalDelivery` | AdminDeliveriesPage (Detalhes) |
| `/api/v1/admin/deliveries/:id/resend` | `POST` | Sim (JWT) | `deliveries.resend` | `id: number` (path) | `DigitalDelivery` | AdminDeliveriesPage (Botão Reenviar) |
| `/api/v1/admin/administrators` | `GET` | Sim (JWT) | `admins.view` | `page?`, `limit?` | `Administrator[]` com `roles` e `permissions` | AdminUsersPage |
| `/api/v1/admin/administrators/:id` | `GET` | Sim (JWT) | `admins.view` | `id: number` (path) | `Administrator` detalhado | AdminUsersPage (Edição) |
| `/api/v1/admin/administrators` | `POST` | Sim (JWT) | `admins.create` | `{ name, email, password, is_super_admin?, roleIds?, permissions? }` | `Administrator` | AdminUserCreateModal |
| `/api/v1/admin/administrators/:id` | `PUT` | Sim (JWT) | `admins.update` | `id` (path), `{ name?, email?, password?, status?, roleIds?, permissions? }` | `Administrator` | AdminUserEditModal |
| `/api/v1/admin/administrators/:id` | `DELETE` | Sim (JWT) | `admins.delete` | `id` (path) | `null` | AdminUsersPage (Desativar) |
| `/api/v1/admin/roles` | `GET` | Sim (JWT) | `admins.view` | Nenhum | `Role[]` | AdminRolesModal / AdminUserModal |
| `/api/v1/admin/permissions` | `GET` | Sim (JWT) | `admins.view` | Nenhum | `Permission[]` | AdminUserModal (Permissões) |
| `/api/v1/admin/audit-logs` | `GET` | Sim (JWT) | `audit.view` | `page?`, `limit?`, `action?`, `entity?`, `administrator_id?` | `AuditLog[]` e `meta` | AdminAuditLogsPage |
| `/api/v1/admin/settings` | `GET` | Sim (JWT) | `settings.manage` | Nenhum | `SystemSetting[]` | AdminSettingsPage |
| `/api/v1/admin/settings` | `PUT` | Sim (JWT) | `settings.manage` | `{ settings: [{ key: string, value: string }] }` | `SystemSetting[]` | AdminSettingsPage |

---

## 3. Registro de Lacunas da API & Decisões Arquiteturais

Conforme estipulado no requisito 7 (*"Se uma funcionalidade necessária não possuir endpoint correspondente, registre a ausência e proponha a alteração necessária no backend. Não simule funcionalidades inexistentes."*):

1. **Endpoint dedicado para Clientes (`GET /api/v1/admin/customers`):**
   - **Situação Atual:** A tabela `customers` existe no banco e o repositório `CustomerRepository.findAll(limit, offset, search)` está implementado no backend, porém não há controller ou rota `/admin/customers` exposta em `src/routes/index.ts`.
   - **Solução no Frontend:** O painel de Clientes consome e agrupa os dados de clientes disponíveis via `GET /api/v1/admin/orders` (que contém o objeto `customer: { id, name, email }` para cada venda realizada, com histórico de compras correlacionado via `customer_id`).
   - **Proposta para o Backend:** Adicionar `src/routes/customer.routes.ts` com `GET /admin/customers` chamando `CustomerController.list(req, res)` utilizando o `CustomerRepository` já existente.

2. **Metadados Visuais do Produto (Indicadores, Seções, Prévias):**
   - **Situação Atual:** A tabela `products` possui os campos padrão (`name`, `slug`, `description`, `price`, `thumbnail_url`, `product_type`, `category_id`).
   - **Solução no Frontend:** O frontend aceita no campo `description` tanto texto livre quanto um JSON estruturado com `{ summary, edition, indicators, features, bonus, how_to_use }`. Caso o campo seja texto simples, o frontend faz o fallback automático e elegante sem quebrar.
   - **Proposta para o Backend:** Em futuras versões, criar uma tabela `product_metadata` ou coluna `metadata_json JSON` para suportar blocos de landing page customizáveis por produto.
