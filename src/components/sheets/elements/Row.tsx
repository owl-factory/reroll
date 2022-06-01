import React from "react";
import { RowElement } from "types/layouts/rowElement";
import { SheetElement } from "../SheetElement";
import style from "../styling/Row.module.scss";

interface SheetRowProps {
  element: RowElement;
}

export function SheetRow(props: SheetRowProps) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(<SheetElement element={childElement}/>);
  }
  return (
    <div className={`${style.row}`} style={{}}>
      {elements}
    </div>
  );
}
