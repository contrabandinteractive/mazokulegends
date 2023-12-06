import { RpgEvent, EventData, RpgPlayer } from '@rpgjs/server'

@EventData({
    name: 'EV-3', 
    hitbox: {
        width: 32,
        height: 16
    }
})
export default class VillagerEvent extends RpgEvent {
    onInit() {
        this.setGraphic('enemy2')
    }
    async onAction(player: RpgPlayer) {

        if (player.getVariable('notConnected')) {

            await player.showText('Connect to MetaMask first and then RELOAD this page!', {
                talkWith: this
            })

        }else{

            await player.showText('Did you know that you can send XRP to other players using the chat window?', {
                talkWith: this
            })

            await player.showText('Simply say, "send XRP" in the chat!', {
                talkWith: this
            })

        }

       
        
    }
} 