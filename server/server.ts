let ESX = global.exports["es_extended"].getSharedObject()

onNet("processDeal", (drugAmount: number, price: number, itemName: string): void => {
    const xPlayer = ESX.GetPlayerFromId(source)

    xPlayer.removeInventoryItem(itemName, drugAmount)
    xPlayer.addMoney(price)
});