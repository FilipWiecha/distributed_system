import { authClient } from "../../../services/apiClient";
import type UserDto from "../types/UserDto";
export async function getUserInfo(): Promise<UserDto> {
  return (await authClient.get<UserDto>("/auth/user/me")).data;
}
