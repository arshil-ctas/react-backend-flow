import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';

// ─── E-Commerce Backend Template ─────────────────────────────────────────────
// Modelled after the screenshot: 6 models, hooks, file registries, control flow,
// CRUD ops, and aggregate nodes — all wired together.

const E = (id: string, src: string, tgt: string, color = '#6366f1', label?: string): Edge => ({
  id, source: src, target: tgt, animated: true,
  markerEnd: { type: MarkerType.ArrowClosed, color },
  style: { stroke: color, strokeWidth: 1.8 },
  label, labelStyle: { fill: '#71717a', fontSize: 9 },
  type: 'smoothstep',
});

// ─── NODES ───────────────────────────────────────────────────────────────────

export const ECOMMERCE_NODES: Node[] = [

  // ══════════════════════════════════════════════════════
  // COLUMN 1 — MODEL SCHEMAS  (x: 0–260)
  // ══════════════════════════════════════════════════════

  {
    id: 'm_user', type: 'modelNode', position: { x: 20, y: 20 },
    data: {
      modelName: 'User', timestamps: true, softDelete: false,
      fields: [
        { id: 'u1', name: '_id',       type: 'ObjectId', options: {},                           isIdentity: true },
        { id: 'u2', name: 'email',     type: 'String',   options: { required: true, unique: true, lowercase: true, trim: true } },
        { id: 'u3', name: 'password',  type: 'String',   options: { required: true } },
        { id: 'u4', name: 'role',      type: 'String',   options: { enum: ['admin','customer','vendor'], default: 'customer' } },
        { id: 'u5', name: 'status',    type: 'String',   options: { enum: ['active','banned','pending'], default: 'active' } },
        { id: 'u6', name: 'avatar',    type: 'String',   options: {} },
        { id: 'u7', name: 'phone',     type: 'String',   options: {} },
        { id: 'u8', name: 'lastLogin', type: 'Date',     options: {} },
      ],
    },
  },

  {
    id: 'm_product', type: 'modelNode', position: { x: 20, y: 360 },
    data: {
      modelName: 'Product', timestamps: true, softDelete: true,
      fields: [
        { id: 'p1', name: '_id',          type: 'ObjectId', options: {},                            isIdentity: true },
        { id: 'p2', name: 'name',         type: 'String',   options: { required: true, trim: true } },
        { id: 'p3', name: 'slug',         type: 'String',   options: { unique: true, index: true } },
        { id: 'p4', name: 'description',  type: 'String',   options: {} },
        { id: 'p5', name: 'price',        type: 'Number',   options: { required: true, min: 0 } },
        { id: 'p6', name: 'comparePrice', type: 'Number',   options: { min: 0 } },
        { id: 'p7', name: 'category',     type: 'ObjectId', options: { ref: 'Category' } },
        { id: 'p8', name: 'tags',         type: 'Array',    options: {} },
        { id: 'p9', name: 'variants',     type: 'Array',    options: {} },
        { id: 'p10',name: 'status',       type: 'String',   options: { enum: ['active','draft','archived'], default: 'draft' } },
      ],
    },
  },

  {
    id: 'm_category', type: 'modelNode', position: { x: 20, y: 760 },
    data: {
      modelName: 'Category', timestamps: true, softDelete: false,
      fields: [
        { id: 'c1', name: '_id',        type: 'ObjectId', options: {},                            isIdentity: true },
        { id: 'c2', name: 'name',       type: 'String',   options: { required: true, trim: true } },
        { id: 'c3', name: 'slug',       type: 'String',   options: { unique: true } },
        { id: 'c4', name: 'description',type: 'String',   options: {} },
        { id: 'c5', name: 'parent',     type: 'ObjectId', options: { ref: 'Category' } },
        { id: 'c6', name: 'icon',       type: 'String',   options: {} },
        { id: 'c7', name: 'order',      type: 'Number',   options: { default: '0' } },
        { id: 'c8', name: 'isActive',   type: 'Boolean',  options: { default: 'true' } },
        { id: 'c9', name: 'mediaFile',  type: 'String',   options: {} },
      ],
    },
  },

  {
    id: 'm_order', type: 'modelNode', position: { x: 20, y: 1130 },
    data: {
      modelName: 'Order', timestamps: true, softDelete: false,
      fields: [
        { id: 'o1', name: '_id',         type: 'ObjectId', options: {},                            isIdentity: true },
        { id: 'o2', name: 'orderNumber', type: 'Number',   options: { unique: true },             isIdentity: true },
        { id: 'o3', name: 'customer',    type: 'ObjectId', options: { ref: 'User', required: true } },
        { id: 'o4', name: 'items',       type: 'Array',    options: {} },
        { id: 'o5', name: 'subtotal',    type: 'Number',   options: { required: true } },
        { id: 'o6', name: 'tax',         type: 'Number',   options: { default: '0' } },
        { id: 'o7', name: 'shipping',    type: 'Number',   options: { default: '0' } },
        { id: 'o8', name: 'total',       type: 'Number',   options: { required: true } },
        { id: 'o9', name: 'status',      type: 'String',   options: { enum: ['pending','paid','processing','shipped','delivered','cancelled'], default: 'pending' } },
        { id: 'o10',name: 'paymentId',   type: 'String',   options: {} },
      ],
    },
  },

  {
    id: 'm_inventory', type: 'modelNode', position: { x: 20, y: 1570 },
    data: {
      modelName: 'Inventory', timestamps: true, softDelete: false,
      fields: [
        { id: 'i1', name: '_id',          type: 'ObjectId', options: {},                            isIdentity: true },
        { id: 'i2', name: 'product',      type: 'ObjectId', options: { ref: 'Product', required: true } },
        { id: 'i3', name: 'warehouse',    type: 'String',   options: { required: true, index: true } },
        { id: 'i4', name: 'quantity',     type: 'Number',   options: { required: true, min: 0 } },
        { id: 'i5', name: 'reserved',     type: 'Number',   options: { default: '0' } },
        { id: 'i6', name: 'reorderPoint', type: 'Number',   options: { default: '10' } },
        { id: 'i7', name: 'sku',          type: 'String',   options: { unique: true, index: true }, isIdentity: true },
        { id: 'i8', name: 'location',     type: 'String',   options: {} },
        { id: 'i9', name: 'batch',        type: 'String',   options: {} },
      ],
    },
  },

  {
    id: 'm_review', type: 'modelNode', position: { x: 20, y: 1920 },
    data: {
      modelName: 'Review', timestamps: true, softDelete: false,
      fields: [
        { id: 'r1', name: '_id',       type: 'ObjectId', options: {},                            isIdentity: true },
        { id: 'r2', name: 'product',   type: 'ObjectId', options: { ref: 'Product', required: true } },
        { id: 'r3', name: 'user',      type: 'ObjectId', options: { ref: 'User', required: true } },
        { id: 'r4', name: 'rating',    type: 'Number',   options: { required: true, min: 1, max: 5 } },
        { id: 'r5', name: 'title',     type: 'String',   options: { trim: true } },
        { id: 'r6', name: 'body',      type: 'String',   options: {} },
        { id: 'r7', name: 'verified',  type: 'Boolean',  options: { default: 'false' } },
        { id: 'r8', name: 'helpful',   type: 'Number',   options: { default: '0' } },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // COLUMN 2 — HOOK REGISTRIES  (x: 310)
  // ══════════════════════════════════════════════════════

  {
    id: 'hook_user_pre', type: 'hookNode', position: { x: 330, y: 20 },
    data: {
      attachedModel: 'm_user',
      hooks: [
        { id: 'hu1', timing: 'pre', event: 'save',   action: 'hashPassword',    watchFields: ['password'], condition: "this.isModified('password')" },
        { id: 'hu2', timing: 'pre', event: 'save',   action: 'validateUnique',  watchFields: ['email'] },
        { id: 'hu3', timing: 'post',event: 'save',   action: 'sendEmail',       condition: 'this.isNew' },
        { id: 'hu4', timing: 'pre', event: 'validate',action:'validateUnique',  watchFields: ['phone'] },
      ],
    },
  },

  {
    id: 'hook_product_pre', type: 'hookNode', position: { x: 330, y: 360 },
    data: {
      attachedModel: 'm_product',
      hooks: [
        { id: 'hp1', timing: 'pre', event: 'save',   action: 'generateSlug',    watchFields: ['name'], condition: "this.isModified('name')" },
        { id: 'hp2', timing: 'pre', event: 'save',   action: 'validateUnique',  watchFields: ['slug'] },
        { id: 'hp3', timing: 'post',event: 'save',   action: 'updateTimestamp' },
        { id: 'hp4', timing: 'pre', event: 'remove', action: 'custom',          customCode: '// Clean up inventory + reviews' },
      ],
    },
  },

  {
    id: 'hook_category', type: 'hookNode', position: { x: 330, y: 760 },
    data: {
      attachedModel: 'm_category',
      hooks: [
        { id: 'hc1', timing: 'pre', event: 'save',   action: 'generateSlug',   watchFields: ['name'] },
        { id: 'hc2', timing: 'pre', event: 'validate',action:'validateUnique',  watchFields: ['slug'] },
      ],
    },
  },

  {
    id: 'hook_order', type: 'hookNode', position: { x: 330, y: 1130 },
    data: {
      attachedModel: 'm_order',
      hooks: [
        { id: 'ho1', timing: 'pre', event: 'save',              action: 'autoIncrement',   watchFields: ['orderNumber'], condition: 'this.isNew' },
        { id: 'ho2', timing: 'post',event: 'findOneAndUpdate',  action: 'sendEmail',       condition: "doc.status === 'shipped'" },
        { id: 'ho3', timing: 'pre', event: 'save',              action: 'custom',          customCode: 'this.total = this.subtotal + this.tax + this.shipping;' },
        { id: 'ho4', timing: 'pre', event: 'deleteOne',         action: 'validateUnique',  condition: "doc.status !== 'pending'" },
      ],
    },
  },

  {
    id: 'hook_inventory', type: 'hookNode', position: { x: 330, y: 1570 },
    data: {
      attachedModel: 'm_inventory',
      hooks: [
        { id: 'hi1', timing: 'pre', event: 'save',   action: 'validateUnique',  watchFields: ['sku'] },
        { id: 'hi2', timing: 'post',event: 'save',   action: 'custom',          customCode: '// Trigger reorder alert if quantity < reorderPoint' },
        { id: 'hi3', timing: 'pre', event: 'update', action: 'updateTimestamp' },
      ],
    },
  },

  {
    id: 'hook_review', type: 'hookNode', position: { x: 330, y: 1920 },
    data: {
      attachedModel: 'm_review',
      hooks: [
        { id: 'hr1', timing: 'pre', event: 'save',   action: 'validateUnique',  condition: 'this.isNew' },
        { id: 'hr2', timing: 'post',event: 'save',   action: 'custom',          customCode: '// Recalculate product average rating' },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // COLUMN 3 — CONTROL FLOW + FILE REGISTRIES  (x: 650)
  // ══════════════════════════════════════════════════════

  { id: 'ctrl_if_user',  type: 'controlNode', position: { x: 660, y: 20 },
    data: { controlType: 'if', condition: 'user.role === "admin"' } },

  { id: 'ctrl_forEach',  type: 'controlNode', position: { x: 660, y: 120 },
    data: { controlType: 'forEach', iteratorVar: 'item', body: 'console.log(item)' } },

  { id: 'ctrl_map_prod', type: 'controlNode', position: { x: 660, y: 220 },
    data: { controlType: 'map', iteratorVar: 'product', body: 'return { ...product, slug: slugify(product.name) }' } },

  { id: 'ctrl_filter',   type: 'controlNode', position: { x: 660, y: 320 },
    data: { controlType: 'filter', iteratorVar: 'item', condition: 'item.status === "active"' } },

  { id: 'ctrl_reduce',   type: 'controlNode', position: { x: 660, y: 420 },
    data: { controlType: 'reduce', iteratorVar: 'item', accumulator: '0', body: 'return acc + item.price' } },

  { id: 'ctrl_if_inv',   type: 'controlNode', position: { x: 660, y: 520 },
    data: { controlType: 'if', condition: 'inv.quantity < inv.reorderPoint' } },

  { id: 'ctrl_switch',   type: 'controlNode', position: { x: 660, y: 620 },
    data: { controlType: 'switch', condition: 'order.status' } },

  { id: 'ctrl_tc',       type: 'controlNode', position: { x: 660, y: 720 },
    data: { controlType: 'try-catch', body: 'await processPayment(order)' } },

  { id: 'ctrl_filter2',  type: 'controlNode', position: { x: 660, y: 820 },
    data: { controlType: 'filter', iteratorVar: 'review', condition: 'review.rating >= 4' } },

  // File Registries
  {
    id: 'fr_user', type: 'fileRegistryNode', position: { x: 900, y: 20 },
    data: {
      registryName: 'User Import',
      targetModel: 'm_user',
      operation: 'upsert',
      batchSize: 500,
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
      conditionalDispatch: '',
      columns: [
        { header: 'email',    fieldPath: 'email',    required: true, isIdentity: true },
        { header: 'password', fieldPath: 'password', required: true },
        { header: 'name',     fieldPath: 'name',     required: false },
        { header: 'role',     fieldPath: 'role',     defaultValue: 'customer' },
        { header: 'status',   fieldPath: 'status',   defaultValue: 'active' },
      ],
    },
  },

  {
    id: 'fr_product', type: 'fileRegistryNode', position: { x: 900, y: 380 },
    data: {
      registryName: 'Product Catalog',
      targetModel: 'm_product',
      operation: 'upsert',
      batchSize: 100,
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip', groupByField: 'slug' },
      conditionalDispatch: "row.sku ? 'upsert' : 'create'",
      columns: [
        { header: 'name',         fieldPath: 'name',         required: true },
        { header: 'slug',         fieldPath: 'slug',         isIdentity: true },
        { header: 'price',        fieldPath: 'price',        required: true, transform: '(v) => parseFloat(v)' },
        { header: 'comparePrice', fieldPath: 'comparePrice', transform: '(v) => parseFloat(v) || null' },
        { header: 'category',     fieldPath: 'category' },
        { header: 'tags',         fieldPath: 'tags',         transform: '(v) => v.split(",").map(s=>s.trim())' },
        { header: 'status',       fieldPath: 'status',       defaultValue: 'draft' },
        { header: 'sku',          fieldPath: 'sku',          isIdentity: true },
      ],
    },
  },

  {
    id: 'fr_category', type: 'fileRegistryNode', position: { x: 900, y: 780 },
    data: {
      registryName: 'Category Import',
      targetModel: 'm_category',
      operation: 'upsert',
      batchSize: 200,
      arrayConfig: { shape: 'flat-csv', emptyRowHandling: 'skip' },
      conditionalDispatch: '',
      columns: [
        { header: 'name',        fieldPath: 'name',        required: true },
        { header: 'slug',        fieldPath: 'slug',        isIdentity: true },
        { header: 'description', fieldPath: 'description' },
        { header: 'parent',      fieldPath: 'parent' },
        { header: 'order',       fieldPath: 'order',       transform: '(v) => parseInt(v) || 0' },
        { header: 'isActive',    fieldPath: 'isActive',    transform: '(v) => v === "true"' },
      ],
    },
  },

  {
    id: 'fr_order', type: 'fileRegistryNode', position: { x: 900, y: 1130 },
    data: {
      registryName: 'Order Import',
      targetModel: 'm_order',
      operation: 'create',
      batchSize: 50,
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'error', groupByField: 'orderNumber' },
      conditionalDispatch: "row.orderNumber ? 'upsert' : 'create'",
      columns: [
        { header: 'orderNumber', fieldPath: 'orderNumber', isIdentity: true, autoIncrement: true, autoIncrementStart: 1000, autoIncrementStep: 1 },
        { header: 'customer',    fieldPath: 'customer',    required: true, isIdentity: false },
        { header: 'subtotal',    fieldPath: 'subtotal',    transform: '(v) => parseFloat(v)' },
        { header: 'shipping',    fieldPath: 'shipping',    transform: '(v) => parseFloat(v) || 0' },
        { header: 'total',       fieldPath: 'total',       transform: '(v) => parseFloat(v)' },
        { header: 'status',      fieldPath: 'status',      defaultValue: 'pending' },
      ],
    },
  },

  {
    id: 'fr_inventory', type: 'fileRegistryNode', position: { x: 900, y: 1540 },
    data: {
      registryName: 'Inventory Update',
      targetModel: 'm_inventory',
      operation: 'upsert',
      batchSize: 1000,
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
      conditionalDispatch: "parseInt(row.quantity) === 0 ? 'update' : 'upsert'",
      columns: [
        { header: 'sku',          fieldPath: 'sku',          required: true, isIdentity: true },
        { header: 'quantity',     fieldPath: 'quantity',     required: true, transform: '(v) => parseInt(v)' },
        { header: 'reserved',     fieldPath: 'reserved',     transform: '(v) => parseInt(v) || 0' },
        { header: 'reorderPoint', fieldPath: 'reorderPoint', transform: '(v) => parseInt(v) || 10' },
        { header: 'location',     fieldPath: 'location' },
        { header: 'status',       fieldPath: 'status',       defaultValue: 'active' },
      ],
    },
  },

  {
    id: 'fr_review', type: 'fileRegistryNode', position: { x: 900, y: 1920 },
    data: {
      registryName: 'Review Import',
      targetModel: 'm_review',
      operation: 'create',
      batchSize: 200,
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
      conditionalDispatch: '',
      columns: [
        { header: 'product', fieldPath: 'product', required: true },
        { header: 'user',    fieldPath: 'user',    required: true },
        { header: 'rating',  fieldPath: 'rating',  required: true, transform: '(v) => parseInt(v)' },
        { header: 'title',   fieldPath: 'title' },
        { header: 'body',    fieldPath: 'body' },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // COLUMN 4 — CRUD OPS  (x: 1260)
  // ══════════════════════════════════════════════════════

  { id: 'crud_user_find',    type: 'crudNode', position: { x: 1280, y: 20 },
    data: { operation: 'find', model: 'User', filter: '{ status: "active" }' } },
  { id: 'crud_user_findone', type: 'crudNode', position: { x: 1280, y: 160 },
    data: { operation: 'findOne', model: 'User', filter: '{ email }' } },
  { id: 'crud_user_create',  type: 'crudNode', position: { x: 1280, y: 300 },
    data: { operation: 'create', model: 'User', filter: '{}', payload: '{ email, password, role }' } },
  { id: 'crud_user_upd',     type: 'crudNode', position: { x: 1280, y: 440 },
    data: { operation: 'updateMany', model: 'User', filter: '{ role: "customer" }', payload: '{ $set: { status: "active" } }' } },
  { id: 'crud_user_del',     type: 'crudNode', position: { x: 1280, y: 580 },
    data: { operation: 'deleteOne', model: 'User', filter: '{ _id }' } },

  { id: 'crud_prod_find',    type: 'crudNode', position: { x: 1280, y: 740 },
    data: { operation: 'find', model: 'Product', filter: '{ status: "active" }' } },
  { id: 'crud_prod_findone', type: 'crudNode', position: { x: 1280, y: 880 },
    data: { operation: 'findOne', model: 'Product', filter: '{ slug }' } },
  { id: 'crud_prod_create',  type: 'crudNode', position: { x: 1280, y: 1020 },
    data: { operation: 'create', model: 'Product', filter: '{}', payload: '{ name, slug, price, category }' } },
  { id: 'crud_prod_upd',     type: 'crudNode', position: { x: 1280, y: 1160 },
    data: { operation: 'updateOne', model: 'Product', filter: '{ _id }', payload: '{ $set: { status: "archived" } }' } },
  { id: 'crud_prod_del',     type: 'crudNode', position: { x: 1280, y: 1300 },
    data: { operation: 'deleteOne', model: 'Product', filter: '{ _id }' } },

  { id: 'crud_cat_find',     type: 'crudNode', position: { x: 1280, y: 1460 },
    data: { operation: 'find', model: 'Category', filter: '{ isActive: true }' } },
  { id: 'crud_cat_findone',  type: 'crudNode', position: { x: 1280, y: 1580 },
    data: { operation: 'findOne', model: 'Category', filter: '{ slug }' } },
  { id: 'crud_cat_create',   type: 'crudNode', position: { x: 1280, y: 1700 },
    data: { operation: 'create', model: 'Category', filter: '{}', payload: '{ name, slug, parent }' } },
  { id: 'crud_cat_upd',      type: 'crudNode', position: { x: 1280, y: 1820 },
    data: { operation: 'updateOne', model: 'Category', filter: '{ _id }', payload: '{ $set: {} }' } },

  { id: 'crud_ord_find',     type: 'crudNode', position: { x: 1280, y: 1980 },
    data: { operation: 'find', model: 'Order', filter: '{ customer }' } },
  { id: 'crud_ord_findone',  type: 'crudNode', position: { x: 1280, y: 2100 },
    data: { operation: 'findOne', model: 'Order', filter: '{ orderNumber }' } },
  { id: 'crud_ord_create',   type: 'crudNode', position: { x: 1280, y: 2220 },
    data: { operation: 'create', model: 'Order', filter: '{}', payload: '{ customer, items, total }' } },
  { id: 'crud_ord_upd',      type: 'crudNode', position: { x: 1280, y: 2340 },
    data: { operation: 'updateOne', model: 'Order', filter: '{ _id }', payload: '{ $set: { status } }' } },
  { id: 'crud_ord_del',      type: 'crudNode', position: { x: 1280, y: 2460 },
    data: { operation: 'deleteOne', model: 'Order', filter: '{ _id, status: "pending" }' } },

  { id: 'crud_inv_find',     type: 'crudNode', position: { x: 1280, y: 2620 },
    data: { operation: 'find', model: 'Inventory', filter: '{ warehouse }' } },
  { id: 'crud_inv_create',   type: 'crudNode', position: { x: 1280, y: 2740 },
    data: { operation: 'create', model: 'Inventory', filter: '{}', payload: '{ product, sku, quantity }' } },
  { id: 'crud_inv_upd',      type: 'crudNode', position: { x: 1280, y: 2860 },
    data: { operation: 'updateOne', model: 'Inventory', filter: '{ sku }', payload: '{ $inc: { quantity: delta } }' } },
  { id: 'crud_inv_del',      type: 'crudNode', position: { x: 1280, y: 2980 },
    data: { operation: 'deleteOne', model: 'Inventory', filter: '{ _id }' } },

  // ══════════════════════════════════════════════════════
  // COLUMN 5 — AGGREGATES  (x: 1560)
  // ══════════════════════════════════════════════════════

  { id: 'agg_user',    type: 'crudNode', position: { x: 1560, y: 20 },
    data: { operation: 'aggregate', model: 'User',
      filter: '[{ $match: { status: "active" } }, { $group: { _id: "$role", count: { $sum: 1 } } }]' } },

  { id: 'agg_prod',    type: 'crudNode', position: { x: 1560, y: 200 },
    data: { operation: 'aggregate', model: 'Product',
      filter: '[{ $match: { status: "active" } }, { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "cat" } }]' } },

  { id: 'agg_order',   type: 'crudNode', position: { x: 1560, y: 400 },
    data: { operation: 'aggregate', model: 'Order',
      filter: '[{ $match: { status: "delivered" } }, { $group: { _id: "$customer", totalSpent: { $sum: "$total" } } }]' } },

  { id: 'agg_inv',     type: 'crudNode', position: { x: 1560, y: 600 },
    data: { operation: 'aggregate', model: 'Inventory',
      filter: '[{ $match: { $expr: { $lt: ["$quantity", "$reorderPoint"] } } }]' } },

  { id: 'agg_rev',     type: 'crudNode', position: { x: 1560, y: 800 },
    data: { operation: 'aggregate', model: 'Review',
      filter: '[{ $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }]' } },
];

// ─── EDGES ───────────────────────────────────────────────────────────────────

export const ECOMMERCE_EDGES: Edge[] = [
  // Models → Hooks
  E('e_mu_h',  'm_user',     'hook_user_pre',  '#6366f1'),
  E('e_mp_h',  'm_product',  'hook_product_pre','#6366f1'),
  E('e_mc_h',  'm_category', 'hook_category',   '#6366f1'),
  E('e_mo_h',  'm_order',    'hook_order',       '#6366f1'),
  E('e_mi_h',  'm_inventory','hook_inventory',   '#6366f1'),
  E('e_mr_h',  'm_review',   'hook_review',      '#6366f1'),

  // Models → Control flow
  E('e_mu_cf', 'm_user',     'ctrl_if_user',    '#818cf8'),
  E('e_mp_cf', 'm_product',  'ctrl_map_prod',   '#818cf8'),
  E('e_mc_cf', 'm_category', 'ctrl_filter',     '#818cf8'),
  E('e_mo_cf', 'm_order',    'ctrl_switch',     '#818cf8'),
  E('e_mi_cf', 'm_inventory','ctrl_if_inv',     '#818cf8'),
  E('e_mr_cf', 'm_review',   'ctrl_filter2',   '#818cf8'),

  // Control → File Registries
  E('e_cf_fru', 'ctrl_if_user',   'fr_user',      '#34d399'),
  E('e_cf_frp', 'ctrl_map_prod',  'fr_product',   '#34d399'),
  E('e_cf_frc', 'ctrl_filter',    'fr_category',  '#34d399'),
  E('e_cf_fro', 'ctrl_switch',    'fr_order',     '#34d399'),
  E('e_cf_fri', 'ctrl_if_inv',    'fr_inventory', '#34d399'),
  E('e_cf_frr', 'ctrl_filter2',   'fr_review',    '#34d399'),

  // File Registries → CRUD
  E('e_fru_c', 'fr_user',      'crud_user_find',    '#38bdf8'),
  E('e_frp_c', 'fr_product',   'crud_prod_find',    '#38bdf8'),
  E('e_frc_c', 'fr_category',  'crud_cat_find',     '#38bdf8'),
  E('e_fro_c', 'fr_order',     'crud_ord_find',     '#38bdf8'),
  E('e_fri_c', 'fr_inventory', 'crud_inv_find',     '#38bdf8'),
  E('e_frr_c', 'fr_review',    'crud_cat_upd',      '#38bdf8'),

  // CRUD → Aggregates
  E('e_cu_a',  'crud_user_del',  'agg_user',   '#f59e0b'),
  E('e_cp_a',  'crud_prod_del',  'agg_prod',   '#f59e0b'),
  E('e_co_a',  'crud_ord_del',   'agg_order',  '#f59e0b'),
  E('e_ci_a',  'crud_inv_del',   'agg_inv',    '#f59e0b'),

  // Cross-model relations (ObjectId refs)
  E('e_prod_cat', 'm_product',  'm_category',   '#f472b6', 'category ref'),
  E('e_order_user','m_order',   'm_user',        '#f472b6', 'customer ref'),
  E('e_inv_prod', 'm_inventory','m_product',    '#f472b6', 'product ref'),
  E('e_rev_prod', 'm_review',   'm_product',    '#f472b6', 'product ref'),
  E('e_rev_user', 'm_review',   'm_user',        '#f472b6', 'user ref'),
  E('e_cat_self', 'm_category', 'm_category',   '#f472b6', 'parent ref'),
];

// ─── Template Metadata ───────────────────────────────────────────────────────

export const ECOMMERCE_TEMPLATE = {
  id: 'ecommerce',
  name: 'E-Commerce Platform',
  description: 'Full e-commerce backend: User auth, Product catalog, Category tree, Order processing, Inventory management, Reviews — with hooks, file registries, CRUD, and aggregations.',
  icon: '🛒',
  tags: ['mongoose', 'e-commerce', 'full-stack', 'production'],
  nodeCount: ECOMMERCE_NODES.length,
  edgeCount: ECOMMERCE_EDGES.length,
  models: ['User', 'Product', 'Category', 'Order', 'Inventory', 'Review'],
  nodes: ECOMMERCE_NODES,
  edges: ECOMMERCE_EDGES,
};