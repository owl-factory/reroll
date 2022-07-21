import { action, makeObservable, observable } from "mobx";
import { RulesetDocument } from "types/documents";
import { ActorSheetDocument } from "types/documents/ActorSheet";
import { PageElementDescriptor } from "nodes/actor-sheets/types/elements";
import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { SheetController } from "./SheetController";
import { ActorSubController } from "./ActorSubController";
import { RuleVariableGroup, RulesetController } from "./RulesetController";
import { read } from "@owl-factory/utilities/objects";
import { Expression, ParsedExpressionString, SheetProperties } from "../types";
import { ExpressionType } from "../enums/expressionType";
import { ActorContent, ActorDocument } from "types/documents/Actor";
import { Scalar } from "types";

interface RenderGroup {
  actorRef: string;
  sheetRef: string;
  rulesetRef: string; // The actual ruleset, not the campaign
  // campaignRef: string;
}

/**
 * Handles rendering all actor sheets and populating them with data
 */
class $ActorController {
  public $renders: Record<string, RenderGroup> = {};

  protected actorController = new ActorSubController();
  protected rulesetController = new RulesetController();
  protected sheetController = new SheetController<Partial<ActorSheetDocument>>();

  constructor() {
    makeObservable(this, {
      $renders: observable,

      createRender: action,
    });
  }

  /**
   * Initializes a render by grouping together three different values so that accessing each value requires
   * only one unique value instead of three
   * @param actorRef The reference to the actor used in this render. If null, a temporary actor will be used instead
   * @param sheetRef The reference to the sheet used in this render
   * @param rulesetRef The reference to the ruleset used in this render. If null, empty values will be used instead
   * @returns The id used for accessing the elements of this render
   */
  public createRender(actorRef: string | null, sheetRef: string, rulesetRef: string | null): string {
    // Selects the ID. Defaults to actor, but falls back to the sheet if no actor is given
    const id = actorRef ? actorRef : sheetRef;
    if (!actorRef) { actorRef = "temp"; }
    if (!rulesetRef) { rulesetRef = "temp"; }
    this.$renders[id] = { actorRef, sheetRef, rulesetRef };

    return id;
  }

  /**
   * Loads an actor's sheet values into the controller
   * @param ref The ref of the actor being loaded in
   * @param actor The actor's values to load into the controller
   */
  public loadActor(ref: string, actor?: Partial<ActorDocument>, force?: boolean): void {
    // Undefined case to simplify loads from the ActorDataController
    if (!actor) { return; }
    if (!force && this.actorController.isActorLoaded(ref)) { return; }
    this.actorController.loadActor(ref, actor);
  }

  /**
   * Loads in a sheet by taking the XML and converting it into usable objects
   * @param ref The sheet's reference string
   * @param sheetXML The raw sheet XML to load into the controller
   */
  public loadSheet(ref: string, sheetXML: string): void {
    this.sheetController.load(ref, sheetXML);
  }

  /**
   * Loads in the values of a ruleset combined with a campaign to accurately render an actor sheet
   * @param ref The ref of the ruleset
   * @param ruleset The combined values of the ruleset and campaign that may be accessed
   */
  public loadRuleset(ref: string, ruleset: Partial<RulesetDocument>): void {
    this.rulesetController.loadRuleset(ref, ruleset);
  }

  /**
   * Unloads a single actor
   * @param ref The ref of the actor to unload
   * @returns True if an actor was successfully unloaded, false if one is not found
   */
  public unloadActor(ref: string): boolean {
    return this.actorController.unloadActor(ref);
  }

  /**
   * Unloads a single ruleset
   * @param ref The ref of the ruleset to unload
   * @todo Implement
   * @returns True if a ruleset was successfully unloaded, false if one is not found
   */
   public unloadRuleset(ref: string): boolean {
    return this.rulesetController.unloadRuleset(ref);
  }

