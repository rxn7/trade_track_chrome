interface Window {
    g_steamID?: string
    g_rgHistoryInventory: any

    HistoryPageCreateItemHover?: (
        anchorId: string,
        appid: number,
        contextid: string,
        itemId: string,
        quantity: string
    ) => void;
}