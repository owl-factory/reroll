import { gql, useLazyQuery } from "@apollo/client";
import { ActorController, ActorSheet } from "nodes/actor-sheets";
import React from "react";

interface ActorViewProps {
  activeActor: string | null;
}

// Gets the actor for rendering a character sheet
const GET_ACTOR = gql`
  query GetMyCharacter($id: String!) {
    actor(id: $id, include: { actorSheet: true, ruleset: true }) {
      id, 
      name,
      fields,
      content,
      actorSheet {
        id,
        name,
        layout,
        styling
      },
      ruleset {
        id,
        name,
        rules
      }
    }
  }
`;

export function ActorView(props: ActorViewProps) {
  const [ getActor, { data, loading, error }] = useLazyQuery(GET_ACTOR);

  // Handles the changing actor, allowing the sheet to update
  React.useEffect(() => {
    if (props.activeActor === null) { return; }

    getActor({ variables: { id: props.activeActor } });
    const previousActor = props.activeActor;

    return () => {
      ActorController.endRender(previousActor);
    };
  }, [props.activeActor]);

  // Loads and creates the render
  React.useEffect(() => {
    if (loading || error || !data || props.activeActor === null) { return; }
    ActorController.loadActor(data.actor.id, data.actor);
    ActorController.loadRuleset(data.actor.ruleset.id, data.actor.ruleset);
    ActorController.loadSheet(data.actor.actorSheet.id, data.actor.actorSheet);

    ActorController.newRender(
      data.actor.id,
      data.actor.ruleset.id,
      data.actor.actorSheet.id,
      props.activeActor
    );
  });

  if (props.activeActor === null) {
    return <>Select a character</>;
  }

  if (loading || data === undefined) { <>Loading</>; }
  if (error) { <>Error! {error}</>; }

  return <><ActorSheet id={props.activeActor}/></>;
}
