import XLSX from 'xlsx'
import { Message } from "element-ui";

/**
 * 导入数据到表格，只支持 xls，xlsb，xlsx
 */

// 导入：中文键名转英文键名，替换 key 值
export function exportReplaceEn(tableData, header) {
    for (let i in header) {
        for (let j in tableData) {
            for (let o in tableData[j]) {
                for (let k in header[i]) {
                    if (o === header[i][k]) {
                        tableData[j][k] = tableData[j][o];
                        delete tableData[j][o];
                    }
                }
            }
        }
    }
    return tableData;
}

/**
 * 导入 xls，xlsb，xlsx 数据到表格
 * @param {*} ele // 要监听的 input id
 * @param {*} header // 表格标题头格式 [{xx:'中文1'},{xx:'中文2'}]
 */
export function importXlsx(ele, header, callback) {
    ele.addEventListener("change", () => {
        let file = ele.files[0];
        let type = file.name.split('.');
        if (type[type.length - 1] !== 'xlsx' && type[type.length - 1] !== 'xls' && type[type.length - 1] !== 'xlsb') {
            Message.error("只能选择导入 xls，xlsb，xlsx 格式的文件！");
            return false;
        }
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            const data = e.target.result;
            const zzexcel = XLSX.read(data, { type: 'binary' });
            const result = [];
            for (let i = 0; i < zzexcel.SheetNames.length; i++) {
                const newData = XLSX.utils.sheet_to_json(zzexcel.Sheets[zzexcel.SheetNames[i]]);
                result.push(...newData);
            }
            ele.removeEventListener('change', () => { });
            callback(exportReplaceEn(result, header));
        }
    });
}