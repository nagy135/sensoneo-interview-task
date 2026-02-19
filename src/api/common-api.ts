import { apiGet } from "../lib/api";
import type { CompaniesApiResponse, UsersApiResponse } from "./common-types";

export function getCompanies() {
  return apiGet<CompaniesApiResponse>("/api/companies");
}

export function getUsers() {
  return apiGet<UsersApiResponse>("/api/users");
}
