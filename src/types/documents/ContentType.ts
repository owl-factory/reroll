import { Ref64 } from "types";
import { ContentTypeIcon } from "types/enums/contentTypeIcon";
import { CoreDocument } from "./CoreDocument";

export interface ContentTypeDocument extends CoreDocument {
  ruleset: { ref: Ref64; },
  icon: ContentTypeIcon,
}
