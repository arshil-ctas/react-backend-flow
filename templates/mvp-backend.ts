import type { Node, Edge } from '@xyflow/react';
import type { ModelField, ModelNodeData, HookNodeData, ControlNodeData, FileRegistryNodeData, CrudNodeData } from '../types';

const f = (id: string, name: string, type: ModelField['type'], opts: ModelField['options'] = {}, identity?: boolean): ModelField =>
  ({ id, name, type, options: opts, isIdentity: identity });

// ─── LAYOUT CONSTANTS ────────────────────────────────────────────────────────
// Columns:  Models=0  Hooks=450  Controls=800  FileRegs=1150  CRUD=1500  Agg=1850
// Y gap between sibling nodes in the same column: 50px minimum
// Each model "band" owns a vertical slice shared across all columns

// Band start positions (top of each model's section)
const Y = {
  user:         40,
  post:        600,
  comment:    1100,
  tag:        1500,
  media:      1850,
  session:    2200,
  analytics:  2600,
};

const COL = {
  model:    40,
  hook:    440,
  ctrl:    840,
  fr:     1190,
  crud:   1540,
  agg:    1890,
};

// ─── NODES ───────────────────────────────────────────────────────────────────
export const mvpTemplateNodes: Node[] = [

  // ══════════════════════════════════════════
  // MODELS (7)
  // ══════════════════════════════════════════

  {
    id: 'm_user', type: 'modelNode', position: { x: COL.model, y: Y.user },
    data: {
      modelName: 'User', collectionName: 'users', timestamps: true, softDelete: false,
      fields: [
        f('u1', '_id',          'ObjectId', {},                                              true),
        f('u2', 'email',        'String',   { required: true, unique: true, trim: true, lowercase: true, index: true }),
        f('u3', 'password',     'String',   { required: true }),
        f('u4', 'username',     'String',   { required: true, unique: true, trim: true }),
        f('u5', 'displayName',  'String',   { trim: true }),
        f('u6', 'bio',          'String'),
        f('u7', 'avatar',       'String'),
        f('u8', 'role',         'String',   { enum: ['admin','moderator','user'], default: 'user' }),
        f('u9', 'status',       'String',   { enum: ['active','suspended','deleted'], default: 'active' }),
        f('u10','emailVerified','Boolean',  { default: 'false' }),
        f('u11','lastLogin',    'Date'),
        f('u12','metadata',     'Map'),
      ],
    } as ModelNodeData,
  },

  {
    id: 'm_post', type: 'modelNode', position: { x: COL.model, y: Y.post },
    data: {
      modelName: 'Post', collectionName: 'posts', timestamps: true, softDelete: true,
      fields: [
        f('po1', '_id',         'ObjectId', {},                                              true),
        f('po2', 'title',       'String',   { required: true, trim: true }),
        f('po3', 'slug',        'String',   { required: true, unique: true, index: true }),
        f('po4', 'content',     'String',   { required: true }),
        f('po5', 'excerpt',     'String'),
        f('po6', 'author',      'ObjectId', { ref: 'User', required: true, index: true }),
        f('po7', 'tags',        'Array'),
        f('po8', 'status',      'String',   { enum: ['draft','published','archived'], default: 'draft' }),
        f('po9', 'publishedAt', 'Date'),
        f('po10','views',       'Number',   { default: '0' }),
        f('po11','likes',       'Number',   { default: '0' }),
        f('po12','coverImage',  'String'),
        f('po13','seoTitle',    'String'),
        f('po14','seoDesc',     'String'),
      ],
    } as ModelNodeData,
  },

  {
    id: 'm_comment', type: 'modelNode', position: { x: COL.model, y: Y.comment },
    data: {
      modelName: 'Comment', collectionName: 'comments', timestamps: true, softDelete: false,
      fields: [
        f('cm1', '_id',       'ObjectId', {},                                              true),
        f('cm2', 'post',      'ObjectId', { ref: 'Post', required: true, index: true }),
        f('cm3', 'author',    'ObjectId', { ref: 'User', required: true, index: true }),
        f('cm4', 'content',   'String',   { required: true }),
        f('cm5', 'parent',    'ObjectId', { ref: 'Comment' }),
        f('cm6', 'status',    'String',   { enum: ['visible','hidden','flagged'], default: 'visible' }),
        f('cm7', 'likes',     'Number',   { default: '0' }),
        f('cm8', 'edited',    'Boolean',  { default: 'false' }),
        f('cm9', 'editedAt',  'Date'),
      ],
    } as ModelNodeData,
  },

  {
    id: 'm_tag', type: 'modelNode', position: { x: COL.model, y: Y.tag },
    data: {
      modelName: 'Tag', collectionName: 'tags', timestamps: true, softDelete: false,
      fields: [
        f('t1', '_id',         'ObjectId', {},                                         true),
        f('t2', 'name',        'String',   { required: true, unique: true, trim: true }),
        f('t3', 'slug',        'String',   { required: true, unique: true, index: true }),
        f('t4', 'description', 'String'),
        f('t5', 'color',       'String',   { default: '#6366f1' }),
        f('t6', 'postCount',   'Number',   { default: '0' }),
        f('t7', 'isActive',    'Boolean',  { default: 'true' }),
      ],
    } as ModelNodeData,
  },

  {
    id: 'm_media', type: 'modelNode', position: { x: COL.model, y: Y.media },
    data: {
      modelName: 'Media', collectionName: 'media', timestamps: true, softDelete: false,
      fields: [
        f('md1', '_id',        'ObjectId', {},                                         true),
        f('md2', 'uploader',   'ObjectId', { ref: 'User', required: true, index: true }),
        f('md3', 'filename',   'String',   { required: true }),
        f('md4', 'originalName','String',  { required: true }),
        f('md5', 'mimetype',   'String',   { required: true }),
        f('md6', 'size',       'Number',   { required: true }),
        f('md7', 'url',        'String',   { required: true }),
        f('md8', 'type',       'String',   { enum: ['image','video','document','other'], default: 'other' }),
        f('md9', 'alt',        'String'),
        f('md10','metadata',   'Mixed'),
        f('md11','isPublic',   'Boolean',  { default: 'true' }),
      ],
    } as ModelNodeData,
  },

  {
    id: 'm_session', type: 'modelNode', position: { x: COL.model, y: Y.session },
    data: {
      modelName: 'Session', collectionName: 'sessions', timestamps: true, softDelete: false,
      fields: [
        f('s1', '_id',       'ObjectId', {},                                         true),
        f('s2', 'user',      'ObjectId', { ref: 'User', required: true, index: true }),
        f('s3', 'token',     'String',   { required: true, unique: true, index: true }),
        f('s4', 'refreshToken','String', { unique: true }),
        f('s5', 'expiresAt', 'Date',     { required: true, index: true }),
        f('s6', 'ip',        'String'),
        f('s7', 'userAgent', 'String'),
        f('s8', 'isValid',   'Boolean',  { default: 'true', index: true }),
        f('s9', 'lastUsed',  'Date'),
      ],
    } as ModelNodeData,
  },

  {
    id: 'm_analytics', type: 'modelNode', position: { x: COL.model, y: Y.analytics },
    data: {
      modelName: 'Analytics', collectionName: 'analytics', timestamps: true, softDelete: false,
      fields: [
        f('an1', '_id',       'ObjectId', {},                                         true),
        f('an2', 'event',     'String',   { required: true, index: true }),
        f('an3', 'entity',    'String',   { required: true }),
        f('an4', 'entityId',  'ObjectId', { index: true }),
        f('an5', 'user',      'ObjectId', { ref: 'User', index: true }),
        f('an6', 'ip',        'String'),
        f('an7', 'userAgent', 'String'),
        f('an8', 'referer',   'String'),
        f('an9', 'data',      'Mixed'),
        f('an10','timestamp', 'Date',     { default: 'now', index: true }),
        f('an11','sessionId', 'String'),
      ],
    } as ModelNodeData,
  },

  // ══════════════════════════════════════════
  // HOOKS
  // User hooks — y: 40, 110, 180
  // ══════════════════════════════════════════

  {
    id: 'hk_user_password', type: 'hookNode', position: { x: COL.hook, y: Y.user },
    data: { hooks: [{ id: 'h1', timing: 'pre', event: 'save', action: 'hashPassword', watchFields: ['password'], condition: "this.isModified('password')" }] } as HookNodeData,
  },
  {
    id: 'hk_user_verify', type: 'hookNode', position: { x: COL.hook, y: Y.user + 100 },
    data: { hooks: [{ id: 'h2', timing: 'post', event: 'save', action: 'sendEmail', condition: 'this.isNew && !this.emailVerified' }] } as HookNodeData,
  },
  {
    id: 'hk_user_login', type: 'hookNode', position: { x: COL.hook, y: Y.user + 200 },
    data: { hooks: [{ id: 'h3', timing: 'pre', event: 'validate', action: 'validateUnique', watchFields: ['email', 'username'] }] } as HookNodeData,
  },

  // Post hooks — y: 600, 700, 800
  {
    id: 'hk_post_slug', type: 'hookNode', position: { x: COL.hook, y: Y.post },
    data: { hooks: [{ id: 'h4', timing: 'pre', event: 'save', action: 'generateSlug', watchFields: ['title'], condition: "this.isModified('title')" }] } as HookNodeData,
  },
  {
    id: 'hk_post_publish', type: 'hookNode', position: { x: COL.hook, y: Y.post + 100 },
    data: { hooks: [{ id: 'h5', timing: 'pre', event: 'save', action: 'custom', customCode: "if (this.status === 'published' && !this.publishedAt) { this.publishedAt = new Date(); }" }] } as HookNodeData,
  },
  {
    id: 'hk_post_cleanup', type: 'hookNode', position: { x: COL.hook, y: Y.post + 200 },
    data: { hooks: [{ id: 'h6', timing: 'pre', event: 'remove', action: 'custom', customCode: '// cascade delete comments and remove from tag postCounts' }] } as HookNodeData,
  },

  // Comment hooks
  {
    id: 'hk_comment_sanitize', type: 'hookNode', position: { x: COL.hook, y: Y.comment },
    data: { hooks: [{ id: 'h7', timing: 'pre', event: 'save', action: 'custom', customCode: "this.content = this.content?.trim().replace(/<script[^>]*>.*?<\\/script>/gi, '');" }] } as HookNodeData,
  },
  {
    id: 'hk_comment_edited', type: 'hookNode', position: { x: COL.hook, y: Y.comment + 100 },
    data: { hooks: [{ id: 'h8', timing: 'pre', event: 'save', action: 'custom', customCode: "if (!this.isNew && this.isModified('content')) { this.edited = true; this.editedAt = new Date(); }" }] } as HookNodeData,
  },

  // Tag hooks
  {
    id: 'hk_tag_slug', type: 'hookNode', position: { x: COL.hook, y: Y.tag },
    data: { hooks: [{ id: 'h9', timing: 'pre', event: 'save', action: 'generateSlug', watchFields: ['name'] }] } as HookNodeData,
  },

  // Media hooks
  {
    id: 'hk_media_type', type: 'hookNode', position: { x: COL.hook, y: Y.media },
    data: { hooks: [{ id: 'h10', timing: 'pre', event: 'save', action: 'custom', customCode: "const img = ['image/jpeg','image/png','image/webp','image/gif']; const vid = ['video/mp4','video/webm']; this.type = img.includes(this.mimetype) ? 'image' : vid.includes(this.mimetype) ? 'video' : 'document';" }] } as HookNodeData,
  },

  // Session hooks
  {
    id: 'hk_session_expire', type: 'hookNode', position: { x: COL.hook, y: Y.session },
    data: { hooks: [{ id: 'h11', timing: 'pre', event: 'save', action: 'custom', customCode: 'if (this.isNew) { this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); }' }] } as HookNodeData,
  },
  {
    id: 'hk_session_cleanup', type: 'hookNode', position: { x: COL.hook, y: Y.session + 100 },
    data: { hooks: [{ id: 'h12', timing: 'post', event: 'save', action: 'custom', customCode: '// delete expired sessions for this user if count > 5' }] } as HookNodeData,
  },

  // Analytics hooks
  {
    id: 'hk_analytics_ts', type: 'hookNode', position: { x: COL.hook, y: Y.analytics },
    data: { hooks: [{ id: 'h13', timing: 'pre', event: 'save', action: 'updateTimestamp' }] } as HookNodeData,
  },

  // ══════════════════════════════════════════
  // CONTROL FLOW
  // ══════════════════════════════════════════

  // User controls
  {
    id: 'ctrl_role_guard', type: 'controlNode', position: { x: COL.ctrl, y: Y.user },
    data: { controlType: 'if', condition: 'user.role === "admin" || user.role === "moderator"', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_user_filter', type: 'controlNode', position: { x: COL.ctrl, y: Y.user + 100 },
    data: { controlType: 'filter', condition: '', iteratorVar: 'u', accumulator: '', body: 'u.status === "active" && u.emailVerified' } as ControlNodeData,
  },
  {
    id: 'ctrl_perm_map', type: 'controlNode', position: { x: COL.ctrl, y: Y.user + 200 },
    data: { controlType: 'map', condition: '', iteratorVar: 'perm', accumulator: '', body: 'perm.toUpperCase()' } as ControlNodeData,
  },

  // Post controls
  {
    id: 'ctrl_post_status', type: 'controlNode', position: { x: COL.ctrl, y: Y.post },
    data: { controlType: 'switch', condition: 'post.status', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_post_tags', type: 'controlNode', position: { x: COL.ctrl, y: Y.post + 100 },
    data: { controlType: 'forEach', condition: '', iteratorVar: 'tag', accumulator: '', body: 'incrementTagPostCount(tag)' } as ControlNodeData,
  },
  {
    id: 'ctrl_post_try', type: 'controlNode', position: { x: COL.ctrl, y: Y.post + 200 },
    data: { controlType: 'try-catch', condition: '', iteratorVar: '', accumulator: '', body: 'await publishPost(post._id)' } as ControlNodeData,
  },

  // Comment controls
  {
    id: 'ctrl_comment_nest', type: 'controlNode', position: { x: COL.ctrl, y: Y.comment },
    data: { controlType: 'if', condition: 'comment.parent !== null', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_comment_reduce', type: 'controlNode', position: { x: COL.ctrl, y: Y.comment + 100 },
    data: { controlType: 'reduce', condition: '', iteratorVar: 'c', accumulator: 'tree', body: 'buildCommentTree(tree, c)' } as ControlNodeData,
  },

  // Tag controls
  {
    id: 'ctrl_tag_active', type: 'controlNode', position: { x: COL.ctrl, y: Y.tag },
    data: { controlType: 'filter', condition: '', iteratorVar: 'tag', accumulator: '', body: 'tag.isActive && tag.postCount > 0' } as ControlNodeData,
  },

  // Media controls
  {
    id: 'ctrl_media_type', type: 'controlNode', position: { x: COL.ctrl, y: Y.media },
    data: { controlType: 'switch', condition: 'media.type', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_media_size', type: 'controlNode', position: { x: COL.ctrl, y: Y.media + 100 },
    data: { controlType: 'if', condition: 'media.size > 10 * 1024 * 1024', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },

  // Session controls
  {
    id: 'ctrl_session_valid', type: 'controlNode', position: { x: COL.ctrl, y: Y.session },
    data: { controlType: 'if', condition: 'session.isValid && session.expiresAt > new Date()', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },

  // Analytics controls
  {
    id: 'ctrl_analytics_event', type: 'controlNode', position: { x: COL.ctrl, y: Y.analytics },
    data: { controlType: 'switch', condition: 'analytics.event', iteratorVar: '', accumulator: '', body: '' } as ControlNodeData,
  },
  {
    id: 'ctrl_analytics_reduce', type: 'controlNode', position: { x: COL.ctrl, y: Y.analytics + 100 },
    data: { controlType: 'reduce', condition: '', iteratorVar: 'ev', accumulator: 'counts', body: '{ ...counts, [ev.event]: (counts[ev.event] ?? 0) + 1 }' } as ControlNodeData,
  },

  // ══════════════════════════════════════════
  // FILE REGISTRIES
  // ══════════════════════════════════════════

  {
    id: 'fr_users', type: 'fileRegistryNode', position: { x: COL.fr, y: Y.user },
    data: {
      registryName: 'User Seed', targetModel: 'm_user', operation: 'upsert', batchSize: 500,
      conditionalDispatch: '',
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
      columns: [
        { header: 'email',       fieldPath: 'email',       required: true },
        { header: 'password',    fieldPath: 'password',    required: true },
        { header: 'username',    fieldPath: 'username',    required: true },
        { header: 'displayName', fieldPath: 'displayName' },
        { header: 'role',        fieldPath: 'role',        defaultValue: 'user' },
        { header: 'status',      fieldPath: 'status',      defaultValue: 'active' },
      ],
    } as FileRegistryNodeData,
  },

  {
    id: 'fr_posts', type: 'fileRegistryNode', position: { x: COL.fr, y: Y.post },
    data: {
      registryName: 'Post Import', targetModel: 'm_post', operation: 'upsert', batchSize: 200,
      conditionalDispatch: "row.status === 'published' ? 'upsert' : 'create'",
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
      columns: [
        { header: 'title',       fieldPath: 'title',       required: true },
        { header: 'slug',        fieldPath: 'slug',        isIdentity: true },
        { header: 'content',     fieldPath: 'content',     required: true },
        { header: 'excerpt',     fieldPath: 'excerpt' },
        { header: 'author',      fieldPath: 'author',      required: true },
        { header: 'status',      fieldPath: 'status',      defaultValue: 'draft' },
        { header: 'tags',        fieldPath: 'tags',        transform: "(v) => v?.split(',').map(s => s.trim())" },
      ],
    } as FileRegistryNodeData,
  },

  {
    id: 'fr_tags', type: 'fileRegistryNode', position: { x: COL.fr, y: Y.tag },
    data: {
      registryName: 'Tag Seed', targetModel: 'm_tag', operation: 'upsert', batchSize: 1000,
      conditionalDispatch: '',
      arrayConfig: { shape: 'flat-csv', emptyRowHandling: 'skip' },
      columns: [
        { header: 'name',        fieldPath: 'name',        required: true },
        { header: 'slug',        fieldPath: 'slug',        isIdentity: true },
        { header: 'description', fieldPath: 'description' },
        { header: 'color',       fieldPath: 'color',       defaultValue: '#6366f1' },
      ],
    } as FileRegistryNodeData,
  },

  {
    id: 'fr_media', type: 'fileRegistryNode', position: { x: COL.fr, y: Y.media },
    data: {
      registryName: 'Media Import', targetModel: 'm_media', operation: 'create', batchSize: 100,
      conditionalDispatch: '',
      arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'error' },
      columns: [
        { header: 'filename',     fieldPath: 'filename',     required: true },
        { header: 'originalName', fieldPath: 'originalName', required: true },
        { header: 'mimetype',     fieldPath: 'mimetype',     required: true },
        { header: 'size',         fieldPath: 'size',         required: true, transform: '(v) => parseInt(v)' },
        { header: 'url',          fieldPath: 'url',          required: true },
        { header: 'uploader',     fieldPath: 'uploader',     required: true },
        { header: 'alt',          fieldPath: 'alt' },
      ],
    } as FileRegistryNodeData,
  },

  // ══════════════════════════════════════════
  // CRUD NODES
  // Each model gets: find, findOne, create, update, delete  (y spaced 80px)
  // ══════════════════════════════════════════

  // ── User CRUD ──
  { id: 'crud_user_find',      type: 'crudNode', position: { x: COL.crud, y: Y.user },
    data: { operation: 'find',      model: 'User', filter: '{ status: "active" }' } as CrudNodeData },
  { id: 'crud_user_findOne',   type: 'crudNode', position: { x: COL.crud, y: Y.user + 80 },
    data: { operation: 'findOne',   model: 'User', filter: '{ email }' } as CrudNodeData },
  { id: 'crud_user_create',    type: 'crudNode', position: { x: COL.crud, y: Y.user + 160 },
    data: { operation: 'create',    model: 'User', filter: '', payload: '{ email, password, username, role }' } as CrudNodeData },
  { id: 'crud_user_update',    type: 'crudNode', position: { x: COL.crud, y: Y.user + 240 },
    data: { operation: 'updateOne', model: 'User', filter: '{ _id }', payload: '{ $set: { displayName, bio, avatar, status } }' } as CrudNodeData },
  { id: 'crud_user_delete',    type: 'crudNode', position: { x: COL.crud, y: Y.user + 320 },
    data: { operation: 'deleteOne', model: 'User', filter: '{ _id }' } as CrudNodeData },

  // ── Post CRUD ──
  { id: 'crud_post_find',      type: 'crudNode', position: { x: COL.crud, y: Y.post },
    data: { operation: 'find',      model: 'Post', filter: '{ status: "published" }' } as CrudNodeData },
  { id: 'crud_post_findOne',   type: 'crudNode', position: { x: COL.crud, y: Y.post + 80 },
    data: { operation: 'findOne',   model: 'Post', filter: '{ slug }' } as CrudNodeData },
  { id: 'crud_post_create',    type: 'crudNode', position: { x: COL.crud, y: Y.post + 160 },
    data: { operation: 'create',    model: 'Post', filter: '', payload: '{ title, slug, content, author, tags }' } as CrudNodeData },
  { id: 'crud_post_update',    type: 'crudNode', position: { x: COL.crud, y: Y.post + 240 },
    data: { operation: 'updateOne', model: 'Post', filter: '{ _id }', payload: '{ $set: { title, content, status, tags } }' } as CrudNodeData },
  { id: 'crud_post_delete',    type: 'crudNode', position: { x: COL.crud, y: Y.post + 320 },
    data: { operation: 'deleteOne', model: 'Post', filter: '{ _id }' } as CrudNodeData },

  // ── Comment CRUD ──
  { id: 'crud_comment_find',   type: 'crudNode', position: { x: COL.crud, y: Y.comment },
    data: { operation: 'find',      model: 'Comment', filter: '{ post: postId, status: "visible" }' } as CrudNodeData },
  { id: 'crud_comment_create', type: 'crudNode', position: { x: COL.crud, y: Y.comment + 80 },
    data: { operation: 'create',    model: 'Comment', filter: '', payload: '{ post, author, content, parent }' } as CrudNodeData },
  { id: 'crud_comment_update', type: 'crudNode', position: { x: COL.crud, y: Y.comment + 160 },
    data: { operation: 'updateOne', model: 'Comment', filter: '{ _id }', payload: '{ $set: { content, status } }' } as CrudNodeData },
  { id: 'crud_comment_delete', type: 'crudNode', position: { x: COL.crud, y: Y.comment + 240 },
    data: { operation: 'deleteMany',model: 'Comment', filter: '{ post: postId }' } as CrudNodeData },

  // ── Tag CRUD ──
  { id: 'crud_tag_find',       type: 'crudNode', position: { x: COL.crud, y: Y.tag },
    data: { operation: 'find',      model: 'Tag', filter: '{ isActive: true }' } as CrudNodeData },
  { id: 'crud_tag_findOne',    type: 'crudNode', position: { x: COL.crud, y: Y.tag + 80 },
    data: { operation: 'findOne',   model: 'Tag', filter: '{ slug }' } as CrudNodeData },
  { id: 'crud_tag_create',     type: 'crudNode', position: { x: COL.crud, y: Y.tag + 160 },
    data: { operation: 'create',    model: 'Tag', filter: '', payload: '{ name, slug, description, color }' } as CrudNodeData },
  { id: 'crud_tag_update',     type: 'crudNode', position: { x: COL.crud, y: Y.tag + 240 },
    data: { operation: 'updateOne', model: 'Tag', filter: '{ slug }', payload: '{ $inc: { postCount: 1 } }' } as CrudNodeData },

  // ── Media CRUD ──
  { id: 'crud_media_find',     type: 'crudNode', position: { x: COL.crud, y: Y.media },
    data: { operation: 'find',      model: 'Media', filter: '{ uploader: userId, isPublic: true }' } as CrudNodeData },
  { id: 'crud_media_create',   type: 'crudNode', position: { x: COL.crud, y: Y.media + 80 },
    data: { operation: 'create',    model: 'Media', filter: '', payload: '{ filename, mimetype, size, url, uploader }' } as CrudNodeData },
  { id: 'crud_media_delete',   type: 'crudNode', position: { x: COL.crud, y: Y.media + 160 },
    data: { operation: 'deleteOne', model: 'Media', filter: '{ _id, uploader: userId }' } as CrudNodeData },

  // ── Session CRUD ──
  { id: 'crud_session_find',   type: 'crudNode', position: { x: COL.crud, y: Y.session },
    data: { operation: 'find',      model: 'Session', filter: '{ user: userId, isValid: true }' } as CrudNodeData },
  { id: 'crud_session_create', type: 'crudNode', position: { x: COL.crud, y: Y.session + 80 },
    data: { operation: 'create',    model: 'Session', filter: '', payload: '{ user, token, refreshToken, ip, userAgent }' } as CrudNodeData },
  { id: 'crud_session_revoke', type: 'crudNode', position: { x: COL.crud, y: Y.session + 160 },
    data: { operation: 'updateOne', model: 'Session', filter: '{ token }', payload: '{ $set: { isValid: false } }' } as CrudNodeData },
  { id: 'crud_session_purge',  type: 'crudNode', position: { x: COL.crud, y: Y.session + 240 },
    data: { operation: 'deleteMany',model: 'Session', filter: '{ expiresAt: { $lt: new Date() } }' } as CrudNodeData },

  // ── Analytics CRUD ──
  { id: 'crud_analytics_create', type: 'crudNode', position: { x: COL.crud, y: Y.analytics },
    data: { operation: 'create',    model: 'Analytics', filter: '', payload: '{ event, entity, entityId, user, ip, data }' } as CrudNodeData },
  { id: 'crud_analytics_find',   type: 'crudNode', position: { x: COL.crud, y: Y.analytics + 80 },
    data: { operation: 'find',      model: 'Analytics', filter: '{ event, timestamp: { $gte: from, $lte: to } }' } as CrudNodeData },

  // ══════════════════════════════════════════
  // AGGREGATES
  // ══════════════════════════════════════════

  { id: 'agg_user_roles',     type: 'crudNode', position: { x: COL.agg, y: Y.user },
    data: { operation: 'aggregate', model: 'User',
      payload: '[{ $group: { _id: "$role", count: { $sum: 1 } } }, { $sort: { count: -1 } }]' } as CrudNodeData },

  { id: 'agg_user_active',    type: 'crudNode', position: { x: COL.agg, y: Y.user + 100 },
    data: { operation: 'aggregate', model: 'User',
      payload: '[{ $match: { status: "active" } }, { $group: { _id: null, total: { $sum: 1 } } }]' } as CrudNodeData },

  { id: 'agg_post_views',     type: 'crudNode', position: { x: COL.agg, y: Y.post },
    data: { operation: 'aggregate', model: 'Post',
      payload: '[{ $match: { status: "published" } }, { $sort: { views: -1 } }, { $limit: 10 }]' } as CrudNodeData },

  { id: 'agg_post_by_tag',    type: 'crudNode', position: { x: COL.agg, y: Y.post + 100 },
    data: { operation: 'aggregate', model: 'Post',
      payload: '[{ $unwind: "$tags" }, { $group: { _id: "$tags", count: { $sum: 1 } } }, { $sort: { count: -1 } }]' } as CrudNodeData },

  { id: 'agg_comment_counts', type: 'crudNode', position: { x: COL.agg, y: Y.comment },
    data: { operation: 'aggregate', model: 'Comment',
      payload: '[{ $match: { status: "visible" } }, { $group: { _id: "$post", total: { $sum: 1 } } }]' } as CrudNodeData },

  { id: 'agg_tag_popular',    type: 'crudNode', position: { x: COL.agg, y: Y.tag },
    data: { operation: 'aggregate', model: 'Tag',
      payload: '[{ $match: { isActive: true } }, { $sort: { postCount: -1 } }, { $limit: 20 }]' } as CrudNodeData },

  { id: 'agg_media_size',     type: 'crudNode', position: { x: COL.agg, y: Y.media },
    data: { operation: 'aggregate', model: 'Media',
      payload: '[{ $group: { _id: "$uploader", totalSize: { $sum: "$size" }, count: { $sum: 1 } } }, { $sort: { totalSize: -1 } }]' } as CrudNodeData },

  { id: 'agg_analytics_daily',type: 'crudNode', position: { x: COL.agg, y: Y.analytics },
    data: { operation: 'aggregate', model: 'Analytics',
      payload: '[{ $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, events: { $sum: 1 } } }, { $sort: { _id: -1 } }, { $limit: 30 }]' } as CrudNodeData },

  { id: 'agg_analytics_events',type: 'crudNode', position: { x: COL.agg, y: Y.analytics + 100 },
    data: { operation: 'aggregate', model: 'Analytics',
      payload: '[{ $group: { _id: "$event", total: { $sum: 1 } } }, { $sort: { total: -1 } }]' } as CrudNodeData },
];

// ─── EDGES ────────────────────────────────────────────────────────────────────

export const mvpTemplateEdges: Edge[] = [

  // Model → Hook
  { id: 'e_u_hk1',  source: 'm_user',      target: 'hk_user_password',  animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_u_hk2',  source: 'm_user',      target: 'hk_user_verify',    animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_u_hk3',  source: 'm_user',      target: 'hk_user_login',     animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_p_hk4',  source: 'm_post',      target: 'hk_post_slug',      animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_p_hk5',  source: 'm_post',      target: 'hk_post_publish',   animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_p_hk6',  source: 'm_post',      target: 'hk_post_cleanup',   animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_c_hk7',  source: 'm_comment',   target: 'hk_comment_sanitize',animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_c_hk8',  source: 'm_comment',   target: 'hk_comment_edited', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_t_hk9',  source: 'm_tag',       target: 'hk_tag_slug',       animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_m_hk10', source: 'm_media',     target: 'hk_media_type',     animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_s_hk11', source: 'm_session',   target: 'hk_session_expire', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_s_hk12', source: 'm_session',   target: 'hk_session_cleanup',animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: 'e_a_hk13', source: 'm_analytics', target: 'hk_analytics_ts',   animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },

  // Model → Control
  { id: 'e_u_cf1',  source: 'm_user',      target: 'ctrl_role_guard',   animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_u_cf2',  source: 'm_user',      target: 'ctrl_user_filter',  animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_u_cf3',  source: 'm_user',      target: 'ctrl_perm_map',     animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_p_cf4',  source: 'm_post',      target: 'ctrl_post_status',  animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_p_cf5',  source: 'm_post',      target: 'ctrl_post_tags',    animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_p_cf6',  source: 'm_post',      target: 'ctrl_post_try',     animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_c_cf7',  source: 'm_comment',   target: 'ctrl_comment_nest', animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_c_cf8',  source: 'm_comment',   target: 'ctrl_comment_reduce',animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_t_cf9',  source: 'm_tag',       target: 'ctrl_tag_active',   animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_cf10', source: 'm_media',     target: 'ctrl_media_type',   animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_m_cf11', source: 'm_media',     target: 'ctrl_media_size',   animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_s_cf12', source: 'm_session',   target: 'ctrl_session_valid',animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_an_cf13',source: 'm_analytics', target: 'ctrl_analytics_event',animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },
  { id: 'e_an_cf14',source: 'm_analytics', target: 'ctrl_analytics_reduce',animated: true, style: { stroke: '#f472b6', strokeWidth: 1.5 } },

  // File Registry → Model
  { id: 'e_fr_u',   source: 'fr_users',    target: 'm_user',            animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_p',   source: 'fr_posts',    target: 'm_post',            animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_t',   source: 'fr_tags',     target: 'm_tag',             animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },
  { id: 'e_fr_m',   source: 'fr_media',    target: 'm_media',           animated: true, style: { stroke: '#34d399', strokeWidth: 2 } },

  // Model → CRUD
  { id: 'e_u_c1',   source: 'm_user',      target: 'crud_user_find',    animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_u_c2',   source: 'm_user',      target: 'crud_user_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_u_c3',   source: 'm_user',      target: 'crud_user_create',  animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_u_c4',   source: 'm_user',      target: 'crud_user_update',  animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_u_c5',   source: 'm_user',      target: 'crud_user_delete',  animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_p_c1',   source: 'm_post',      target: 'crud_post_find',    animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_p_c2',   source: 'm_post',      target: 'crud_post_findOne', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_p_c3',   source: 'm_post',      target: 'crud_post_create',  animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_p_c4',   source: 'm_post',      target: 'crud_post_update',  animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_p_c5',   source: 'm_post',      target: 'crud_post_delete',  animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_c_c1',   source: 'm_comment',   target: 'crud_comment_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_c_c2',   source: 'm_comment',   target: 'crud_comment_create',animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_c_c3',   source: 'm_comment',   target: 'crud_comment_update',animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_c_c4',   source: 'm_comment',   target: 'crud_comment_delete',animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_t_c1',   source: 'm_tag',       target: 'crud_tag_find',     animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_t_c2',   source: 'm_tag',       target: 'crud_tag_findOne',  animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_t_c3',   source: 'm_tag',       target: 'crud_tag_create',   animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_t_c4',   source: 'm_tag',       target: 'crud_tag_update',   animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_m_c1',   source: 'm_media',     target: 'crud_media_find',   animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_m_c2',   source: 'm_media',     target: 'crud_media_create', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_m_c3',   source: 'm_media',     target: 'crud_media_delete', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_s_c1',   source: 'm_session',   target: 'crud_session_find', animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_s_c2',   source: 'm_session',   target: 'crud_session_create',animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_s_c3',   source: 'm_session',   target: 'crud_session_revoke',animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_s_c4',   source: 'm_session',   target: 'crud_session_purge',animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_an_c1',  source: 'm_analytics', target: 'crud_analytics_create',animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },
  { id: 'e_an_c2',  source: 'm_analytics', target: 'crud_analytics_find',  animated: true, style: { stroke: '#38bdf8', strokeWidth: 1.5 } },

  // CRUD → Aggregates
  { id: 'e_u_agg1', source: 'crud_user_find',  target: 'agg_user_roles',      animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_u_agg2', source: 'crud_user_find',  target: 'agg_user_active',     animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_p_agg1', source: 'crud_post_find',  target: 'agg_post_views',      animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_p_agg2', source: 'crud_post_find',  target: 'agg_post_by_tag',     animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_c_agg1', source: 'crud_comment_find',target: 'agg_comment_counts', animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_t_agg1', source: 'crud_tag_find',   target: 'agg_tag_popular',     animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_m_agg1', source: 'crud_media_find', target: 'agg_media_size',      animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_an_agg1',source: 'crud_analytics_find',target: 'agg_analytics_daily', animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_an_agg2',source: 'crud_analytics_find',target: 'agg_analytics_events',animated: true, style: { stroke: '#a855f7', strokeWidth: 1.5 } },

  // Inter-model relations (dashed)
  { id: 'e_rel_post_user',    source: 'm_post',    target: 'm_user',    animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_comment_post', source: 'm_comment', target: 'm_post',    animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_comment_user', source: 'm_comment', target: 'm_user',    animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_comment_self', source: 'm_comment', target: 'm_comment', animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_media_user',   source: 'm_media',   target: 'm_user',    animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_session_user', source: 'm_session', target: 'm_user',    animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
  { id: 'e_rel_analytics_user',source:'m_analytics',target:'m_user',    animated: true, style: { stroke: '#818cf8', strokeWidth: 2, strokeDasharray: '6 4' } },
];

// ─── Template Metadata ────────────────────────────────────────────────────────

export const MVP_BACKEND_TEMPLATE = {
  id: 'mvp-backend',
  name: 'MVP Backend',
  icon: '🚀',
  description: 'Production-ready MVP: User auth + sessions, Posts with publishing workflow, nested Comments, Tags, Media uploads, and Analytics tracking — with hooks, control flow, file registries, CRUD, and aggregations.',
  tags: ['mongoose', 'mvp', 'blog', 'cms', 'auth', 'full-stack'],
  models: ['User', 'Post', 'Comment', 'Tag', 'Media', 'Session', 'Analytics'],
  nodes: mvpTemplateNodes,
  edges: mvpTemplateEdges,
};