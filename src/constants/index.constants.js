import path from "path";

const __dirname = path.resolve();

export const httpStatusCodes = {
  OK: 200,
  EDIT: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PLAYER: "PLAYER",
};

export const ROLES_ARR = [
  {
    value: "SUPER_ADMIN",
    text: "Superadmin",
  },
  {
    value: "SUPER_ADMIN",
    text: "Admin",
  },
  {
    value: "SUPER_ADMIN",
    text: "Player",
  },
];

export const USER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
};

export const LOCALS_STATIC = {
  stylesheet: {
    pages: [],
    vendors: [],
  },
  script: {
    pages: [],
    vendors: [],
  },
};

export const TABLE_AUTO_INCREMENT = {
  users: {
    field: "user_id",
    prefix: "USR",
  },
  players: {
    field: "player_id",
    prefix: "PLY",
  },
  categories: {
    field: "category_id",
    prefix: "CTGR",
  },
  administrators: {
    field: "admin_id",
    prefix: "ADM",
  },
  vouchers: {
    field: "voucher_id",
    prefix: "VCR",
  },
  nominals: {
    field: "nominal_id",
    prefix: "NML",
  },
  voucher_nominals: {
    field: "voucher_nominal_id",
    prefix: "VCNL",
  },
  banks: {
    field: "bank_id",
    prefix: "BNK",
  },
  payment_methods: {
    field: "payment_method_id",
    prefix: "PYM",
  },
  payment_banks: {
    field: "payment_bank_id",
    prefix: "PYMB",
  },
  transactions: {
    field: "transaction_id",
    prefix: "GG",
  },
  histories: {
    field: "history_id",
    prefix: "HTR",
  },
  history_payments: {
    field: "history_payment_id",
    prefix: "HPY",
  },
  history_players: {
    field: "history_player_id",
    prefix: "HPLY",
  },
  history_vcrtopup: {
    field: "history_vcrtopup_id",
    prefix: "HVTP",
  },
};

export const SUPERADMIN_EMAIL = "superadmin@storegg.com";
export const STATIC_FOLDER = path.join(__dirname, "public");
export const DEV_STATIC_FOLDER = path.join(__dirname, ".dev");
export const ROOT_FOLDER = __dirname;
export const DEFAULT_THUMBNAIL = "/uploads/Default-Thumbnail.png";
export const DEFAULT_USER_PP = "/uploads/Default-Avatar-1.jpg";
