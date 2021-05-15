
import { CoreDocument } from "./CoreDocument";
import { UserDocument } from "./User";

/**
 * Represents the campaign and all information contained therein
 */
export interface CampaignDocument extends CoreDocument {
  players?: UserDocument[];
  lastPlayed?: Date;

  allowLinkInvitation?: boolean;
  invitationAddress?: string
}
