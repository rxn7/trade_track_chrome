function createInspectLink(steamId: string, itemId: string, dNumber: string): string {
    return `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${steamId}A${itemId}D${dNumber}`
}

function findDNumber(itemId: string): string {
    const url: string = window.g_rgHistoryInventory["730"]["2"][itemId]["actions"][0]["link"]
    const dMatch: RegExpMatchArray | null = url.match(/[?&]D=(\d+)/i) || url.match(/D(\d+)/i)
    return dMatch?.[1] || "?"
}

function itemClicked(url: string): void {
    const parts: string[] = url.split('_');
    const itemId: string = parts[parts.length - 1] || "";
    const dNumber: string = findDNumber(itemId)

    const inspectLink: string = createInspectLink(window.g_steamID || "?", itemId, dNumber)
    window.open(inspectLink)
}

(() => {
	const steamID: string | undefined = window.g_steamID
	if(!steamID) {
		console.error("Failed to find SteamID.")
		return
	}

	const tradeItems: NodeListOf<HTMLAnchorElement> = document.querySelectorAll<HTMLAnchorElement>("a.history_item.economy_item_hoverable")
	tradeItems.forEach((item) => {
        const url: string = item.getAttribute("href") || ""
		item.removeAttribute("href")

		item.onclick = (e: Event) => {
			e.preventDefault()
            itemClicked(url)
		}
	})
})()