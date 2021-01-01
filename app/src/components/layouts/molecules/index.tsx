import React from "react";
import { DynamicAtom } from "../atoms";
import { Atom, Molecule } from "../Layouts";
import { AccordionMolecule } from "./Accordion";

export enum MoleculeType {
  Accordion,
  Div,
}

interface MoleculeProps {
  molecule: Molecule | Atom;
}

/**
 * Renders a single molecule and all of it's atoms or a single atom, depending on 
 * which one is given. 
 * @param props.molecule A single molecule or a single atom. 
 */
export function DynamicMolecule(props: MoleculeProps) {
  // Renders a single atom, since atoms will never have subatoms within them
  // Kind of a weird hack since Javascript doesn't have good typing :(
  if (!("atoms" in props.molecule)) { return <DynamicAtom atom={props.molecule}/>; }

  const atoms: Atom[] = [];
  const molecule = props.molecule as Molecule; // Casting here for reusability
  
  molecule.atoms.forEach((atom: Atom) => {
    atoms.push(<DynamicAtom atom={atom}/>)
  });

  switch(molecule.type) {
    case MoleculeType.Accordion:
      return <AccordionMolecule molecule={molecule}>{atoms}</AccordionMolecule>;  
    case MoleculeType.Div:
      return <div>{atoms}</div>;
    default: 
      return <>{atoms}</>;
  }
}