import { useMemo } from "react";
import { getChildren } from "../components/children";
import { RenderComponentProps } from "../types/render";

/**
 * A helper hook that streamlines the generation of children for DynamicRender components.
 * Note that even placing this below logic of a component may still render before its parent.
 * If using this, be sure that any child logic doesn't depend on the parent.
 * @param props - The common props of a render component
 * @returns An array of JSX.Elements
 */
export function useChildren(props: RenderComponentProps): JSX.Element[] {
  const children = useMemo(() => getChildren(props.node.childNodes), [props.node.childNodes]);
  return children;
}
