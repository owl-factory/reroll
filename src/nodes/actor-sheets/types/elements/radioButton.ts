import { ParsedExpressionString } from "..";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet radio button element
 */
export interface RadioButtonElementDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedExpressionString;
  name: ParsedExpressionString;
  value: ParsedExpressionString;
  label: ParsedExpressionString;
}
