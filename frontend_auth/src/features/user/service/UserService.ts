import axios from "axios";
import { api, endpoints, refreshCookies } from "../../../lib/api";
import type { UserDto } from "../types/UserDto";

type UserResponse = Omit<UserDto, "isTotpEnabled"> & {
  isTotpEnabled?: boolean;
  totpEnabled?: boolean;
};
export async function getUser(): Promise<UserDto> {
  let response;
  try {
    response = await api.get<UserResponse>(endpoints.me);
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 401)
      throw error;
    await refreshCookies();
    response = await api.get<UserResponse>(endpoints.me);
  }
  const data = response.data;
  return {
    ...data,
    isTotpEnabled: Boolean(data.totpEnabled ?? data.isTotpEnabled),
  };
}
