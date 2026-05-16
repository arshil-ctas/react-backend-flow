import { ECOMMERCE_TEMPLATE } from './ecommerce';

export const ALL_TEMPLATES = [ECOMMERCE_TEMPLATE];

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  nodeCount: number;
  edgeCount: number;
  models: string[];
};

export function getTemplateMeta(): TemplateMeta[] {
  return ALL_TEMPLATES.map(({ nodes: _n, edges: _e, ...meta }) => meta);
}

export function getTemplate(id: string) {
  return ALL_TEMPLATES.find((t) => t.id === id) ?? null;
}