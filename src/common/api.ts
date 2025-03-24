import axios from "axios";
import { Policy } from "../Insurance/model";
import { PolicyRequest } from "./model";

const API_URL = "https://insurance-backend-eh7h.onrender.com";

// Axios instance for base config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // If authentication is needed
});

// Fetch policies with filters
export const fetchPolicies = async (
  request: PolicyRequest
): Promise<Policy[]> => {
  try {
    const response = await apiClient.post<Policy[]>("/insurance", request);
    return response.data;
  } catch (error) {
    console.error("Error fetching policies:", error);
    return [];
  }
};
