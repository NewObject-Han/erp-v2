/**
 * 外贸单据打印（报价单 / PI / 装箱单）
 *
 * 通过隐藏 iframe 生成 A4 版式 HTML 并调用浏览器打印，
 * 用户可另存为 PDF 实现"导出 PDF"效果，不被弹窗拦截。
 */

export interface PrintDocItem {
  productName?: string;
  sku?: string;
  hsCode?: string;
  unit?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export type PrintDocType = 'quotation' | 'pi' | 'packingList';

export interface PrintDocOptions {
  docType: PrintDocType;
  docNo: string;
  date: string;
  customerName: string;
  items: PrintDocItem[];
  currency: string;
  /** 条款键值（贸易术语/付款方式/有效期等） */
  terms?: [string, string][];
  /** 页脚备注（如银行信息、声明） */
  note?: string;
}

/** 卖方抬头（后续可接入公司信息配置） */
const SELLER = {
  name: 'GUANGZHOU HUAGUANG LIGHTING CO., LTD.',
  nameCn: '广州市华光照明电器有限公司',
  address: 'No.88 Huadi Avenue, Liwan District, Guangzhou, China',
  tel: '+86-20-8888-6666',
  email: 'export@huaguang-lighting.com',
};

const DOC_TITLES: Record<PrintDocType, string> = {
  quotation: 'QUOTATION',
  pi: 'PROFORMA INVOICE',
  packingList: 'PACKING LIST',
};

const DOC_TITLES_CN: Record<PrintDocType, string> = {
  quotation: '报价单',
  pi: '形式发票',
  packingList: '装箱单',
};

const fmt = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 2 });

/** 装箱单模拟重量/箱数（演示用途） */
function packing(qty: number) {
  const cartons = Math.max(1, Math.ceil(qty / 50));
  const netWeight = qty * 0.28; // kg
  const grossWeight = qty * 0.32; // kg
  return { cartons, netWeight, grossWeight };
}

