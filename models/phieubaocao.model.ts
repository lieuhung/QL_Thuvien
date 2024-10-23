// src/app/models/phieubaocao.model.ts
export class PhieuBaoCao {
  billId: string;
  lib_Id: string; // Sửa từ `lib_Id` thành `libId` để tuân theo chuẩn camelCase
  report_month: number;
  moneyIn: number;
  moneyOut: number;
  mi_source: number;
  mo_source: number;
  total: number;
}