  /**
   * Unloads a single sheet
   * @param ref The ref of the sheet to unload
   * @returns True if a sheet was successfully unloaded, false if one is not found
   */
  public unloadSheet(ref: string): boolean {
    return this.sheetController.unload(ref);
  }

  /**
   * Gets an actor by their render ref
   * @param renderRef The ref of the render to check for the actor's true ref
   */
  public getActor(renderRef: string): Partial<ActorDocument> {
    let actorRef = "";
    if (this.$renders[renderRef]) { actorRef = this.$renders[renderRef].actorRef; }
    return this.actorController.getActor(actorRef);
  }

  /**
   * Gets the actor ref from the current render
   * @param renderRef The ref of the render to get the actor from
   * @returns The actor ref or the shared none ID
   */
  public getActorRef(renderRef: string): string {
    if (!this.$renders[renderRef]) { return "temp"; }
    const actorRef = this.$renders[renderRef].actorRef;
    return actorRef;
  }

  /**
   * Gets an actor by their render ref and the field
   * @param renderRef The ref of the render to check for the actor's true ref
   */
   public getActorField(renderRef: string, field: string): any {
    if (!this.$renders[renderRef]) { return undefined; }
    const actorRef = this.$renders[renderRef].actorRef;
    return this.actorController.getActorFieldValue(actorRef, field);
  }

  /**
   * Sets a single value within an actor by their render ref and the field
   * @param renderRef The ref of the render to check for the actor's true ref
   */
  public setActorField(renderRef: string, field: string, value: any) {
    if (!this.$renders[renderRef]) { return; }
    const actorRef = this.$renders[renderRef].actorRef;
    this.actorController.setActorFieldValue(actorRef, field, value);
  }

  /**
   * Fetches the actor content for the given render ID and content group
   * @param renderID The ID of the render to get the content for
   * @param contentGroup The group of content to retrieve
   * @returns An array of actor contents. If none is found, an empty array is returned
   */
  public getContent(renderID: string, contentGroup: string): ActorContent[] {
    if (!this.$renders[renderID]) { return []; }
    const actorRef = this.$renders[renderID].actorRef;
    const content = this.actorController.getContent(actorRef, contentGroup);
    return content;
  }

  /**
   * Pushes a new piece of content to the end of a content's list
   * @param renderID The ID of the render to push a new content item to
   * @param contentGroup The group of content that is gaining a new addition
   * @param content Optionally defined content. If none is given, default values will be provided
   */
  public pushNewContent(renderID: string, contentGroup: string, content?: ActorContent) {
    if (!this.$renders[renderID]) { return; }
    const actorRef = this.$renders[renderID].actorRef;
    this.actorController.pushNewContent(actorRef, contentGroup, content);
  }

  /**
   * Removes a single item from an actor's contents
   * @param renderID The ID of the render that will be having a content item removed
   * @param contentGroup The type of content that will be having an item removed
   * @param index The index of the content item to remove
   */
  public deleteContentItem(renderID: string, contentGroup: string, index: number) {
    if (!this.$renders[renderID]) { return; }
    const actorRef = this.$renders[renderID].actorRef;
    this.actorController.deleteContentItem(actorRef, contentGroup, index);
  }

  /**
   * Grabs the sheet for the given render
   * @param ref The ref of the render to fetch the sheet for
   * @returns The found sheet
   */
  public getSheet(ref: string): PageElementDescriptor {
    let sheetRef = "";
    if (this.$renders[ref]) { sheetRef = this.$renders[ref].sheetRef; }
    return this.sheetController.getSheet(sheetRef);
  }

  /**
   * Determines if the actor is loaded. Returns true if it is, false otherwise
   * @param renderRef The ref of the actor to check
   */
  public isActorLoaded(renderRef: string): boolean {
    let actorRef = "";
    if (this.$renders[renderRef]) { actorRef = this.$renders[renderRef].actorRef; }
    return this.actorController.isActorLoaded(actorRef);
  }

  /**
   * Determines if the sheet is loaded. Returns true if it is, false otherwise
   * @param ref The ref of the sheet to check
   */
  public isSheetLoaded(ref: string): boolean {
    return false;
  }

