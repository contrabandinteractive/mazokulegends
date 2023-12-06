<template>
  <div class="chat">
      <ul ref="chat-list">
          <li v-for="(msg, i) in messages" :key="i" :class="`type-${msg.type}`">{{ msg.message }}</li>
      </ul>
      <input 
        type="text" 
        placeholder="Press tab button, type msg, then press enter"
        @focus="stopMove" 
        @blur="startMove" 
        v-model="text" 
        @keypress.enter="send">
  </div>
</template>

<script>
const GUI_CONTROLS = 'rpg-controls'
import { useMetaMaskWallet } from "vue-connect-wallet";
import Web3 from 'web3';
const web3 = new Web3(window.ethereum);
//import MyContract from './contract.json';
let theNumOfSwords; 








// Contract ABI
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MAX_SWORDS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PRICE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasMintedSword",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintSword",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSwordsMinted",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];



const contract = new web3.eth.Contract(contractABI, '0x8FA30Ac6e52D48829B9Bd19A65a27da81C3B3666');

// Check if user has minted already
async function hasUserMintedSword(checkThis) {
  try {
      const minted = await contract.methods.hasMintedSword(checkThis).call();
      return minted;
  } catch (error) {
      console.error("Error checking if user has minted a sword:", error);
      return false;
  }
}

let firstAccount;
let hasMinted;






