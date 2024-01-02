import { DynamicContext } from "features/dynamicRender/context/dynamicContext";
import { buttonAttributes } from "features/dynamicRender/data/attributes/ui/button";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { ButtonAttributes } from "features/dynamicRender/types/attributes/ui/button";
import { ParsedNode, RenderComponentProps } from "features/dynamicRender/types/render";
import { ContextController } from "features/dynamicRender/utils/contextController";
import { parseNodeChildren } from "features/dynamicRender/utils/render";
import { useContext, useMemo } from "react";

const DEFAULT_CLASSES = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

/**
 * Renders a button that performs some action when clicked
 */
export function Button(props: RenderComponentProps) {
  const { attributes } = useAttributes<ButtonAttributes>(props.node, buttonAttributes);
  const context = useContext(DynamicContext);
  const action = useMemo(() => buildAction(attributes, context), [attributes, context]);

  const parsedNodes = parseNodeChildren(props.node.childNodes);
  const children = parsedNodes.map((node: ParsedNode) => <node.Component key={node.key} {...node.props} />);

  return (
    <button className={DEFAULT_CLASSES} type="button" onClick={() => action()}>
      {children}
    </button>
  );
}

/**
 * Builds an action for use with a button
 * @param attributes - The button attributes to build an action for
 * @param context - The Dynamic Render context
 * @returns A function that runs the action when triggered
 */
function buildAction(attributes: Partial<ButtonAttributes>, context: ContextController) {
  const action = attributes.action?.trim().toLocaleLowerCase();
  switch (action) {
    case "collapse":
      if (attributes.target === undefined) break;
      return () => context.state.toggleCollapse(attributes.target);
  }
  return () => {};
}
