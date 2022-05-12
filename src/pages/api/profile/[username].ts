import "reflect-metadata";
import { NextApiRequest } from "next";
import { UserLogic } from "server/logic/UserLogic";

import { HTTPHandler, createEndpoint } from "@owl-factory/https";
import { UserDocument } from "types/documents";
import { getUniques } from "@owl-factory/utilities/arrays";
import { fetchMany } from "server/logic/many";

/**
 * Gets all of the information needed to render a user's profile page
 */
export async function getProfile(params: Record<string, unknown>) {
  if (!("username" in params)) { return {}; }
  const userSearch = await UserLogic.searchByUsername(params.username as string) as UserDocument[];
  if (userSearch.length === 0) { throw { code: 404, message: "The given profile was not found."}; }

  const user = await UserLogic.fetch(userSearch[0].ref);

  return { user };
}

/**
 * Gets a single profile for the profile page
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function getProfileRequest(this: HTTPHandler, req: NextApiRequest) {
  this.returnSuccess(await getProfile(req.query));
}

/**
 * Updates a single profile for the current user
 * @param this The handler class calling this function
 * @param req The request to the server
 */
async function updateProfile(this: HTTPHandler, req: NextApiRequest) {
  const user = await UserLogic.update(req.body.ref, req.body);
  this.returnSuccess({ user });
}

export default createEndpoint({GET: getProfileRequest, PATCH: updateProfile});
