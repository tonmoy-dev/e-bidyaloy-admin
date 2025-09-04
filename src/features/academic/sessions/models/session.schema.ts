import * as yup from "yup";
import type { SessionModel } from "./session.model";

export const sessionSchema: yup.ObjectSchema<SessionModel> = yup.object({
  id: yup.number().optional(),
  name: yup.string().required("Session Name is required"),
  start_date: yup.string().required("Start Date is required"),
  end_date: yup.string().required("End Date is required"),
  is_current: yup.boolean().required(),
});
