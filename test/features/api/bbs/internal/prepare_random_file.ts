import { RandomGenerator } from "@nestia/e2e";
import { randint } from "tstl";

import { IAttachmentFile } from "@samchon/bbs-api/lib/structures/common/IAttachmentFile";

export function prepare_random_file(
  extension?: string,
): IAttachmentFile.ICreate {
  const name: string = RandomGenerator.alphabets(randint(5, 16));
  if (extension === undefined) extension = RandomGenerator.alphabets(3);

  const url: string = `https://picsum.photos/200/300?random`;

  return {
    name,
    extension,
    url,
  };
}
