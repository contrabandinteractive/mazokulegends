import { RpgPlayer, type RpgPlayerHooks, Control, Components } from '@rpgjs/server'
import truncateEthAddress from 'truncate-eth-address'

const player: RpgPlayerHooks = {
    /*
    onConnected(player: RpgPlayer) {
        player.name = ''
        player.setComponentsTop(Components.text('{name}'))
    },
    */
    async onConnected(player: RpgPlayer){
        //Update player name with wallet address
        player.on('walletAddress',(message) => {
            player.setVariable('defaultWallet', message.firstAccount);
            player.name = ''
            console.log(truncateEthAddress(message.firstAccount));
            //player.name = message.firstAccount;
            player.name = truncateEthAddress(message.firstAccount);
            player.setComponentsTop(Components.text('{name}'))
        });

        player.on('updateNumOfSwords',(message) => {
            console.log(message);
            player.setVariable('numSwords', message.theNumOfSwords);
            console.log('Number of swords updated to '+message.theNumOfSwords);
            
        });

        player.on('updateSwordStatus',(message) => {
            player.setVariable('hasSword', true);
            console.log('Player now has a sword!');
            player.showNotification('You now own a sword! You will now stand a chance when engaging in battle.', {
                time: 9000
            })
        });

        player.on('setMintedStatus',(message) => {
            player.setVariable('hasSword', true);
            console.log('Player now has a sword!');
            
        });
        console.log('Now connected');
    },
    onInput(player: RpgPlayer, { input }) {
        if (input == Control.Back) {
            //player.callMainMenu()
        }
    },
    async onJoinMap(player: RpgPlayer) {
        if (player.getVariable('AFTER_INTRO')) {
            return
        }
        await player.showText('Welcome to Mazoku Legends!')
        await player.showText('Obtain a sword so that you can defeat the monster!')
        await player.showText('You will win or lose XRP depending on the outcome of battles.')
        await player.showText('P.S. thanks for checking out my NEW HORIZON hackathon submission! -Mark')
        player.setVariable('AFTER_INTRO', true)
    }
}

export default player