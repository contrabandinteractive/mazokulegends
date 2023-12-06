import { RpgEvent, EventData, RpgPlayer } from '@rpgjs/server'
const Web3 = require('web3');
const web3 = new Web3("https://rpc-evm-sidechain.xrpl.org");

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


        if (player.getVariable('notConnected')) {

            await player.showText('Connect to MetaMask first and then RELOAD this page!', {
                talkWith: this
            })

        }else{

            await player.showText('Dark Lord: Let\'s battle!', {
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
                await player.showText('The Dark Lord attacks and deals '+rndDmg+' damage!', {
                    talkWith: this
                });
                await player.showText('You collapse and lose 10 XRP! (You transfer 10 XRP to the Dark Lord)', {
                    talkWith: this
                });
                
                player.emit('sendMoney',{amount: 10, sendFrom: player.getVariable('defaultWallet')});
            }
            else{
                // Player has sword
                await player.showText('You hit the Dark Lord with your sword and deal '+rndDmg+' damage!', {
                    talkWith: this
                });
                await player.showText('You win and gain 5 XRP! Check your wallet to see the updated balance.', {
                    talkWith: this
                });
                
                // Send 10 XRP from custodial account to player
                // below:

                // The private key must start with '0x'
                
                const privateKey = import.meta.env.VITE_PRIVATE_KEY; // Replace with your private key

                const account = web3.eth.accounts.privateKeyToAccount(privateKey);
                web3.eth.accounts.wallet.add(account);

                // Replace 'fromAddress' and 'toAddress' with actual Ethereum addresses
                const fromAddress = account.address;
                const toAddress = player.getVariable('defaultWallet');
                
                const sendTransaction = async () => {
                try {
                    const tx = {
                    from: fromAddress,
                    to: toAddress,
                    value: web3.utils.toWei('5', 'ether'), // Amount of ETH to send
                    maxPriorityFeePerGas: web3.utils.toWei('2', 'gwei'),
                    maxFeePerGas: web3.utils.toWei('100', 'gwei'),
                    gas: 21000 // Standard gas limit for ETH transfer
                    };

                    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
                    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                    console.log('Transaction receipt:', receipt);
                } catch (error) {
                    console.error('Error sending transaction:', error);
                }
                };
                sendTransaction();
                
            
                

            }

        }

       
        
    }
} 