export default {
    name: 'rpg-chat',
    inject: ['rpgEngine', 'rpgGui', 'rpgSocket'],
    data() {
        return {
            text: '',
            messages: []
        }
    },
    mounted() {
        const socket = this.rpgSocket();
        socket.on('chat-message', ({ message, type }) => {
			
			if(message.includes('send xrp') || message.includes('send XRP')){
				let theAmount = prompt("How much XRP do you want to send?");
				let theRecipient = prompt("To which wallet address?");
				const wallet = useMetaMaskWallet();
				wallet.getAccounts()
				.then(accounts => {
					if (Array.isArray(accounts) && accounts.length > 0) {
					// Get the first account
					firstAccount = accounts[0];

					const tx = {
						//from: firstAccount,
						//to: theRecipient,
						from: firstAccount,
						to: theRecipient.toString(),
						value: web3.utils.toWei(theAmount.toString(), 'ether'),
						gas: 2000000,
						gasPrice: web3.utils.toWei('10', 'gwei')
					};

					console.log(tx);

					web3.eth.sendTransaction(tx)
					.on('transactionHash', hash => console.log(`Transaction hash: ${hash}`))
					.on('receipt', receipt => console.log(`Receipt: ${receipt}`))
					.on('error', error => console.error(`Error: ${error}`));

					
					}
				})

				

			}else{
				this.messages.push({
					message,
					type
				})
				const el = this.$refs['chat-list']
				el.scrollTop = el.scrollHeight + 100
			}
        });



		// Begin initWeb3 block
		// Connect MetaMask
		console.log('Connecting to MetaMask...');
		const wallet = useMetaMaskWallet();
		wallet.connect();
		wallet.getAccounts()
		.then(accounts => {
			if (Array.isArray(accounts) && accounts.length > 0) {
			// Get the first account
			firstAccount = accounts[0];
			console.log("First connected account:", firstAccount);
			//firstAccount = 'test';
			//console.log('Passing to server.');
			socket.emit('walletAddress', { firstAccount })

			hasUserMintedSword(firstAccount).then((minted) => {
				if (minted) {
					console.log("User has minted a sword.");
					hasMinted=true;
					// Need to update server here!
					//
					socket.emit('setMintedStatus', { value:true })

				} else {
					console.log("User has not minted a sword.");
				}
			});


			} else {
			// Handle the case where no accounts are connected or an error occurred
				console.log("No connected accounts or an error occurred:", accounts);
				alert('Please connect to MetaMask first and make sure you have an account on the XRPL sidechain!');
				alert('After you connect, RELOAD this page.');
				socket.emit('notConnected', { notConnected:true })
				wallet.connect();
			}
		})
		.catch(error => {
			// Handle any errors that occur during the execution of getAccounts()
			console.error("Error fetching accounts:", error);
		});

		
		// End initWeb3 block










        // Listen for sendMoney event
        this.rpgSocket().on('sendMoney', (data) => {
           console.log('Sending XRP...'); 
           console.log(data);
           console.log(web3.eth.getGasPrice());

            const tx = {
                from: data.sendFrom,
                to: '0xD8Ea779b8FFC1096CA422D40588C4c0641709890',
                //value: web3.utils.toWei(data.amount, 'ether'),
                value: web3.utils.toWei(data.amount.toString(), 'ether'),
                gas: 2000000,
                gasPrice: web3.utils.toWei('10', 'gwei')
            };

            web3.eth.sendTransaction(tx)
            .on('transactionHash', hash => console.log(`Transaction hash: ${hash}`))
            .on('receipt', receipt => console.log(`Receipt: ${receipt}`))
            .on('error', error => console.error(`Error: ${error}`));

       });



      this.rpgSocket().on('getNumOfSwordsMinted', (data) => {
        const contract = new web3.eth.Contract(contractABI, '0x8FA30Ac6e52D48829B9Bd19A65a27da81C3B3666');

        

        // See how many swords were minted
        contract.methods.totalSwordsMinted().call()
            .then((numberOfSwordsMinted) => {
                console.log("Total number of swords minted:", numberOfSwordsMinted);
                console.log("Total number of swords minted:", Number(numberOfSwordsMinted));
                const socket = this.rpgSocket()
                socket.emit('updateNumOfSwords', {theNumOfSwords:Number(numberOfSwordsMinted)})
            })
            .catch((error) => {
                console.error("Error fetching the number of swords minted:", error);
        });

   
        

        

       });

       this.rpgSocket().on('mintSword', (data) => {
        const contract = new web3.eth.Contract(contractABI, '0x8FA30Ac6e52D48829B9Bd19A65a27da81C3B3666');


        // See how many swords were minted
        contract.methods.totalSwordsMinted().call()
            .then((numberOfSwordsMinted) => {
                console.log("Total number of swords minted:", numberOfSwordsMinted);
            })
            .catch((error) => {
                console.error("Error fetching the number of swords minted:", error);
        });

        const tx = {
                from: data.sendFrom,
                value: web3.utils.toWei('5', 'ether'),
                gas: 2000000,
                gasPrice: web3.utils.toWei('10', 'gwei')
        };
        contract.methods.mintSword().send(tx).then((receipt) => {
            console.log('Transaction successful. Receipt:', receipt);
			const socket = this.rpgSocket()
            socket.emit('updateSwordStatus', {hasSword:true})
        })
        .catch((error) => {
            console.error('Transaction failed:', error);
        });;

           /*
           console.log('Sending XRP...'); 
           console.log(data);
           console.log(web3.eth.getGasPrice());

            const tx = {
                from: data.sendFrom,
                to: '0xD8Ea779b8FFC1096CA422D40588C4c0641709890',
                //value: web3.utils.toWei(data.amount, 'ether'),
                value: web3.utils.toWei('0.01', 'ether'),
                gas: 2000000,
                gasPrice: web3.utils.toWei('10', 'gwei')
            };

            web3.eth.sendTransaction(tx)
            .on('transactionHash', hash => console.log(`Transaction hash: ${hash}`))
            .on('receipt', receipt => console.log(`Receipt: ${receipt}`))
            .on('error', error => console.error(`Error: ${error}`));
            */

       });
    },
    methods: {
        stopMove() {
            if (this.rpgGui.exists(GUI_CONTROLS)) this.rpgGui.hide(GUI_CONTROLS)
            this.rpgEngine.controls.stop = true
        },
        startMove() {
             if (this.rpgGui.exists(GUI_CONTROLS)) this.rpgGui.display(GUI_CONTROLS)
            this.rpgEngine.controls.stop = false
        },
        send() {
            if (!this.text) return
            const socket = this.rpgSocket()
            socket.emit('chat-message', this.text)
            

            this.text = ''
        }
    }
}
</script>

<style scoped lang="scss">
.chat {
    position: absolute;
    z-index: 101;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 70;
}

.chat input {
    padding: 10px;
     width: 300px;
}

.chat ul {
    list-style: none;
    color: white;
    font-family: $window-font-family;
    padding: 0;
    margin-left: 10px;
    max-height: 200px;
    overflow: auto;
}

.chat li.type-info {
    color: #59da25;
}
</style>