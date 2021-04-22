import store from '@/store'

// 递归过滤 `hidden` 为 false 的组件
export function filterMenu(arr) {
    return arr
        .filter((item) => !item.meta.hidden)
        .map((item) => {
            item["title"] = item.meta.title;
            item = Object.assign({}, item);
            if (item.children) item.children = filterMenu(item.children)
            return item;
        });
}

// 导出过滤后的菜单
export function routesFilter() {
    return filterMenu(store.state.menuData.children)
}