  /**
   * Determines if the ruleset is loaded. Returns true if it is, false otherwise
   * @param ref The ref of the ruleset to check
   */
  public isRulesetLoaded(ref: string): boolean {
    return false;
  }

  /**
   * Renders the variables of an element into useable strings
   * @param id The ID of the render to render variables for
   * @param element The element descriptor containing the actor sheet fields to render
   * @param fields The specific fields in the element descriptor to render variables for
   * @returns A subset of the given element with the specified fields
   */
  public renderVariables<T extends GenericSheetElementDescriptor>(
    id: string,
    element: T,
    fields: string[],
    properties: SheetProperties
  ): Record<string, string> {
    const parsedVariables: Record<string, string> = {};

    for (const field of fields) {
      if (!(field in element)) { continue; }

      const elementField: ParsedExpressionString = element[field as (keyof T)] as unknown as ParsedExpressionString; 
      parsedVariables[field] = ActorController.renderVariable(id, elementField, properties);
    }

    return parsedVariables;
  }

  /**
   * Renders out a single variable
   * @param renderID The ID of the render
   * @param exprs An array containing an expression or string(s) to render out
   * @returns A single string containing the rendered value
   */
  public renderVariable(renderID: string, exprs: ParsedExpressionString, properties: SheetProperties): string {
    // Base case where we ensure that we have the correct type
    if (!Array.isArray(exprs) || exprs.length === 0) { return ""; }
    let renderedResult = "";
    for (const expr of exprs) {
      // Not an expression, just a string
      if (typeof expr === "string") {
        renderedResult += expr;
        continue;
      }

      renderedResult += this.renderExpression(renderID, expr, properties);
    }

    return renderedResult;
  }

  /**
   * Renders an expression into a string
   * @param renderID The ID of the render to use for determining the expression values
   * @param expr The expression to render out
   */
  public renderExpression(renderID: string, expr: Expression, properties: SheetProperties) {
    let renderedResult = "";
    for (const item of expr.items) {
      switch (item.type) {
        case ExpressionType.Variable:
          renderedResult += this.convertVariableToData(renderID, item.value || "", properties);
          break;
      }

    }
    return renderedResult;
  }

  /**
   * Converts a variable tuple
   * @param id The ID of the render
   * @param chunk The variable tuple to decode
   * @returns The value of the decoded variable
   */
  public convertVariableToData(id: string, variable: string, properties: SheetProperties) {
    if (!variable) { return ""; }

    const firstPeriodIndex = variable.search(/\./);

    // Grabs the first portion of the variable for determining where to look for the value
    let firstAddress, remainderAddress;
    if (firstPeriodIndex > 0) {
      firstAddress = variable.substring(0, firstPeriodIndex);
      remainderAddress = variable.substring(firstPeriodIndex + 1);
    } else {
      firstAddress = variable;
      remainderAddress = variable;
    }

    const { actorRef, rulesetRef, sheetRef } = this.$renders[id];
    switch (firstAddress) {
      // The value comes from the character sheet
      case "character":
        const characterValue = this.getActorField(id, remainderAddress);
        return characterValue;
      case "content":
        const contentValue = this.actorController.getContent(actorRef, remainderAddress);
        return contentValue;
      // The value comes from plugins, campaign, or ruleset
      case "rules":
        const ruleValue = this.rulesetController.getRulesetVariable(
          rulesetRef, RuleVariableGroup.STATIC, remainderAddress
        );
        return ruleValue;
      // A value defined by the sheet
      case "sheet":
        const sheetValue = this.sheetController.getVariable(sheetRef, remainderAddress);
        return sheetValue;
      // A custom value in the properties defined by a loop
      default:
        // Base case to prevent deep reads if they're unnecessary
        if (!(firstAddress in properties)) { return ""; }
        const propertiesValue = read(properties, variable);
        return propertiesValue;
    }

  }
}

export const ActorController = new $ActorController();
