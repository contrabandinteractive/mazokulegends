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
import Web3 from 'web3';
const web3 = new Web3(window.ethereum);
//import MyContract from './contract.json';
let theNumOfSwords; 


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
            this.messages.push({
                message,
                type
            })
            const el = this.$refs['chat-list']
            el.scrollTop = el.scrollHeight + 100
        });
        // Listen for sendMoney event
        this.rpgSocket().on('sendMoney', (data) => {
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

       });



      this.rpgSocket().on('getNumOfSwordsMinted', (data) => {
        const contract = new web3.eth.Contract(contractABI, '0x6Dd3d40aEF62C15e02A442a512626c17dD58036d');

        

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
        const contract = new web3.eth.Contract(contractABI, '0x6Dd3d40aEF62C15e02A442a512626c17dD58036d');


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
                value: web3.utils.toWei('0.001', 'ether'),
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