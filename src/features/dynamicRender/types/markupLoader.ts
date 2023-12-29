import { Result } from "types/functional";
import { Controller } from "./controller";

/**
 * Defines the common functionality for the Markup Loader Controllers,
 * which are responsible for loading in Markup from different sources
 */
export interface MarkupLoaderController extends Controller {
  state: MarkupLoaderControllerState;
  load: () => Promise<Result<string, string>>;
}

/**
 * The different states that a Markup Controller may be in
 */
export enum MarkupLoaderControllerState {
  /** Controller is created but no actions have been done. */
  NoOp,

  // Working
  /** The loader is in the process of initializing */
  Loading,
  /** The loader is ready to be used */
  Ready,
  /** The loader is ready and in the process of fetching the data */
  Fetching, // The loader is ready, but reloading the data

  // Errors
  /** MobX encountered an unrecoverable error while initializing  */
  MobxError,
}
