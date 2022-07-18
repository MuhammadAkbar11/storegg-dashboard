import { joinAPIsURL } from "../../utils/index.js";
import { apiGetDetailVoucher, apiGetVouchers } from "./api.controller.js";

function APIsRoutes(app) {
  app.route(joinAPIsURL("/vouchers")).get(apiGetVouchers);
  app.route(joinAPIsURL("/vouchers/:ID")).get(apiGetDetailVoucher);
}

export default APIsRoutes;
