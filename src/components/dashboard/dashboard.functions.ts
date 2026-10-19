import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  AddPaymentSchema,
  DeletePaymentSchema,
  MarkPaidSchema,
  UpdatePaymentSchema,
  addPayment,
  deletePayment,
  getDashboardData,
  markPaymentPaid,
  updatePayment,
} from "./dashboard.server";
import { ExtractPaymentSchema, extractPayment } from "./smart-add.server";

// The handlers stay thin: they read the session from the incoming request and
// hand it to dashboard.server.ts, which rejects anything but a verified user
// and does the work.
const getRequestSession = async () => {
  const req = getRequest();

  return auth.api.getSession({
    headers: Object.fromEntries(req.headers.entries()),
  });
};

export const getDashboardDataFn = createServerFn({ method: "GET" }).handler(
  async () => getDashboardData(prisma, await getRequestSession()),
);

export const addPaymentFn = createServerFn({ method: "POST" })
  .inputValidator(AddPaymentSchema)
  .handler(async ({ data }) =>
    addPayment(prisma, await getRequestSession(), data),
  );

export const updatePaymentFn = createServerFn({ method: "POST" })
  .inputValidator(UpdatePaymentSchema)
  .handler(async ({ data }) =>
    updatePayment(prisma, await getRequestSession(), data),
  );

export const deletePaymentFn = createServerFn({ method: "POST" })
  .inputValidator(DeletePaymentSchema)
  .handler(async ({ data }) =>
    deletePayment(prisma, await getRequestSession(), data),
  );

export const markPaymentPaidFn = createServerFn({ method: "POST" })
  .inputValidator(MarkPaidSchema)
  .handler(async ({ data }) =>
    markPaymentPaid(prisma, await getRequestSession(), data),
  );

export const extractPaymentFn = createServerFn({ method: "POST" })
  .inputValidator(ExtractPaymentSchema)
  .handler(async ({ data }) =>
    extractPayment(prisma, await getRequestSession(), data),
  );
