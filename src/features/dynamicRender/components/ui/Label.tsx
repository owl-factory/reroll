import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a label for an input
 */
export function Label(props: RenderComponentProps) {
  const children = useChildren(props.childNodes);
  return <label>{children}</label>;
}

export const labelBundle: RenderComponentBundle = {
  Component: Label,
  nodeType: NodeType.Label,
  attributes: [],
};
