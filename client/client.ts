import { Delay } from './util'
import { drawText, faceEatchOther, startItemExchangeAnimation, loadObjectInHand, randomDrug, endScript, cancelDeal } from './functions'
import { IDrug } from '../Types';

let closeToPed: boolean = false;
let interacting: boolean = false;
const npcsSoldTo: Array<number> = []

let drugAmount: number = 0;
let drug: IDrug | null = null;
let pricePerG: number = 0;
let ped: number = 0;

RegisterNuiCallbackType('uiCallbacks')

on('__cfx_nui:uiCallbacks', (data: any) => {
    const callbackType = data.callbackType;

    if (callbackType === 'drug confirmation') {
        if (!drug)
            return;

        interacting = false;
        closeToPed = false;

        npcsSoldTo.push(ped);

        if (data.acceptedOffer === 'time') {
            global.exports["ui"].Notify(`You took to long to decide, the stranger walked away`, "error", 3500, "Failed");

            cancelDeal(ped);

            return;
        }

        if (data.acceptedOffer) {
            global.exports["ui"].Notify(`You sold ${drugAmount}g of ${drug['name']} for $${pricePerG * drugAmount}`, "success", 3500, "Success");

            emitNet("processDeal", drugAmount, pricePerG * drugAmount, drug['itemName']);

            endScript(ped);
        } else {
            cancelDeal(ped);
        }
    }
});

setTick(async () => {
    !closeToPed
        && await Delay(500);

    const [playerX, playerY, playerZ]: Array<number> = GetEntityCoords(PlayerPedId(), false);
    const [retval, outPed]: [boolean, number] = GetClosestPed(playerX, playerY, playerZ, 2, true, false, false, false, 1);

    if (retval && DoesEntityExist(outPed) && !interacting && !npcsSoldTo.includes(outPed)) {
        const [npcX, npcY, npcZ]: Array<number> = GetEntityCoords(outPed, false);

        drawText(npcX, npcY, npcZ, "Press ~b~[E] ~w~to interact");

        if (IsControlJustPressed(38, 38)) {
            if (!Math.round(Math.random())) {
                TaskSmartFleePed(outPed, PlayerPedId(), 10000, -1, false, false);

                global.exports["ui"].Notify("The stranger called the police!", "info", 3500, "Police");

                // Add your police alarm export 
                // global.exports["export name"].export_funciton(parameters) 

                return;
            }

            const maxLength: number = 1;
            const minLength: number = 0;
            drugAmount = Math.floor(Math.random() * (maxLength - minLength + 1) + 1);

            ped = outPed;
            drug = randomDrug();
            pricePerG = drug['price'] - Math.floor(Math.random() * (50 - 20 + 1) + 20);

            SendNUIMessage({
                type: 'open',
                conversation: `Hel... Hello you got ${drugAmount}g of ${drug['name']} for $${pricePerG * drugAmount}, please dude`,
                dealRate: pricePerG >= drug['price'] - 25 ? 'Good' : pricePerG >= drug['price'] - 40 ? 'Medium' : 'Bad',
                sex: IsPedMale(outPed) ? 'male' : 'female'
            });

            faceEatchOther(PlayerPedId(), outPed);

            SetNuiFocus(true, true);

            const cam: number = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
            SetCamCoord(cam, npcX, npcY - 1, npcZ + .5);

            RenderScriptCams(true, false, 0, true, false);

            TaskStandStill(outPed, -1);

            SetEntityCoords(outPed, npcX, npcY, npcZ - 1, true, false, false, false);
            SetEntityCoords(PlayerPedId(), npcX, npcY - 1, npcZ - 1, true, false, false, false);

            FreezeEntityPosition(outPed, true);

            SetEntityHeading(PlayerPedId(), 360);

            SetEntityHeading(outPed, 180);

            interacting = true;

            closeToPed = true;

            return;
        }

        closeToPed = true;
        return;
    }

    interacting = false;
    closeToPed = false;
});
