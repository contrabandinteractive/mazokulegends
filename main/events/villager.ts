import { RpgEvent, EventData, RpgPlayer } from '@rpgjs/server'

@EventData({
    name: 'EV-1', 
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

        await player.showText('Let\'s battle!', {
            talkWith: this
        })

        let choice;

        // Detect if player has sword
        if (player.getVariable('hasSword')) {
            choice = await player.showChoices('Choose:', [
                { text: 'Sword Attack', value: 1 },
                { text: 'Do nothing', value: 0 }
            ])
        }else{
            choice = await player.showChoices('You\'re unarmed! Choose:', [
                { text: 'Try to run', value: 0 },
                { text: 'Do nothing', value: 0 }
            ])     
        }

        let rndDmg = Math.floor(Math.random() * 50);

        if(choice.value==0){
            // Player does not have sword and dies
            await player.showText('The monster attacks and deals '+rndDmg+' damage!', {
                talkWith: this
            });
            await player.showText('You collapse and lose 10 XRP!', {
                talkWith: this
            });
            player.emit('sendMoney',{amount: 10, sendFrom: player.getVariable('defaultWallet')});
        }
        else{
            // Player has sword
            await player.showText('You slice the monster with your sword and deal '+rndDmg+' damage!', {
                talkWith: this
            });
            await player.showText('You win and gain 25 XRP! Check your wallet to see the updated balance.', {
                talkWith: this
            });
            player.emit('receiveMoney',{amount: 25});
        }

       
        
    }
} 