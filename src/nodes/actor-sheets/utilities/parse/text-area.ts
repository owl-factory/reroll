import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TextAreaDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";

/**
 * Converts a text area element into a text area element descriptor
 * @param element The text area element to convert
 * @returns A text area element descriptor
 */
export function parseTextAreaElement(element: Element, state: SheetState) {
  const name = element.getAttribute("name");
  if (name === null) { throw "Text Area input requires a name"; }

  const elementDetails: TextAreaDescriptor = {
    $key: state.key,
    element: SheetElementType.TextArea,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    name: splitExpressionValue(name),
  };

  return elementDetails;
}
