import { httpClient } from "../../../global/config/httpClient";
import type { ApiResponse } from "../../../global/common/types/apiResponse";
import type { UserProjection } from "../model/userTypes";

export async function getUsers(): Promise<UserProjection[]> {
  const response = await httpClient.get<ApiResponse<UserProjection[]>>("/api/v1/users");
  return response.data.data ?? [];
}
