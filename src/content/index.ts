(() => {
	const steamID: string | undefined = window.g_steamID
	if(!steamID) {
		console.error("Failed to find SteamID.")
		return
	}

    const itemIdMap: Map<string, string> = createItemIdMap()
	const tradeItems: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(".history_item.economy_item_hoverable")

	tradeItems.forEach((item) => {
		item.removeAttribute("href")

        const tradeId: string = itemIdMap.get(item.id) || ""

		item.onclick = (e: Event) => {
			e.preventDefault()
            itemClicked(tradeId)
		}
	})
})()

function createInspectLink(steamId: string, itemId: string, dNumber: string): string {
    return `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${steamId}A${itemId}D${dNumber}`
}

function findDNumber(itemId: string): string {
    const url: string = window.g_rgHistoryInventory["730"]["2"][itemId]["actions"][0]["link"]
    const dMatch: RegExpMatchArray | null = url.match(/[?&]D=(\d+)/i) || url.match(/D(\d+)/i)
    return dMatch?.[1] || "?"
}

function itemClicked(itemId: string): void {
    const dNumber: string = findDNumber(itemId)
    const inspectLink: string = createInspectLink(window.g_steamID || "?", itemId, dNumber)
    window.open(inspectLink)
}

function createItemIdMap(): Map<string, string> {
    const map: Map<string, string> = new Map();

    const scripts: HTMLScriptElement[] = Array.from(document.querySelectorAll("script"));
    const regex = /HistoryPageCreateItemHover\(\s*'([^']+)'\s*,\s*\d+\s*,\s*'([^']+)'\s*,\s*'(\d+)'\s*,\s*'(\d+)'\s*\)/g;

    scripts.forEach((script) => {
        const text = script.textContent;
        if (!text) return;

        let match;
        while((match = regex.exec(text)) !== null) {
            const anchorId = match[1] || "";
            const itemId = match[3] || ""; // fourth argument = Steam itemId
            map.set(anchorId, itemId)
        }
    })

    return map
}