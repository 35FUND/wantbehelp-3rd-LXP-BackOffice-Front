import { httpClient } from "../../../global/config/httpClient";
import type { ApiResponse } from "../../../global/common/types/apiResponse";
import type { LoginRequest, LoginResponse } from "../model/authTypes";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await httpClient.post<ApiResponse<LoginResponse>>("/api/v1/auth/login", payload);
  return response.data.data;
}

export async function logout(): Promise<void> {
  await httpClient.post<ApiResponse<null>>("/api/v1/auth/logout");
}
