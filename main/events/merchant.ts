import { RpgEvent, EventData, RpgPlayer } from '@rpgjs/server'

@EventData({
    name: 'EV-2', 
    hitbox: {
        width: 32,
        height: 16
    }
})
export default class VillagerEvent extends RpgEvent {
    onInit() {
        this.setGraphic('female')
    }
    async onAction(player: RpgPlayer) {

        // Check to see if player already has sword
        if(player.getVariable('hasSword')){
            
            await player.showText('You already have a sword! Go forth and battle!', {
                talkWith: this
            });

        }else{
            player.emit('getNumOfSwordsMinted');

            await player.showText('Well, hello there! I make the finest swords in the land.', {
                talkWith: this
            });
            let choice;
            choice = await player.showChoices('Purchase a sword for 5 XRP? (This action mints a sword NFT):', [
                { text: 'Yes!', value: 1 },
                { text: 'No, thanks.', value: 0 }
            ]);
            

            if(choice.value==1){
                await player.showText('Excellent choice! That\'ll be 5 XRP, please!', {
                    talkWith: this
                })
                player.emit('mintSword',{amount: 10, sendFrom: player.getVariable('defaultWallet')});
                
            }else{
                await player.showText('Alright. I know times are tough. Come back any time!', {
                    talkWith: this
                })
            }

            await player.showText('By the way, did you know that '+player.getVariable('numSwords')+' swords have been forged so far!', {
                talkWith: this
            });
        }

      

       
        
    }
} 