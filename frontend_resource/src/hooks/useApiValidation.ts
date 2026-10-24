import { useState } from "react";
import { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types/ApiErrorResponse";

export const useApiValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>("");

  const handleApiError = (error: unknown) => {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const data = axiosError.response?.data;

    const newFieldErrors = data?.errors || {};
    const newGeneralError =
      data?.detail || axiosError.message || "Connection error";

    setFieldErrors(newFieldErrors);
    setGeneralError(newGeneralError);

    // Zwracamy błędy do natychmiastowego użycia w bloku catch
    return { fieldErrors: newFieldErrors, generalError: newGeneralError };
  };

  const clearErrors = () => {
    setFieldErrors({});
    setGeneralError("");
  };

  return { fieldErrors, generalError, handleApiError, clearErrors };
};
