import BbsApi from "@samchon/bbs-api";

export async function test_api_monitor_health_check(
  connection: BbsApi.IConnection,
): Promise<void> {
  await BbsApi.functional.monitors.health.get(connection);
}
