import { assert } from "typia";

import BbsApi from "@samchon/bbs-api";
import { ISystem } from "@samchon/bbs-api/lib/structures/monitors/ISystem";

export async function test_api_monitor_system(
  connection: BbsApi.IConnection,
): Promise<void> {
  const system: ISystem =
    await BbsApi.functional.monitors.system.get(connection);
  assert<typeof system>(system);
}
