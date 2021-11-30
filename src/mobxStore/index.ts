import { createContext } from "react";
import AccountStore from "./account";

export const rootStoreContext = createContext({
  AccountStore: AccountStore
});