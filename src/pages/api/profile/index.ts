import { NextApiRequest } from "next";
import { authenticate } from "utilities/auth";
import HTTPHandler from "../../../server/response/Response";
import { createEndpoint } from "../../../server/utilities/handlers";

/**
 * Creates a single new ruleset
 * @param this The Handler class calling this function
 * @param req The request to the server
 */
async function saveProfile(this: HTTPHandler, req: NextApiRequest) {
  const session = await authenticate({req});
  if (!session || !session.user.ref.id) { return; }
  // const profile = await UserProfileLogic.saveUserProfile(session.user.ref.id, req.body);
  this.returnSuccess({});
}

export default createEndpoint({PATCH: saveProfile});
