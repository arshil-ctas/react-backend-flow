import type { Node, Edge } from '@xyflow/react';
import type { ModelField, ModelNodeData, HookNodeData, ControlNodeData, FileRegistryNodeData, CrudNodeData } from '../types';

const f = (id: string, name: string, type: ModelField['type'], opts: ModelField['options'] = {}, identity?: boolean): ModelField => ({ id, name, type, options: opts, isIdentity: identity });

export const templateNodes: Node[] = [
  // ═══════════════════════════════════════════════════════════════════
  // MODELS (8)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'm_user', type: 'modelNode', position: { x: 20, y: 50 },
    data: {
      modelName: 'User', collectionName: 'users', timestamps: true, softDelete: false,
      fields: [
        f('u1', '_id', 'ObjectId', {}, true),
        f('u2', 'email', 'String', { required: true, unique: true, trim: true, lowercase: true, index: true }),
        f('u3', 'password', 'String', { required: true }),
        f('u4', 'name', 'String', { required: true, trim: true }),
        f('u5', 'role', 'String', { enum: ['admin', 'editor', 'viewer'], default: 'viewer' }),
        f('u6', 'status', 'String', { enum: ['active', 'inactive', 'suspended'], default: 'active' }),
        f('u7', 'avatar', 'String'),
        f('u8', 'phone', 'String', { trim: true }),
        f('u9', 'lastLogin', 'Date'),
        f('u10', 'permissions', 'Array'),
        f('u11', 'profile', 'Mixed'),
        f('u12', 'metadata', 'Map'),
      ],
    } as ModelNodeData,
  },
  {
    id: 'm_product', type: 'modelNode', position: { x: 40, y: 300 },
    data: {
      modelName: 'Product', collectionName: 'products', timestamps: true, softDelete: false,
      fields: [
        f('p1', '_id', 'ObjectId', {}, true),
        f('p2', 'name', 'String', { required: true, trim: true }),
        f('p3', 'slug', 'String', { required: true, unique: true, index: true }),
        f('p4', 'description', 'String'),
        f('p5', 'price', 'Number', { required: true, min: 0 }),
        f('p6', 'comparePrice', 'Number'),
        f('p7', 'category', 'ObjectId', { ref: 'Category' }),
        f('p8', 'tags', 'Array'),
        f('p9', 'variants', 'Array'),
        f('p10', 'status', 'String', { enum: ['draft', 'active', 'archived'], default: 'draft' }),
        f('p11', 'images', 'Array'),
        f('p12', 'weight', 'Number'),
        f('p13', 'sku', 'String', { unique: true, sparse: true }),
        f('p14', 'metadata', 'Mixed'),
        f('p15', 'rating', 'Number', { default: '0', min: 0, max: 5 }),
        f('p16', 'stockCount', 'Number', { default: '0' }),
      ],
    } as ModelNodeData,
  },
  {
    id: 'm_category', type: 'modelNode', position: { x: 40, y: 780 },
    data: {
      modelName: 'Category', collectionName: 'categories', timestamps: true, softDelete: false,
      fields: [
        f('c1', '_id', 'ObjectId', {}, true),
        f('c2', 'name', 'String', { required: true, trim: true }),
        f('c3', 'slug', 'String', { required: true, unique: true, index: true, lowercase: true }),
        f('c4', 'description', 'String'),
        f('c5', 'parent', 'ObjectId', { ref: 'Category' }),
        f('c6', 'icon', 'String'),
        f('c7', 'order', 'Number', { default: '0' }),
        f('c8', 'isActive', 'Boolean', { default: 'true' }),
        f('c9', 'seoTitle', 'String'),
        f('c10', 'seoDescription', 'String'),
      ],
    } as ModelNodeData,
  },
  {
    id: 'm_order', type: 'modelNode', position: { x: 40, y: 1140 },
    data: {
      modelName: 'Order', collectionName: 'orders', timestamps: true, softDelete: false,
      fields: [
        f('o1', '_id', 'ObjectId', {}, true),
        f('o2', 'orderNumber', 'Number', { unique: true, autoIncrement: true }),
        f('o3', 'customer', 'ObjectId', { ref: 'User', required: true, index: true }),
        f('o4', 'items', 'Array'),
        f('o5', 'status', 'String', { enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }),
        f('o6', 'subtotal', 'Number', { required: true, min: 0 }),
        f('o7', 'tax', 'Number', { default: '0' }),
        f('o8', 'shipping', 'Number', { default: '0' }),
        f('o9', 'total', 'Number', { required: true, min: 0 }),
        f('o10', 'shippingAddress', 'Mixed'),
        f('o11', 'paymentMethod', 'String'),
        f('o12', 'paymentStatus', 'String', { enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }),
        f('o13', 'notes', 'String'),
        f('o14', 'timeline', 'Array'),
        f('o15', 'coupon', 'String'),
        f('o16', 'currency', 'String', { default: 'USD' }),
      ],
    } as ModelNodeData,
  },
  {
    id: 'm_inventory', type: 'modelNode', position: { x: 40, y: 1500 },
    data: {
      modelName: 'Inventory', collectionName: 'inventories', timestamps: true, softDelete: false,
      fields: [
        f('i1', '_id', 'ObjectId', {}, true),
        f('i2', 'product', 'ObjectId', { ref: 'Product', required: true, unique: true, index: true }),
        f('i3', 'warehouse', 'String', { required: true }),
        f('i4', 'quantity', 'Number', { required: true, min: 0 }),
        f('i5', 'reserved', 'Number', { default: '0', min: 0 }),
        f('i6', 'reorderPoint', 'Number', { required: true, min: 0 }),
        f('i7', 'sku', 'String', { required: true, index: true }),
        f('i8', 'location', 'String'),
        f('i9', 'batch', 'String'),
        f('i10', 'expiryDate', 'Date'),
        f('i11', 'status', 'String', { enum: ['instock', 'low', 'outofstock', 'discontinued'], default: 'instock' }),
        f('i12', 'supplier', 'String'),
        f('i13', 'unitCost', 'Number'),
      ],
    } as ModelNodeData,
  },
  {
    id: 'm_review', type: 'modelNode', position: { x: 40, y: 1860 },
    data: {
      modelName: 'Review', collectionName: 'reviews', timestamps: true, softDelete: false,
      fields: [
        f('r1', '_id', 'ObjectId', {}, true),
        f('r2', 'product', 'ObjectId', { ref: 'Product', required: true, index: true }),
        f('r3', 'user', 'ObjectId', { ref: 'User', required: true, index: true }),
        f('r4', 'rating', 'Number', { required: true, min: 1, max: 5 }),
        f('r5', 'title', 'String', { trim: true }),
        f('r6', 'content', 'String'),
        f('r7', 'status', 'String', { enum: ['pending', 'approved', 'rejected'], default: 'pending' }),
        f('r8', 'helpfulVotes', 'Number', { default: '0' }),
        f('r9', 'images', 'Array'),
        f('r10', 'isVerifiedPurchase', 'Boolean', { default: 'false' }),
        f('r11', 'moderationNotes', 'String'),
      ],
    } as ModelNodeData,
  },
  {
    id: 'm_auditlog', type: 'modelNode', position: { x: 40, y: 2220 },
    data: {
      modelName: 'AuditLog', collectionName: 'audit_logs', timestamps: true, softDelete: false,
      fields: [
        f('a1', '_id', 'ObjectId', {}, true),
        f('a2', 'logId', 'Number', { unique: true, autoIncrement: true }),
        f('a3', 'action', 'String', { required: true, enum: ['create', 'update', 'delete', 'login', 'logout', 'export', 'import'], index: true }),
        f('a4', 'entity', 'String', { required: true }),
        f('a5', 'entityId', 'String', { index: true }),
        f('a6', 'userId', 'ObjectId', { ref: 'User', index: true }),
        f('a7', 'changes', 'Mixed'),
        f('a8', 'ip', 'String'),
        f('a9', 'userAgent', 'String'),
        f('a10', 'duration', 'Number'),
        f('a11', 'success', 'Boolean', { default: 'true' }),
        f('a12', 'metadata', 'Map'),
        f('a13', 'timestamp', 'Date', { default: 'now' }),
      ],
    } as ModelNodeData,
  },
  {
    id: 'm_notification', type: 'modelNode', position: { x: 40, y: 2580 },
    data: {
      modelName: 'Notification', collectionName: 'notifications', timestamps: true, softDelete: false,
      fields: [
        f('n1', '_id', 'ObjectId', {}, true),
        f('n2', 'recipient', 'ObjectId', { ref: 'User', required: true, index: true }),
        f('n3', 'type', 'String', { required: true, enum: ['email', 'push', 'sms', 'inapp'] }),
        f('n4', 'title', 'String', { required: true }),
        f('n5', 'message', 'String', { required: true }),
        f('n6', 'data', 'Mixed'),
        f('n7', 'priority', 'String', { enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' }),
        f('n8', 'status', 'String', { enum: ['pending', 'sent', 'failed', 'read'], default: 'pending' }),
        f('n9', 'readAt', 'Date'),
        f('n10', 'scheduledAt', 'Date'),
        f('n11', 'sentAt', 'Date'),
        f('n12', 'attachments', 'Array'),
      ],
    } as ModelNodeData,
  },

  // ═══════════════════════════════════════════════════════════════════
  // HOOKS (23)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'hk_user_hash', type: 'hookNode', position: { x: 370, y: 30 },
    data: { hooks: [{ id: 'h1', timing: 'pre', event: 'save', action: 'hashPassword', watchFields: ['password'] }] } as HookNodeData,
  },
  {
    id: 'hk_user_email', type: 'hookNode', position: { x: 370, y: 130 },
    data: { hooks: [{ id: 'h2', timing: 'post', event: 'save', action: 'sendEmail', condition: 'this.email' }] } as HookNodeData,
  },
  {
    id: 'hk_user_unique', type: 'hookNode', position: { x: 370, y: 230 },
    data: { hooks: [{ id: 'h3', timing: 'pre', event: 'validate', action: 'validateUnique', watchFields: ['email'], condition: 'this.isModified("email")' }] } as HookNodeData,
  },
  {
    id: 'hk_prod_slug', type: 'hookNode', position: { x: 370, y: 380 },
    data: { hooks: [{ id: 'h4', timing: 'pre', event: 'save', action: 'generateSlug', watchFields: ['name'] }] } as HookNodeData,
  },
  {
    id: 'hk_prod_price', type: 'hookNode', position: { x: 370, y: 480 },
    data: { hooks: [{ id: 'h5', timing: 'pre', event: 'save', action: 'validateUnique', condition: 'this.price < 0', watchFields: ['price'] }] } as HookNodeData,
  },
  {
    id: 'hk_prod_populate', type: 'hookNode', position: { x: 370, y: 580 },
    data: { hooks: [{ id: 'h6', timing: 'post', event: 'save', action: 'populateVirtuals' }] } as HookNodeData,
  },
  {
    id: 'hk_cat_slug', type: 'hookNode', position: { x: 370, y: 760 },
    data: { hooks: [{ id: 'h7', timing: 'pre', event: 'save', action: 'generateSlug', watchFields: ['name'] }] } as HookNodeData,
  },
  {
    id: 'hk_cat_unique', type: 'hookNode', position: { x: 370, y: 860 },
    data: { hooks: [{ id: 'h8', timing: 'pre', event: 'validate', action: 'validateUnique', watchFields: ['slug'], condition: 'this.isModified("slug")' }] } as HookNodeData,
  },
  {
    id: 'hk_ord_autoincrement', type: 'hookNode', position: { x: 370, y: 1120 },
    data: { hooks: [{ id: 'h9', timing: 'pre', event: 'save', action: 'autoIncrement', watchFields: ['orderNumber'] }] } as HookNodeData,
  },
  {
    id: 'hk_ord_email', type: 'hookNode', position: { x: 370, y: 1220 },
    data: { hooks: [{ id: 'h10', timing: 'post', event: 'save', action: 'sendEmail', condition: 'this.status === "confirmed"' }] } as HookNodeData,
  },
  {
    id: 'hk_ord_timestamp', type: 'hookNode', position: { x: 370, y: 1320 },
    data: { hooks: [{ id: 'h11', timing: 'post', event: 'findOneAndUpdate', action: 'updateTimestamp' }] } as HookNodeData,
  },
  {
    id: 'hk_inv_timestamp', type: 'hookNode', position: { x: 370, y: 1480 },
    data: { hooks: [{ id: 'h12', timing: 'pre', event: 'update', action: 'updateTimestamp' }] } as HookNodeData,
  },
  {
    id: 'hk_inv_stock', type: 'hookNode', position: { x: 370, y: 1580 },
    data: { hooks: [{ id: 'h13', timing: 'pre', event: 'validate', action: 'validateUnique', condition: 'this.quantity < 0 || this.reserved > this.quantity', watchFields: ['quantity', 'reserved'] }] } as HookNodeData,
  },
  {
    id: 'hk_inv_reorder', type: 'hookNode', position: { x: 370, y: 1680 },
    data: { hooks: [{ id: 'h14', timing: 'post', event: 'save', action: 'updateTimestamp', condition: 'this.quantity <= this.reorderPoint' }] } as HookNodeData,
  },
  {
    id: 'hk_rev_rating', type: 'hookNode', position: { x: 370, y: 1840 },
    data: { hooks: [{ id: 'h15', timing: 'pre', event: 'save', action: 'updateTimestamp', watchFields: ['rating'], condition: 'this.rating < 1 || this.rating > 5' }] } as HookNodeData,
  },
  {
    id: 'hk_rev_update', type: 'hookNode', position: { x: 370, y: 1940 },
    data: { hooks: [{ id: 'h16', timing: 'post', event: 'save', action: 'updateTimestamp', watchFields: ['rating'] }] } as HookNodeData,
  },
  {
    id: 'hk_audit_autoincrement', type: 'hookNode', position: { x: 370, y: 2200 },
    data: { hooks: [{ id: 'h17', timing: 'pre', event: 'save', action: 'autoIncrement', watchFields: ['logId'] }] } as HookNodeData,
  },
  {
    id: 'hk_audit_sanitize', type: 'hookNode', position: { x: 370, y: 2300 },
    data: { hooks: [{ id: 'h18', timing: 'pre', event: 'save', action: 'custom', customCode: 'if (this.changes && typeof this.changes === "object") { Object.keys(this.changes).forEach(k => { if (k.includes("password")) delete this.changes[k]; }); }' }] } as HookNodeData,
  },
  {
    id: 'hk_notif_format', type: 'hookNode', position: { x: 370, y: 2560 },
    data: { hooks: [{ id: 'h19', timing: 'pre', event: 'save', action: 'custom', customCode: 'this.title = this.title?.trim(); this.message = this.message?.trim();' }] } as HookNodeData,
  },
  {
    id: 'hk_notif_push', type: 'hookNode', position: { x: 370, y: 2660 },
    data: { hooks: [{ id: 'h20', timing: 'post', event: 'save', action: 'sendEmail', condition: 'this.priority === "high" || this.priority === "urgent"' }] } as HookNodeData,
  },
  {
    id: 'hk_notif_cleanup', type: 'hookNode', position: { x: 370, y: 2760 },
    data: { hooks: [{ id: 'h21', timing: 'pre', event: 'remove', action: 'custom', customCode: 'if (this.attachments?.length) { console.log("Cleaning up", this.attachments.length, "attachments"); }' }] } as HookNodeData,
  },
  {
    id: 'hk_user_import', type: 'hookNode', position: { x: 370, y: 2860 },
    data: { hooks: [{ id: 'h22', timing: 'pre', event: 'insertMany', action: 'hashPassword', watchFields: ['password'] }] } as HookNodeData,
  },
  {
    id: 'hk_ord_init', type: 'hookNode', position: { x: 370, y: 2960 },
    data: { hooks: [{ id: 'h23', timing: 'post', event: 'init', action: 'custom', customCode: 'this._originalStatus = this.status;' }] } as HookNodeData,
  },

  // ═══════════════════════════════════════════════════════════════════
  // CONTROL FLOW (20)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'ctrl_role_check', type: 'controlNode', position: { x: 700, y: 50 },
    data: { controlType: 'if', condition: 'user.role === "admin"', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_perm_foreach', type: 'controlNode', position: { x: 700, y: 160 },
    data: { controlType: 'forEach', condition: '', iteratorVar: 'perm', accumulator: '', body: 'console.log(perm)' } as ControlNodeData,
  },
  {
    id: 'ctrl_var_map', type: 'controlNode', position: { x: 700, y: 380 },
    data: { controlType: 'map', condition: '', iteratorVar: 'variant', accumulator: '', body: '{ ...variant, price: variant.price * 1.1 }' } as ControlNodeData,
  },
  {
    id: 'ctrl_active_filter', type: 'controlNode', position: { x: 700, y: 490 },
    data: { controlType: 'filter', condition: '', iteratorVar: 'product', accumulator: '', body: 'product.status === "active"' } as ControlNodeData,
  },
  {
    id: 'ctrl_price_reduce', type: 'controlNode', position: { x: 700, y: 600 },
    data: { controlType: 'reduce', condition: '', iteratorVar: 'p', accumulator: 'acc', body: '{ min: Math.min(acc.min, p.price), max: Math.max(acc.max, p.price) }' } as ControlNodeData,
  },
  {
    id: 'ctrl_cat_active', type: 'controlNode', position: { x: 700, y: 760 },
    data: { controlType: 'if', condition: 'category.isActive === true', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_cat_switch', type: 'controlNode', position: { x: 700, y: 870 },
    data: { controlType: 'switch', condition: 'category.sortBy', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_order_status', type: 'controlNode', position: { x: 700, y: 1120 },
    data: { controlType: 'switch', condition: 'order.status', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_order_items', type: 'controlNode', position: { x: 700, y: 1230 },
    data: { controlType: 'forEach', condition: '', iteratorVar: 'item', accumulator: '', body: 'order.total += item.price * item.qty' } as ControlNodeData,
  },
  {
    id: 'ctrl_order_total', type: 'controlNode', position: { x: 700, y: 1340 },
    data: { controlType: 'reduce', condition: '', iteratorVar: 'item', accumulator: 'sum', body: 'sum + item.price * item.quantity' } as ControlNodeData,
  },
  {
    id: 'ctrl_inv_reorder', type: 'controlNode', position: { x: 700, y: 1500 },
    data: { controlType: 'if', condition: 'inventory.quantity <= inventory.reorderPoint', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_inv_try', type: 'controlNode', position: { x: 700, y: 1610 },
    data: { controlType: 'try-catch', condition: '', iteratorVar: '', accumulator: '', body: 'inventory.quantity -= orderItem.qty' } as ControlNodeData,
  },
  {
    id: 'ctrl_rev_filter', type: 'controlNode', position: { x: 700, y: 1840 },
    data: { controlType: 'filter', condition: '', iteratorVar: 'review', accumulator: '', body: 'review.rating >= 4' } as ControlNodeData,
  },
  {
    id: 'ctrl_rev_map', type: 'controlNode', position: { x: 700, y: 1950 },
    data: { controlType: 'map', condition: '', iteratorVar: 'review', accumulator: '', body: '{ ...review, shortContent: review.content?.slice(0, 100) }' } as ControlNodeData,
  },
  {
    id: 'ctrl_audit_keys', type: 'controlNode', position: { x: 700, y: 2200 },
    data: { controlType: 'objectKeys', condition: '', iteratorVar: 'key', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_audit_critical', type: 'controlNode', position: { x: 700, y: 2310 },
    data: { controlType: 'if', condition: 'audit.action === "delete" || audit.action === "export"', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_notif_priority', type: 'controlNode', position: { x: 700, y: 2560 },
    data: { controlType: 'if', condition: 'notification.priority === "high"', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_notif_batch', type: 'controlNode', position: { x: 700, y: 2670 },
    data: { controlType: 'forEach', condition: '', iteratorVar: 'notif', accumulator: '', body: 'sendNotification(notif)' } as ControlNodeData,
  },
  {
    id: 'ctrl_user_filter', type: 'controlNode', position: { x: 700, y: 2880 },
    data: { controlType: 'filter', condition: '', iteratorVar: 'user', accumulator: '', body: 'user.status === "active"' } as ControlNodeData,
  },
  {
    id: 'ctrl_prod_entries', type: 'controlNode', position: { x: 700, y: 2990 },
    data: { controlType: 'objectEntries', condition: '', iteratorVar: 'entry', accumulator: '', body: '' } as ControlNodeData,
  },

  // ═══════════════════════════════════════════════════════════════════
  // FILE REGISTRIES (7)
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'fr_user_import', type: 'fileRegistryNode', position: { x: 1050, y: 50 },
    data: {
      registryName: 'User Import', targetModel: 'm_user', operation: 'upsert', batchSize: 500,
      conditionalDispatch: '',
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
      columns: [
        { header: 'email', fieldPath: 'email', required: true },
        { header: 'password', fieldPath: 'password', required: true },
        { header: 'name', fieldPath: 'name', required: true },
        { header: 'role', fieldPath: 'role', defaultValue: 'viewer' },
        { header: 'status', fieldPath: 'status', defaultValue: 'active' },
        { header: 'phone', fieldPath: 'phone' },
      ],
    } as FileRegistryNodeData,
  },
  {
    id: 'fr_prod_catalog', type: 'fileRegistryNode', position: { x: 1050, y: 380 },
    data: {
      registryName: 'Product Catalog', targetModel: 'm_product', operation: 'upsert', batchSize: 200,
      conditionalDispatch: '',
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'error' },
      columns: [
        { header: 'name', fieldPath: 'name', required: true },
        { header: 'slug', fieldPath: 'slug', required: true },
        { header: 'price', fieldPath: 'price', required: true },
        { header: 'category', fieldPath: 'category' },
        { header: 'tags', fieldPath: 'tags' },
        { header: 'status', fieldPath: 'status', defaultValue: 'draft' },
        { header: 'sku', fieldPath: 'sku', isIdentity: true, identityField: 'sku' },
        { header: 'weight', fieldPath: 'weight' },
        { header: 'description', fieldPath: 'description' },
      ],
    } as FileRegistryNodeData,
  },
  {
    id: 'fr_cat_import', type: 'fileRegistryNode', position: { x: 1050, y: 760 },
    data: {
      registryName: 'Category Import', targetModel: 'm_category', operation: 'create', batchSize: 1000,
      conditionalDispatch: '',
      arrayConfig: { shape: 'flat-csv', emptyRowHandling: 'skip' },
      columns: [
        { header: 'name', fieldPath: 'name', required: true },
        { header: 'slug', fieldPath: 'slug', required: true },
        { header: 'description', fieldPath: 'description' },
        { header: 'parent', fieldPath: 'parent' },
        { header: 'order', fieldPath: 'order', defaultValue: '0' },
        { header: 'isActive', fieldPath: 'isActive', defaultValue: 'true' },
      ],
    } as FileRegistryNodeData,
  },
  {
    id: 'fr_order_import', type: 'fileRegistryNode', position: { x: 1050, y: 1120 },
    data: {
      registryName: 'Order Import', targetModel: 'm_order', operation: 'create', batchSize: 100,
      conditionalDispatch: '',
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'error' },
      columns: [
        { header: 'orderNumber', fieldPath: 'orderNumber', autoIncrement: true, autoIncrementStart: 10000 },
        { header: 'customer', fieldPath: 'customer', required: true },
        { header: 'subtotal', fieldPath: 'subtotal', required: true },
        { header: 'tax', fieldPath: 'tax', defaultValue: '0' },
        { header: 'shipping', fieldPath: 'shipping', defaultValue: '0' },
        { header: 'total', fieldPath: 'total', required: true },
        { header: 'status', fieldPath: 'status', defaultValue: 'pending' },
        { header: 'paymentMethod', fieldPath: 'paymentMethod' },
        { header: 'currency', fieldPath: 'currency', defaultValue: 'USD' },
      ],
    } as FileRegistryNodeData,
  },
  {
    id: 'fr_inv_update', type: 'fileRegistryNode', position: { x: 1050, y: 1480 },
    data: {
      registryName: 'Inventory Update', targetModel: 'm_inventory', operation: 'update', batchSize: 500,
      conditionalDispatch: '',
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
      columns: [
        { header: 'sku', fieldPath: 'sku', isIdentity: true, identityField: 'sku', required: true },
        { header: 'quantity', fieldPath: 'quantity', required: true },
        { header: 'reserved', fieldPath: 'reserved', defaultValue: '0' },
        { header: 'reorderPoint', fieldPath: 'reorderPoint' },
        { header: 'location', fieldPath: 'location' },
        { header: 'status', fieldPath: 'status' },
        { header: 'warehouse', fieldPath: 'warehouse', required: true },
      ],
    } as FileRegistryNodeData,
  },
  {
    id: 'fr_rev_import', type: 'fileRegistryNode', position: { x: 1050, y: 1840 },
    data: {
      registryName: 'Review Import', targetModel: 'm_review', operation: 'create', batchSize: 300,
      conditionalDispatch: 'row.rating >= 3 ? "create" : "skip"',
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'useDefault' },
      columns: [
        { header: 'product', fieldPath: 'product', required: true },
        { header: 'user', fieldPath: 'user', required: true },
        { header: 'rating', fieldPath: 'rating', required: true },
        { header: 'title', fieldPath: 'title' },
        { header: 'content', fieldPath: 'content' },
        { header: 'status', fieldPath: 'status', defaultValue: 'pending' },
      ],
    } as FileRegistryNodeData,
  },
  {
    id: 'fr_notif_bulk', type: 'fileRegistryNode', position: { x: 1050, y: 2560 },
    data: {
      registryName: 'Bulk Notification', targetModel: 'm_notification', operation: 'bulkWrite', batchSize: 1000,
      conditionalDispatch: '',
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
      columns: [
        { header: 'recipient', fieldPath: 'recipient', required: true },
        { header: 'type', fieldPath: 'type', required: true },
        { header: 'title', fieldPath: 'title', required: true },
        { header: 'message', fieldPath: 'message', required: true },
        { header: 'priority', fieldPath: 'priority', defaultValue: 'normal' },
        { header: 'scheduledAt', fieldPath: 'scheduledAt' },
      ],
    } as FileRegistryNodeData,
  },

  // ═══════════════════════════════════════════════════════════════════
  // CRUD NODES (53)
  // ═══════════════════════════════════════════════════════════════════
  // ── User CRUD ──
  { id: 'crud_user_find', type: 'crudNode', position: { x: 1430, y: 20 }, data: { operation: 'find', model: 'User', filter: '{}' } as CrudNodeData },
  { id: 'crud_user_findOne', type: 'crudNode', position: { x: 1430, y: 100 }, data: { operation: 'findOne', model: 'User', filter: '{ _id: id }' } as CrudNodeData },
  { id: 'crud_user_create', type: 'crudNode', position: { x: 1430, y: 180 }, data: { operation: 'create', model: 'User', filter: '', payload: '{ email, password, name, role }' } as CrudNodeData },
  { id: 'crud_user_update', type: 'crudNode', position: { x: 1430, y: 260 }, data: { operation: 'updateOne', model: 'User', filter: '{ _id: id }', payload: '{ $set: { name, role, status } }' } as CrudNodeData },
  { id: 'crud_user_delete', type: 'crudNode', position: { x: 1430, y: 340 }, data: { operation: 'deleteOne', model: 'User', filter: '{ _id: id }' } as CrudNodeData },
  { id: 'crud_user_aggregate', type: 'crudNode', position: { x: 1820, y: 20 }, data: { operation: 'aggregate', model: 'User', filter: '', payload: '[{ $group: { _id: "$role", count: { $sum: 1 } } }]' } as CrudNodeData },
  { id: 'crud_user_count', type: 'crudNode', position: { x: 1820, y: 100 }, data: { operation: 'find', model: 'User', filter: '{ status: "active" }' } as CrudNodeData },
  { id: 'crud_user_updateMany', type: 'crudNode', position: { x: 1820, y: 180 }, data: { operation: 'updateMany', model: 'User', filter: '{ status: "inactive" }', payload: '{ $set: { status: "active" } }' } as CrudNodeData },

  // ── Product CRUD ──
  { id: 'crud_prod_find', type: 'crudNode', position: { x: 1430, y: 390 }, data: { operation: 'find', model: 'Product', filter: '{ status: "active" }' } as CrudNodeData },
  { id: 'crud_prod_findOne', type: 'crudNode', position: { x: 1430, y: 470 }, data: { operation: 'findOne', model: 'Product', filter: '{ slug }' } as CrudNodeData },
  { id: 'crud_prod_create', type: 'crudNode', position: { x: 1430, y: 550 }, data: { operation: 'create', model: 'Product', filter: '', payload: '{ name, price, category, sku }' } as CrudNodeData },
  { id: 'crud_prod_update', type: 'crudNode', position: { x: 1430, y: 630 }, data: { operation: 'updateOne', model: 'Product', filter: '{ _id: id }', payload: '{ $set: { price, status, stockCount }, $push: { tags: tag } }' } as CrudNodeData },
  { id: 'crud_prod_delete', type: 'crudNode', position: { x: 1430, y: 710 }, data: { operation: 'deleteOne', model: 'Product', filter: '{ _id: id }' } as CrudNodeData },
  { id: 'crud_prod_aggregate', type: 'crudNode', position: { x: 1820, y: 390 }, data: { operation: 'aggregate', model: 'Product', filter: '', payload: '[{ $group: { _id: "$category", avgPrice: { $avg: "$price" }, count: { $sum: 1 } } }]' } as CrudNodeData },
  { id: 'crud_prod_updateMany', type: 'crudNode', position: { x: 1820, y: 470 }, data: { operation: 'updateMany', model: 'Product', filter: '{ category: catId }', payload: '{ $set: { status: "archived" } }' } as CrudNodeData },

  // ── Category CRUD ──
  { id: 'crud_cat_find', type: 'crudNode', position: { x: 1430, y: 770 }, data: { operation: 'find', model: 'Category', filter: '{ isActive: true }' } as CrudNodeData },
  { id: 'crud_cat_findOne', type: 'crudNode', position: { x: 1430, y: 850 }, data: { operation: 'findOne', model: 'Category', filter: '{ slug }' } as CrudNodeData },
  { id: 'crud_cat_create', type: 'crudNode', position: { x: 1430, y: 930 }, data: { operation: 'create', model: 'Category', filter: '', payload: '{ name, slug, parent }' } as CrudNodeData },
  { id: 'crud_cat_update', type: 'crudNode', position: { x: 1430, y: 1010 }, data: { operation: 'updateOne', model: 'Category', filter: '{ _id: id }', payload: '{ $set: { name, description, order } }' } as CrudNodeData },
  { id: 'crud_cat_delete', type: 'crudNode', position: { x: 1430, y: 1090 }, data: { operation: 'deleteOne', model: 'Category', filter: '{ _id: id }' } as CrudNodeData },
  { id: 'crud_cat_count', type: 'crudNode', position: { x: 1820, y: 770 }, data: { operation: 'find', model: 'Category', filter: '{ parent: null }' } as CrudNodeData },

  // ── Order CRUD ──
  { id: 'crud_ord_find', type: 'crudNode', position: { x: 1430, y: 1140 }, data: { operation: 'find', model: 'Order', filter: '{ customer: userId }' } as CrudNodeData },
  { id: 'crud_ord_findOne', type: 'crudNode', position: { x: 1430, y: 1220 }, data: { operation: 'findOne', model: 'Order', filter: '{ orderNumber }' } as CrudNodeData },
  { id: 'crud_ord_create', type: 'crudNode', position: { x: 1430, y: 1300 }, data: { operation: 'create', model: 'Order', filter: '', payload: '{ customer, items, subtotal, total, shippingAddress }' } as CrudNodeData },
  { id: 'crud_ord_update', type: 'crudNode', position: { x: 1430, y: 1380 }, data: { operation: 'updateOne', model: 'Order', filter: '{ _id: id }', payload: '{ $set: { status, paymentStatus, timeline } }' } as CrudNodeData },
  { id: 'crud_ord_delete', type: 'crudNode', position: { x: 1430, y: 1460 }, data: { operation: 'deleteOne', model: 'Order', filter: '{ _id: id }' } as CrudNodeData },
  { id: 'crud_ord_aggregate', type: 'crudNode', position: { x: 1820, y: 1140 }, data: { operation: 'aggregate', model: 'Order', filter: '', payload: '[{ $group: { _id: "$status", totalSales: { $sum: "$total" }, count: { $sum: 1 } } }]' } as CrudNodeData },
  { id: 'crud_ord_updateMany', type: 'crudNode', position: { x: 1820, y: 1220 }, data: { operation: 'updateMany', model: 'Order', filter: '{ status: "pending", createdAt: { $lt: cutoffDate } }', payload: '{ $set: { status: "cancelled", notes: "Auto-cancelled" } }' } as CrudNodeData },
  { id: 'crud_ord_count', type: 'crudNode', position: { x: 1820, y: 1300 }, data: { operation: 'find', model: 'Order', filter: '{ paymentStatus: "paid" }' } as CrudNodeData },

  // ── Inventory CRUD ──
  { id: 'crud_inv_find', type: 'crudNode', position: { x: 1430, y: 1500 }, data: { operation: 'find', model: 'Inventory', filter: '{ status: "low" }' } as CrudNodeData },
  { id: 'crud_inv_findOne', type: 'crudNode', position: { x: 1430, y: 1580 }, data: { operation: 'findOne', model: 'Inventory', filter: '{ sku }' } as CrudNodeData },
  { id: 'crud_inv_create', type: 'crudNode', position: { x: 1430, y: 1660 }, data: { operation: 'create', model: 'Inventory', filter: '', payload: '{ product, warehouse, quantity, reorderPoint, sku }' } as CrudNodeData },
  { id: 'crud_inv_update', type: 'crudNode', position: { x: 1430, y: 1740 }, data: { operation: 'updateOne', model: 'Inventory', filter: '{ sku }', payload: '{ $inc: { quantity: -1, reserved: 1 } }' } as CrudNodeData },
  { id: 'crud_inv_updateMany', type: 'crudNode', position: { x: 1820, y: 1500 }, data: { operation: 'updateMany', model: 'Inventory', filter: '{ warehouse }', payload: '{ $set: { status: "discontinued" } }' } as CrudNodeData },
  { id: 'crud_inv_aggregate', type: 'crudNode', position: { x: 1820, y: 1580 }, data: { operation: 'aggregate', model: 'Inventory', filter: '', payload: '[{ $group: { _id: "$warehouse", totalQty: { $sum: "$quantity" } } }, { $sort: { totalQty: -1 } }]' } as CrudNodeData },
  { id: 'crud_inv_delete', type: 'crudNode', position: { x: 1820, y: 1660 }, data: { operation: 'deleteOne', model: 'Inventory', filter: '{ _id: id }' } as CrudNodeData },

  // ── Review CRUD ──
  { id: 'crud_rev_find', type: 'crudNode', position: { x: 1430, y: 1850 }, data: { operation: 'find', model: 'Review', filter: '{ product: prodId, status: "approved" }' } as CrudNodeData },
  { id: 'crud_rev_findOne', type: 'crudNode', position: { x: 1430, y: 1930 }, data: { operation: 'findOne', model: 'Review', filter: '{ _id: id }' } as CrudNodeData },
  { id: 'crud_rev_create', type: 'crudNode', position: { x: 1430, y: 2010 }, data: { operation: 'create', model: 'Review', filter: '', payload: '{ product, user, rating, title, content }' } as CrudNodeData },
  { id: 'crud_rev_update', type: 'crudNode', position: { x: 1430, y: 2090 }, data: { operation: 'updateOne', model: 'Review', filter: '{ _id: id }', payload: '{ $set: { status, moderationNotes } }' } as CrudNodeData },
  { id: 'crud_rev_delete', type: 'crudNode', position: { x: 1430, y: 2170 }, data: { operation: 'deleteOne', model: 'Review', filter: '{ _id: id }' } as CrudNodeData },
  { id: 'crud_rev_aggregate', type: 'crudNode', position: { x: 1820, y: 1850 }, data: { operation: 'aggregate', model: 'Review', filter: '', payload: '[{ $group: { _id: "$product", avgRating: { $avg: "$rating" }, total: { $sum: 1 } } }]' } as CrudNodeData },
  { id: 'crud_rev_count', type: 'crudNode', position: { x: 1820, y: 1930 }, data: { operation: 'find', model: 'Review', filter: '{ status: "pending" }' } as CrudNodeData },

  // ── AuditLog CRUD ──
  { id: 'crud_audit_find', type: 'crudNode', position: { x: 1430, y: 2240 }, data: { operation: 'find', model: 'AuditLog', filter: '{ action: "login", success: false }' } as CrudNodeData },
  { id: 'crud_audit_findOne', type: 'crudNode', position: { x: 1430, y: 2320 }, data: { operation: 'findOne', model: 'AuditLog', filter: '{ logId }' } as CrudNodeData },
  { id: 'crud_audit_create', type: 'crudNode', position: { x: 1430, y: 2400 }, data: { operation: 'create', model: 'AuditLog', filter: '', payload: '{ action, entity, entityId, userId, changes, ip }' } as CrudNodeData },
  { id: 'crud_audit_aggregate', type: 'crudNode', position: { x: 1820, y: 2240 }, data: { operation: 'aggregate', model: 'AuditLog', filter: '', payload: '[{ $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } }]' } as CrudNodeData },
  { id: 'crud_audit_count', type: 'crudNode', position: { x: 1820, y: 2320 }, data: { operation: 'find', model: 'AuditLog', filter: '{ action: "export" }' } as CrudNodeData },

  // ── Notification CRUD ──
  { id: 'crud_notif_find', type: 'crudNode', position: { x: 1430, y: 2580 }, data: { operation: 'find', model: 'Notification', filter: '{ recipient: userId, status: "pending" }' } as CrudNodeData },
  { id: 'crud_notif_findOne', type: 'crudNode', position: { x: 1430, y: 2660 }, data: { operation: 'findOne', model: 'Notification', filter: '{ _id: id }' } as CrudNodeData },
  { id: 'crud_notif_create', type: 'crudNode', position: { x: 1430, y: 2740 }, data: { operation: 'create', model: 'Notification', filter: '', payload: '{ recipient, type, title, message, priority }' } as CrudNodeData },
  { id: 'crud_notif_updateMany', type: 'crudNode', position: { x: 1430, y: 2820 }, data: { operation: 'updateMany', model: 'Notification', filter: '{ recipient: userId, status: "pending" }', payload: '{ $set: { status: "read", readAt: new Date() } }' } as CrudNodeData },
  { id: 'crud_notif_deleteMany', type: 'crudNode', position: { x: 1820, y: 2580 }, data: { operation: 'deleteMany', model: 'Notification', filter: '{ status: "read", readAt: { $lt: cutoffDate } }' } as CrudNodeData },
  { id: 'crud_notif_aggregate', type: 'crudNode', position: { x: 1820, y: 2660 }, data: { operation: 'aggregate', model: 'Notification', filter: '', payload: '[{ $group: { _id: "$type", count: { $sum: 1 } } }]' } as CrudNodeData },
  { id: 'crud_notif_count', type: 'crudNode', position: { x: 1820, y: 2740 }, data: { operation: 'find', model: 'Notification', filter: '{ priority: "urgent", status: "pending" }' } as CrudNodeData },
];

export const templateEdges: Edge[] = [
  // ═══════════════════════════════════════════════════════════════════
  // MODEL → HOOK edges
  // ═══════════════════════════════════════════════════════════════════
  { id: 'e_user_hk1', source: 'm_user', target: 'hk_user_hash', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_user_hk2', source: 'm_user', target: 'hk_user_email', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_user_hk3', source: 'm_user', target: 'hk_user_unique', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_prod_hk4', source: 'm_product', target: 'hk_prod_slug', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_prod_hk5', source: 'm_product', target: 'hk_prod_price', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_prod_hk6', source: 'm_product', target: 'hk_prod_populate', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_cat_hk7', source: 'm_category', target: 'hk_cat_slug', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_cat_hk8', source: 'm_category', target: 'hk_cat_unique', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_ord_hk9', source: 'm_order', target: 'hk_ord_autoincrement', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_ord_hk10', source: 'm_order', target: 'hk_ord_email', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_ord_hk11', source: 'm_order', target: 'hk_ord_timestamp', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_inv_hk12', source: 'm_inventory', target: 'hk_inv_timestamp', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_inv_hk13', source: 'm_inventory', target: 'hk_inv_stock', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_inv_hk14', source: 'm_inventory', target: 'hk_inv_reorder', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_rev_hk15', source: 'm_review', target: 'hk_rev_rating', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_rev_hk16', source: 'm_review', target: 'hk_rev_update', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_audit_hk17', source: 'm_auditlog', target: 'hk_audit_autoincrement', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_audit_hk18', source: 'm_auditlog', target: 'hk_audit_sanitize', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_notif_hk19', source: 'm_notification', target: 'hk_notif_format', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_notif_hk20', source: 'm_notification', target: 'hk_notif_push', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_notif_hk21', source: 'm_notification', target: 'hk_notif_cleanup', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_user_hk22', source: 'm_user', target: 'hk_user_import', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_ord_hk23', source: 'm_order', target: 'hk_ord_init', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },

  // ═══════════════════════════════════════════════════════════════════
  // FILE REGISTRY → MODEL edges
  // ═══════════════════════════════════════════════════════════════════
  { id: 'e_fr_user', source: 'fr_user_import', target: 'm_user', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_prod', source: 'fr_prod_catalog', target: 'm_product', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_cat', source: 'fr_cat_import', target: 'm_category', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_ord', source: 'fr_order_import', target: 'm_order', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_inv', source: 'fr_inv_update', target: 'm_inventory', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_rev', source: 'fr_rev_import', target: 'm_review', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_notif', source: 'fr_notif_bulk', target: 'm_notification', animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },

  // ═══════════════════════════════════════════════════════════════════
  // MODEL → CONTROL FLOW edges
  // ═══════════════════════════════════════════════════════════════════
  { id: 'e_m_ctrl1', source: 'm_user', target: 'ctrl_role_check', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl2', source: 'm_user', target: 'ctrl_perm_foreach', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl3', source: 'm_product', target: 'ctrl_var_map', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl4', source: 'm_product', target: 'ctrl_active_filter', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl5', source: 'm_product', target: 'ctrl_price_reduce', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl6', source: 'm_category', target: 'ctrl_cat_active', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl7', source: 'm_category', target: 'ctrl_cat_switch', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl8', source: 'm_order', target: 'ctrl_order_status', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl9', source: 'm_order', target: 'ctrl_order_items', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl10', source: 'm_order', target: 'ctrl_order_total', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl11', source: 'm_inventory', target: 'ctrl_inv_reorder', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl12', source: 'm_inventory', target: 'ctrl_inv_try', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl13', source: 'm_review', target: 'ctrl_rev_filter', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl14', source: 'm_review', target: 'ctrl_rev_map', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl15', source: 'm_auditlog', target: 'ctrl_audit_keys', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl16', source: 'm_auditlog', target: 'ctrl_audit_critical', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl17', source: 'm_notification', target: 'ctrl_notif_priority', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl18', source: 'm_notification', target: 'ctrl_notif_batch', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl19', source: 'm_user', target: 'ctrl_user_filter', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_ctrl20', source: 'm_product', target: 'ctrl_prod_entries', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },

  // ═══════════════════════════════════════════════════════════════════
  // MODEL → CRUD edges
  // ═══════════════════════════════════════════════════════════════════
  { id: 'e_crud_u1', source: 'm_user', target: 'crud_user_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_u2', source: 'm_user', target: 'crud_user_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_u3', source: 'm_user', target: 'crud_user_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_u4', source: 'm_user', target: 'crud_user_update', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_u5', source: 'm_user', target: 'crud_user_delete', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_u6', source: 'm_user', target: 'crud_user_aggregate', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_u7', source: 'm_user', target: 'crud_user_count', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_u8', source: 'm_user', target: 'crud_user_updateMany', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_p1', source: 'm_product', target: 'crud_prod_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_p2', source: 'm_product', target: 'crud_prod_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_p3', source: 'm_product', target: 'crud_prod_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_p4', source: 'm_product', target: 'crud_prod_update', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_p5', source: 'm_product', target: 'crud_prod_delete', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_p6', source: 'm_product', target: 'crud_prod_aggregate', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_p7', source: 'm_product', target: 'crud_prod_updateMany', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_c1', source: 'm_category', target: 'crud_cat_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_c2', source: 'm_category', target: 'crud_cat_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_c3', source: 'm_category', target: 'crud_cat_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_c4', source: 'm_category', target: 'crud_cat_update', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_c5', source: 'm_category', target: 'crud_cat_delete', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_c6', source: 'm_category', target: 'crud_cat_count', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_o1', source: 'm_order', target: 'crud_ord_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_o2', source: 'm_order', target: 'crud_ord_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_o3', source: 'm_order', target: 'crud_ord_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_o4', source: 'm_order', target: 'crud_ord_update', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_o5', source: 'm_order', target: 'crud_ord_delete', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_o6', source: 'm_order', target: 'crud_ord_aggregate', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_o7', source: 'm_order', target: 'crud_ord_updateMany', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_o8', source: 'm_order', target: 'crud_ord_count', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_i1', source: 'm_inventory', target: 'crud_inv_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_i2', source: 'm_inventory', target: 'crud_inv_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_i3', source: 'm_inventory', target: 'crud_inv_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_i4', source: 'm_inventory', target: 'crud_inv_update', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_i5', source: 'm_inventory', target: 'crud_inv_updateMany', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_i6', source: 'm_inventory', target: 'crud_inv_aggregate', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_i7', source: 'm_inventory', target: 'crud_inv_delete', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_r1', source: 'm_review', target: 'crud_rev_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_r2', source: 'm_review', target: 'crud_rev_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_r3', source: 'm_review', target: 'crud_rev_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_r4', source: 'm_review', target: 'crud_rev_update', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_r5', source: 'm_review', target: 'crud_rev_delete', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_r6', source: 'm_review', target: 'crud_rev_aggregate', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_r7', source: 'm_review', target: 'crud_rev_count', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_a1', source: 'm_auditlog', target: 'crud_audit_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_a2', source: 'm_auditlog', target: 'crud_audit_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_a3', source: 'm_auditlog', target: 'crud_audit_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_a4', source: 'm_auditlog', target: 'crud_audit_aggregate', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_a5', source: 'm_auditlog', target: 'crud_audit_count', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_n1', source: 'm_notification', target: 'crud_notif_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_n2', source: 'm_notification', target: 'crud_notif_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_n3', source: 'm_notification', target: 'crud_notif_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_n4', source: 'm_notification', target: 'crud_notif_updateMany', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_n5', source: 'm_notification', target: 'crud_notif_deleteMany', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_n6', source: 'm_notification', target: 'crud_notif_aggregate', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_crud_n7', source: 'm_notification', target: 'crud_notif_count', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },

  // ═══════════════════════════════════════════════════════════════════
  // INTER-MODEL RELATION edges (ref connections)
  // ═══════════════════════════════════════════════════════════════════
  { id: 'e_rel_prod_cat', source: 'm_product', target: 'm_category', sourceHandle: 'field-p7', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_ord_user', source: 'm_order', target: 'm_user', sourceHandle: 'field-o3', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_inv_prod', source: 'm_inventory', target: 'm_product', sourceHandle: 'field-i2', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_rev_prod', source: 'm_review', target: 'm_product', sourceHandle: 'field-r2', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_rev_user', source: 'm_review', target: 'm_user', sourceHandle: 'field-r3', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_audit_user', source: 'm_auditlog', target: 'm_user', sourceHandle: 'field-a6', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_notif_user', source: 'm_notification', target: 'm_user', sourceHandle: 'field-n2', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_cat_parent', source: 'm_category', target: 'm_category', sourceHandle: 'field-c5', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
];
