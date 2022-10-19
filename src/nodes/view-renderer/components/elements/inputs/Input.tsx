import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer/controllers/ViewRenderer";
import { NumberInputDescriptor, TextInputDescriptor } from "nodes/view-renderer/types/elements";
import React from "react";
import { SheetElementProps } from "../../../types";

const VARIABLE_FIELDS = ["className", "id", "name"];

type IndividualSheetInputProps = SheetElementProps<NumberInputDescriptor | TextInputDescriptor>

interface SheetInputProps extends IndividualSheetInputProps {
  type: string;
}

/**
 * Renders a text input element
 * @param id The id of the render this sheet is using
 * @param element The text input element description
 * @param type The type of the input (number or text)
 */
const SheetInput = observer((props: SheetInputProps) => {
  const ref = React.createRef<HTMLInputElement>();
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<NumberInputDescriptor | TextInputDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  /**
   * Updates the ActorController to have the changed values
   * @param ev The triggering onChange event
   */
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    ViewRenderer.setValue(props, element.name, e.target.value);
    e.target.value = await ViewRenderer.getValue(props, element.name);
  }

  // Handles the case where we have two or more elements of the same name, and one of them is changed
  // This updates the input values so that we are consistent
  // React.useEffect(() => {
  //   if (!ref.current) { return; }
  //   if (ref.current === document.activeElement) { return; }
  //   ref.current.value = ActorController.getActor(props.renderID, element.name, props.properties).toString();
  // }, [ActorController.getActor(props.renderID, element.name, props.properties)]);

  return (
    <div>
      <input
        ref={ref}
        id={element.id}
        type={props.type}
        name={element.name}
        className={`input ${props.type}-input ${element.className}`}
        onChange={onChange}
        autoComplete="off"
        // defaultValue={ViewRenderer.getValue(props.renderID, element.name).toString()}
      />
    </div>
  );
});

/**
 * Renders a number input element
 * @param id The id of the render this sheet is using
 * @param element The text input element description
 */
export function SheetNumberInput(props: IndividualSheetInputProps) {
  return <SheetInput {...props} type="number"/>;
}

/**
 * Renders a text input element
 * @param id The id of the render this sheet is using
 * @param element The text input element description
 */
export function SheetTextInput(props: IndividualSheetInputProps) {
  return <SheetInput {...props} type="text"/>;
}