function esc(v: unknown): string {
  return String(v ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHtml(o: PrintDocOptions): string {
  const priced = o.docType !== 'packingList';
  const total = o.items.reduce(
    (s, it) => s + (priced ? Number(it.quantity ?? 0) * Number(it.unitPrice ?? 0) : 0),
    0,
  );
  const totalCartons = o.items.reduce((s, it) => s + packing(Number(it.quantity ?? 0)).cartons, 0);
  const totalGross = o.items.reduce((s, it) => s + packing(Number(it.quantity ?? 0)).grossWeight, 0);
  const totalNet = o.items.reduce((s, it) => s + packing(Number(it.quantity ?? 0)).netWeight, 0);

  const th = (t: string, w?: string) =>
    `<th${w ? ` style="width:${w}"` : ''}>${t}</th>`;

  const headRow = priced
    ? [th('NO.', '5%'), th('DESCRIPTION OF GOODS', '30%'), th('SKU', '13%'), th('QTY', '12%'), th('UNIT', '9%'), th('UNIT PRICE', '15%'), th('AMOUNT', '16%')]
    : [th('NO.', '6%'), th('DESCRIPTION OF GOODS', '34%'), th('SKU', '15%'), th('QTY', '13%'), th('CARTONS', '13%'), th('N.W (kg)', '13%'), th('G.W (kg)', '13%')];

  const rows = o.items.map((it, i) => {
    const qty = Number(it.quantity ?? 0);
    if (priced) {
      const amount = qty * Number(it.unitPrice ?? 0);
      return `<tr><td>${i + 1}</td><td style="text-align:left">${esc(it.productName)}</td><td>${esc(it.sku)}</td><td>${fmt(qty)}</td><td>${esc(it.unit)}</td><td>${fmt(Number(it.unitPrice ?? 0))}</td><td><b>${fmt(amount)}</b></td></tr>`;
    }
    const p = packing(qty);
    return `<tr><td>${i + 1}</td><td style="text-align:left">${esc(it.productName)}</td><td>${esc(it.sku)}</td><td>${fmt(qty)} ${esc(it.unit)}</td><td>${p.cartons}</td><td>${fmt(p.netWeight)}</td><td>${fmt(p.grossWeight)}</td></tr>`;
  });

  const footerRow = priced
    ? `<tr class="total"><td colspan="5" style="text-align:right">TOTAL AMOUNT</td><td colspan="2"><b>${esc(o.currency)} ${fmt(total)}</b></td></tr>`
    : `<tr class="total"><td colspan="3" style="text-align:right">TOTAL</td><td>${fmt(o.items.reduce((s, it) => s + Number(it.quantity ?? 0), 0))}</td><td>${totalCartons}</td><td>${fmt(totalNet)}</td><td>${fmt(totalGross)}</td></tr>`;

  const termsHtml = o.terms?.length
    ? `<table class="terms">${o.terms
        .map(([k, v]) => `<tr><td class="k">${esc(k)}</td><td>${esc(v)}</td></tr>`)
        .join('')}</table>`
    : '';

  const noteHtml = o.note ? `<div class="note">${esc(o.note)}</div>` : '';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${DOC_TITLES[o.docType]} ${esc(o.docNo)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif; color: #1a1a1a; font-size: 13px; padding: 40px 50px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1a1a1a; padding-bottom: 14px; }
  .seller h1 { font-size: 18px; letter-spacing: 0.5px; }
  .seller .cn { font-size: 14px; color: #555; margin-top: 2px; }
  .seller .meta { font-size: 11px; color: #666; margin-top: 6px; line-height: 1.6; }
  .doc-title { text-align: right; }
  .doc-title h2 { font-size: 24px; letter-spacing: 2px; }
  .doc-title .cn { font-size: 13px; color: #555; margin-top: 4px; }
  .info { display: flex; justify-content: space-between; margin: 18px 0 14px; gap: 24px; }
  .party { flex: 1; }
  .party .t { font-weight: 700; font-size: 12px; background: #f2f2f2; padding: 5px 8px; margin-bottom: 6px; }
  .party .v { font-size: 13px; line-height: 1.7; padding-left: 8px; }
  .doc-meta { flex: 0 0 240px; font-size: 12.5px; }
  .doc-meta table { width: 100%; border-collapse: collapse; }
  .doc-meta td { padding: 3px 0; }
  .doc-meta td:first-child { color: #555; width: 90px; }
  table.items, table.terms { width: 100%; border-collapse: collapse; margin-top: 6px; }
  table.items th, table.items td { border: 1px solid #bbb; padding: 6px 8px; text-align: center; font-size: 12px; }
  table.items th { background: #f2f2f2; font-weight: 600; }
  table.items tr.total td { background: #fafafa; font-size: 12.5px; }
  table.terms td { padding: 4px 2px; font-size: 12.5px; vertical-align: top; }
  table.terms td.k { color: #555; width: 130px; }
  .note { margin-top: 14px; font-size: 11.5px; color: #444; line-height: 1.7; border-top: 1px dashed #bbb; padding-top: 10px; }
  .sign { display: flex; justify-content: space-between; margin-top: 46px; }
  .sign .col { flex: 1; text-align: center; }
  .sign .line { border-bottom: 1px solid #333; height: 40px; margin: 0 24px; }
  @media print { body { padding: 0; } @page { size: A4; margin: 14mm; } }
</style>
</head>
<body>
  <div class="head">
    <div class="seller">
      <h1>${SELLER.name}</h1>
      <div class="cn">${SELLER.nameCn}</div>
      <div class="meta">ADD: ${SELLER.address}<br/>TEL: ${SELLER.tel} &nbsp; EMAIL: ${SELLER.email}</div>
    </div>
    <div class="doc-title">
      <h2>${DOC_TITLES[o.docType]}</h2>
      <div class="cn">${DOC_TITLES_CN[o.docType]}</div>
    </div>
  </div>
  <div class="info">
    <div class="party">
      <div class="t">TO: ${esc(o.customerName)}</div>
    </div>
    <div class="doc-meta">
      <table>
        <tr><td>NO.</td><td><b>${esc(o.docNo)}</b></td></tr>
        <tr><td>DATE</td><td>${esc(o.date)}</td></tr>
        ${priced ? `<tr><td>CURRENCY</td><td>${esc(o.currency)}</td></tr>` : ''}
      </table>
    </div>
  </div>
  <table class="items">
    <thead><tr>${headRow.join('')}</tr></thead>
    <tbody>
      ${rows.join('\n      ')}
      ${footerRow}
    </tbody>
  </table>
  ${termsHtml}
  ${noteHtml}
  <div class="sign">
    <div class="col"><div>Confirmed by Buyer</div><div class="line"></div></div>
    <div class="col"><div>For and on behalf of Seller</div><div class="line"></div></div>
  </div>
</body>
</html>`;
}

/** 生成打印（隐藏 iframe，浏览器打印对话框中可另存 PDF） */
export function printDocument(o: PrintDocOptions): void {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(buildHtml(o));
  doc.close();
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 2000);
  }, 150);
}
