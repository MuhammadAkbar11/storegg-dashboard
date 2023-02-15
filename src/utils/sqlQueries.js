export const SQL_COUNT_VOUCHER_TRANSACTIONS = `(
  SELECT COUNT(*)
  FROM gg_transactions AS transactions
  WHERE
      transactions.voucher_id = Vouchers.voucher_id
)`;
