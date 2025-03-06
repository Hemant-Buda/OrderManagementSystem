import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface CompanyData {
  companyName: string;
  phoneNumber: string;
  address: string;
}

interface CompanyState {
  company: CompanyData | null;
  isRegistered: boolean;
}

// Load company company from localStorage
const loadCompanyFromLocalStorage = (): CompanyData | null => {
  const savedCompany = localStorage.getItem("companyData");
  return savedCompany ? JSON.parse(savedCompany) : null;
};

const initialState: CompanyState = {
  company: loadCompanyFromLocalStorage(),
  isRegistered: !!loadCompanyFromLocalStorage(),
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    registerCompany: (state, action: PayloadAction<CompanyData>) => {
      state.company = action.payload;
      state.isRegistered = true;
      localStorage.setItem("companyData", JSON.stringify(action.payload));
    },
    updateCompany: (state, action: PayloadAction<Partial<CompanyData>>) => {
      if (state.company) {
        state.company = { ...state.company, ...action.payload };
        localStorage.setItem("companyData", JSON.stringify(state.company));
      }
    },
    clearCompany: (state) => {
      state.company = null;
      state.isRegistered = false;
      localStorage.removeItem("companyData");
    },
  },
});

export const { registerCompany, updateCompany, clearCompany } =
  companySlice.actions;

export const selectCompany = (state: RootState) => state.company.company;
export const selectIsRegistered = (state: RootState) =>
  state.company.isRegistered;

export default companySlice.reducer;
