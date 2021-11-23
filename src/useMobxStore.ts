import { useContext } from "react";
import { rootStoreContext } from "./mobxStore";

export const useStores = () => useContext(rootStoreContext);