import axios from "axios";
import { resolve } from "../resolve";

export const getPerson = async (id) =>
  resolve(axios.get(`/users/${id}`).then((res) => res.data));
