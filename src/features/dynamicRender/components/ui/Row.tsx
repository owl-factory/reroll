import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a flex-box row
 */
export function Row(props: RenderComponentProps) {
  const children = useChildren(props.childNodes);
  return <div className="flex">{children}</div>;
}

export const rowBundle: RenderComponentBundle = {
  Component: Row,
  nodeType: NodeType.Row,
  attributes: [],
};
