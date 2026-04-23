import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  data: Array<{
    label: string;
    value: string | number;
  }>;
  includeDate?: boolean;
}

/**
 * Generate a simple PDF content as HTML string
 * Note: This is a placeholder for actual PDF generation
 * In production, use a proper PDF library like react-native-pdf-lib or similar
 */
export async function generatePDFContent(options: PDFExportOptions): Promise<string> {
  const { title, subtitle, data, includeDate = true } = options;
  const currentDate = new Date().toLocaleDateString("ar-SA");

  let htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          direction: rtl;
          background-color: #0D0F2D;
          color: #FFFFFF;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #1A1D3A;
          padding: 30px;
          border-radius: 10px;
          border: 1px solid #2A2D4A;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #0a7ea4;
          padding-bottom: 20px;
        }
        .header h1 {
          font-size: 28px;
          color: #FFFFFF;
          margin-bottom: 10px;
        }
        .header p {
          font-size: 14px;
          color: #999999;
        }
        .date {
          text-align: center;
          font-size: 12px;
          color: #999999;
          margin-bottom: 20px;
        }
        .data-section {
          margin-bottom: 20px;
        }
        .data-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background-color: #0D0F2D;
          margin-bottom: 10px;
          border-radius: 6px;
          border-left: 3px solid #0a7ea4;
        }
        .data-label {
          font-size: 14px;
          color: #999999;
          font-weight: bold;
        }
        .data-value {
          font-size: 16px;
          color: #FFFFFF;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #2A2D4A;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ""}
        </div>
        ${includeDate ? `<div class="date">التاريخ: ${currentDate}</div>` : ""}
        <div class="data-section">
  `;

  data.forEach((item) => {
    htmlContent += `
      <div class="data-item">
        <span class="data-label">${item.label}</span>
        <span class="data-value">${item.value}</span>
      </div>
    `;
  });

  htmlContent += `
        </div>
        <div class="footer">
          <p>تم إنشاء هذا التقرير من تطبيق المحاسب البسيط</p>
          <p>© 2026 جميع الحقوق محفوظة</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
}

/**
 * Save PDF content to file
 */
export async function savePDFToFile(
  htmlContent: string,
  filename: string
): Promise<string | null> {
  try {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    if (Platform.OS === "web") {
      // For web, create a data URL
      const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
      return dataUrl;
    }

    // For native platforms, save to file system
    await FileSystem.writeAsStringAsync(fileUri, htmlContent);
    return fileUri;
  } catch (error) {
    console.error("Error saving PDF:", error);
    return null;
  }
}

/**
 * Export account statement as PDF
 */
export async function exportAccountStatement(
  accountName: string,
  balance: number,
  currency: string
): Promise<string | null> {
  const htmlContent = await generatePDFContent({
    title: "كشف حساب",
    subtitle: accountName,
    data: [
      {
        label: "اسم الحساب",
        value: accountName,
      },
      {
        label: "الرصيد الحالي",
        value: `${balance} ${currency}`,
      },
      {
        label: "حالة الحساب",
        value: balance >= 0 ? "دائن" : "مدين",
      },
    ],
    includeDate: true,
  });

  return savePDFToFile(htmlContent, `statement-${accountName}-${Date.now()}.html`);
}

/**
 * Export transactions report as PDF
 */
export async function exportTransactionsReport(
  transactions: Array<{
    statement: string;
    amount: number;
    currency: string;
    type: string;
  }>,
  dateRange?: { from: string; to: string }
): Promise<string | null> {
  const data = transactions.map((tx) => ({
    label: tx.statement,
    value: `${tx.type === "for_us" ? "+" : "-"}${tx.amount} ${tx.currency}`,
  }));

  const total = transactions.reduce((sum, tx) => {
    return sum + (tx.type === "for_us" ? tx.amount : -tx.amount);
  }, 0);

  data.push({
    label: "الإجمالي",
    value: `${total}`,
  });

  const subtitle = dateRange ? `من ${dateRange.from} إلى ${dateRange.to}` : undefined;

  const htmlContent = await generatePDFContent({
    title: "تقرير المعاملات",
    subtitle,
    data,
    includeDate: true,
  });

  return savePDFToFile(htmlContent, `transactions-report-${Date.now()}.html`);
}

/**
 * Export balance summary as PDF
 */
export async function exportBalanceSummary(
  balances: Record<string, number>
): Promise<string | null> {
  const data = Object.entries(balances).map(([currency, balance]) => ({
    label: currency,
    value: `${balance >= 0 ? "+" : ""}${balance}`,
  }));

  const htmlContent = await generatePDFContent({
    title: "ملخص الأرصدة",
    data,
    includeDate: true,
  });

  return savePDFToFile(htmlContent, `balance-summary-${Date.now()}.html`);
}
