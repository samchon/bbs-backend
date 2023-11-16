import { assert } from "typia";

import api from "@samchon/bbs-api";
import { ISystem } from "@samchon/bbs-api/lib/structures/monitors/ISystem";

export async function test_api_monitor_system(
  connection: api.IConnection,
): Promise<void> {
  const system: ISystem = await api.functional.monitors.system.get(connection);
  assert<typeof system>(system);
}
