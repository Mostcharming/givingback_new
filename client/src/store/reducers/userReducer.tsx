import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: any;
  id: number;
  name: string;
  cac: string;
  phone: string;
  active: number;
  interest_area: string;
  website: string | null;
  additional_information: string | null;
}

export interface UserImage {
  id: number;
  filename: string;
  user_id: number;
}
export interface Wallet {
  wallet_id: number;
  user_id: number;
  balabce: number;
  currency: string;
}

interface Bank {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bvn: number | null;
}

interface Project {
  id: number;
  title: string;
  category: string;
  cost: number;
  beneficiary: string;
  duration: string;
  description: string;
  target_amount: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  user_id: number;
}

interface Address {
  state: string;
  city_lga: string;
  address: string;
}

interface Donation {
  id: number;
  amount: number;
  description: string;
  status: string;
  type: string;
  user_id: number;
  project_id: number;
}

interface Pimage {
  id: number;
  filename: string;
  project_id: number;
  user_id: number;
}
interface Uimage {
  id: number;
  filename: string;
  user_id: number;
}

interface CurrentState {
  activeProjectsCount: number;
  allProjectsCount: number;
  donationsCount: number;
  bank: Bank[] | null;
  address: Address[] | null;
  user: User | null;
  userimage: UserImage | null;
  wallet: Wallet | null;
}

const initialState: CurrentState = {
  activeProjectsCount: 0,
  allProjectsCount: 0,
  donationsCount: 0,
  bank: null,
  address: null,
  user: null,
  userimage: null,
  wallet: null,
};

const currentSlice = createSlice({
  name: "current",
  initialState,
  reducers: {
    getCurrent: (
      state,
      action: PayloadAction<{
        activeProjectsCount: number;
        allProjectsCount: number;
        donationsCount: number;
        address: Address[];
        bank: Bank[];
        user: User;
        userImage: UserImage;
        wallet: Wallet;
      }>
    ) => {
      state.activeProjectsCount = action.payload.activeProjectsCount;
      state.allProjectsCount = action.payload.allProjectsCount;
      state.bank = action.payload.bank;
      state.address = action.payload.address;
      state.user = action.payload.user;
      state.userimage = action.payload.userImage;
      state.donationsCount = action.payload.donationsCount;
      state.wallet = action.payload.wallet;
    },
    addBankAccount: (state, action: PayloadAction<Bank>) => {
      if (!state.bank) {
        state.bank = [];
      }
      state.bank.push(action.payload);
    },
    clearCurrentState: () => initialState,
  },
});

export const { getCurrent, clearCurrentState, addBankAccount } =
  currentSlice.actions;
export default currentSlice.reducer;
export type { CurrentState };
