import { Config } from '../server/config';
import { IDrug } from '../Types'

export const drawText = (x: number, y: number, z: number, text: string): void => {
    SetTextScale(0.27, 0.27)
    SetTextFont(4)
    SetTextProportional(true)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry("STRING")
    SetTextCentre(true)
    AddTextComponentString(text)
    SetDrawOrigin(x, y, z, 0)
    DrawText(0.0, 0.002)
    DrawRect(0.0, 0.0 + 0.0125, 0.055, 0.02, 0, 0, 0, 75)
    ClearDrawOrigin()
}

export const faceEatchOther = (player: number, ped: number): void => {
    const [playerX, playerY, playerZ]: Array<number> = GetEntityCoords(player, false);
    SetEntityCoordsNoOffset(ped, playerX + 1.3, playerY, playerZ, true, true, true);

    const [pedX, pedY, pedZ]: Array<number> = GetEntityCoords(ped, false);
    const direction: number = Math.atan2(pedY - playerY, pedX - playerX) * (180 / Math.PI);

    SetEntityHeading(player, direction - 90);
    SetEntityHeading(ped, direction + 90);
}

const playAnimation = async (player: number, dictionary: string, animation: string): Promise<void> => {
    RequestAnimDict(dictionary);

    while (!HasAnimDictLoaded(dictionary)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    TaskPlayAnim(player, dictionary, animation, 8.0, -8.0, -1, 0, 0, false, false, false);
}


export const startItemExchangeAnimation = async (player: number, ped: number): Promise<void> => {
    const animDictionary: string = "mp_common";
    const animGiveItem: string = "givetake2_a";
    const animReceiveItem: string = "givetake2_a";

    playAnimation(player, animDictionary, animGiveItem);

    await new Promise((resolve) => setTimeout(resolve, 100));

    playAnimation(ped, animDictionary, animReceiveItem);
}

export const loadObjectInHand = (player: number, modelHash: number): void => {
    const object: number = CreateObjectNoOffset(modelHash, 0.0, 0.0, 0.0, true, true, false);
    AttachEntityToEntity(object, player, GetPedBoneIndex(player, 57005), 0.15, 0.0, 0, 300, 270.0, 60.0, true, true, false, true, 1, true)

    setTimeout(() => {
        DetachEntity(object, true, true);
        DeleteEntity(object);
    }, 1500);
}

export const randomDrug = (): IDrug => {
    return Config.drugs[Math.floor(Math.random() * (Config.drugs.length - 0) + 0)];
}

export const endScript = (npc: number): void => {
    const cam: number = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);

    DestroyCam(cam, true);
    RenderScriptCams(false, false, 0, true, false);

    SetNuiFocus(false, false)

    startItemExchangeAnimation(PlayerPedId(), npc)

    loadObjectInHand(PlayerPedId(), GetHashKey("prop_drug_package_02"));

    setTimeout(() => {
        loadObjectInHand(PlayerPedId(), GetHashKey("prop_anim_cash_pile_01"));
    }, 1200)

    setTimeout(() => {
        loadObjectInHand(npc, GetHashKey("prop_drug_package_02"));

        FreezeEntityPosition(npc, false)
    }, 1500)
}

export const cancelDeal = (ped: number): void => {
    const cam: number = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);

    DestroyCam(cam, true);
    RenderScriptCams(false, false, 0, true, false);

    SetNuiFocus(false, false)

    ClearPedTasks(ped)

    FreezeEntityPosition(ped, false);
}