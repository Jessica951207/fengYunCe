import JSON2CSV from 'json2csv'
import XLSX from 'xlsx'
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

/**
 * 导出表格数据
 */

// 判断是否IE浏览器
export function browserIsIE() {
    let isIE = false;
    // ie浏览器
    if (navigator.userAgent.indexOf("compatible") > -1 && navigator.userAgent.indexOf("MSIE") > -1) isIE = true;
    // edge 浏览器
    if (navigator.userAgent.indexOf("Trident") > -1) isIE = true;
    return isIE;
}

// 创建a标签下载
export function createDownLoadClick(csvContent, fileName) {
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 导出：英文键名转中文键名，替换 key 值
export function exportReplaceCn(tableData, header) {
    for (let i in header) {
        for (let j in tableData) {
            for (let o in tableData[j]) {
                for (let k in header[i]) {
                    if (o === k) {
                        tableData[j][header[i][k]] = tableData[j][o];
                        delete tableData[j][o];
                    }
                }
            }
        }
    }
    return tableData;
}

/**
 * 1、导出 csv
 * @param {*} tableData 表格列表数据
 * @param {*} header 表格标题头格式 [{xx:'中文1'},{xx:'中文2'}]
 * @param {*} fileName 文件名称
 */
export function exportCsv(tableData, header, fileName) {
    const result = JSON2CSV.parse(exportReplaceCn(tableData, header), { header, excelStrings: true });
    if (browserIsIE()) {
        // IE10以及Edge浏览器
        // 文件转Blob格式
        let csvContent = new Blob([`\uFEFF${result}`], { type: "text/csv" });
        navigator.msSaveBlob(csvContent, `${fileName}.csv`);
    } else {
        let csvContent = `data:text/csv;charset=utf-8,\uFEFF${result}`;
        // 非ie 浏览器
        createDownLoadClick(csvContent, `${fileName}.csv`);
    }
}

/**
 * 2、导出 xls，xlsb，xlsx
 * @param {*} tableData 表格列表数据
 * @param {*} header 表格标题头格式 [{xx:'中文1'},{xx:'中文2'}]
 * @param {*} fileType 文件类型
 * @param {*} fileName 文件名称
 */
export function exportXLsx(tableData, header, fileType, fileName) {
    let ws = XLSX.utils.json_to_sheet(exportReplaceCn(tableData, header));
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.${fileType}`);
}

/**
 * 3、导出 pdf
 * @param {*} ele 要生成 pdf 的DOM元素（容器）
 * @param {*} fileName 文件名称
 */
export function exportPdf(ele, fileName) {
    let eleW = ele.offsetWidth;// 获得该容器的宽
    let eleH = ele.offsetHeight;// 获得该容器的高
    let eleOffsetTop = ele.offsetTop;  // 获得该容器到文档顶部的距离
    let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离
    let canvas = document.createElement("canvas");
    let abs = 0;
    let win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
    let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
    if (win_out > win_in) abs = (win_out - win_in) / 2;    // 获得滚动条宽度的一半
    canvas.width = eleW * 2;    // 将画布宽&&高放大两倍
    canvas.height = eleH * 2;
    let context = canvas.getContext("2d");
    context.scale(2, 2);
    context.translate(-eleOffsetLeft - abs, -eleOffsetTop);
    // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
    // translate的时候，要把这个差值去掉
    // html2canvas(element).then( (canvas)=>{ //报错
    // html2canvas(element[0]).then( (canvas)=>{
    html2canvas(ele, {
        dpi: 300,
        // allowTaint: true,  // 允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
        useCORS: true  // 允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
    }).then((canvas) => {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        // 一页pdf显示html页面生成的canvas高度;
        let pageHeight = contentWidth / 592.28 * 841.89;
        // 未生成pdf的html页面高度
        let leftHeight = contentHeight;
        // 页面偏移
        let position = 0;
        // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let imgWidth = 595.28;
        let imgHeight = 595.28 / contentWidth * contentHeight;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let pdf = new JsPDF('', 'pt', 'a4');
        // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
            // 在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
            // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
        } else {    // 分页
            while (leftHeight > 0) {
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 841.89;
                // 避免添加空白页
                if (leftHeight > 0) pdf.addPage();
            }
        }
        // 可动态生成
        pdf.save(fileName);
    })
}