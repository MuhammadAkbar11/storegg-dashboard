import AdminRoutes from "../app/admin/admin.routes.js";
import APIsRoutes from "../app/api/api.routes.js";
import BankRoutes from "../app/bank/bank.routes.js";
import CategoryRoutes from "../app/category/category.routes.js";
import { dashboard } from "../app/dashboard/dashboard.controller.js";
import GenerateRoutes from "../app/generate/generate.routes.js";
import NominalRoutes from "../app/nominal/nominal.routes.js";
import PaymentRoutes from "../app/payment/payment.routes.js";
import TransactionRoutes from "../app/transaction/transaction.routes.js";
import UserRoutes from "../app/user/user.routes.js";
import VoucherRoutes from "../app/voucher/voucher.routes.js";
import { ensureAuth } from "../middleware/auth.js";

function MainRoutes(app) {
  app.get("/", ensureAuth, dashboard);

  UserRoutes(app);
  AdminRoutes(app);
  VoucherRoutes(app);
  NominalRoutes(app);
  CategoryRoutes(app);
  BankRoutes(app);
  PaymentRoutes(app);
  TransactionRoutes(app);

  APIsRoutes(app);

  GenerateRoutes(app);
}

export default MainRoutes;
