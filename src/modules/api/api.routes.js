import { joinAPIsURL } from "../../utils/index.js";
import { apiGetVouchers } from "./api.controller.js";

function APIsRoutes(app) {
  console.log(joinAPIsURL("/voucher"));
  app.route(joinAPIsURL("/vouchers")).get(apiGetVouchers);
}

export default APIsRoutes;
