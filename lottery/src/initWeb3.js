import {React, useState, useEffect, Component} from 'react'
import {ethers} from 'ethers'

const InitWeb3 = () => {

    let Lotteryabi = [ { "constant": false, "inputs": [], "name": "tuiJiang", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "round", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "manager", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "kaiJiang", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getPlayers", "outputs": [ { "name": "", "type": "address[]" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "play", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getPlayersCount", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "winner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "players", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]

    let contractAddress = '0x2F459B507645E54285DE225DC4f2505fBA351A38';
    
    const [unPlayGameText, setUnPlayGameText] = useState('退奖');
    const [openGameText, setOpenGameText] = useState('开奖');
    const [currentAccount, setCurrentAccount] = useState(null);
    const [playGameText, setPlayGameText] = useState('投注');
    const [connButtonText, setConnButtonText] = useState('Connect wallet');

    const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [winnerAccount, setWinnerAccount] = useState(null);
	const [balance, setBalance] = useState(null);
	const [playerCounts, setPlayerCounts] = useState(null);
    const [round, setRound] = useState(null);

    const connectinitWeb = () => {
        if (window.ethereum) {
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                accountChangeHander(result[0]);
                console.log(result)
                setConnButtonText('Wallet Connected');
            }) 
        } else {
        }
    }

    const accountChangeHander = (newAccount) => {
        setCurrentAccount(newAccount);
        updateEthers(newAccount);
    }

    const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, Lotteryabi, tempSigner);
		setContract(tempContract);	
	}
    

    const update = async () => {
		let playerCounts1 = await contract.getPlayersCount();
		let playerCounts2 = playerCounts1.toNumber();
        setPlayerCounts(playerCounts2)

        let round1 = await contract.round();
        let round2 = round1.toNumber();
        setRound(round2);

        let getBalance = await contract.getBalance();
        let getBalance2 = await ethers.utils.formatEther(getBalance);
        setBalance(getBalance2)

        let winner = await contract.winner();
        setWinnerAccount(winner)
        console.log(winner);

	}

    window.ethereum.on('update', update);

    useEffect(() => {
		if (contract != null) {
			update();
		}
	}, [contract]);

    const playGame = async () => {
        await contract.play({value: ethers.utils.parseEther("1")});
        setPlayGameText('ok');
    }

    const unPlayGame = async () => {
        await contract.tuiJiang();
        setUnPlayGameText('ok');
    }

    const openGame = async () => {
        await contract.kaiJiang();
        setOpenGameText('ok');
    }
    
    return (
        <div className='initWeb3'>
            <button onClick={connectinitWeb}>{connButtonText}</button>
            <div className="accountDisplay">
                <h3>当前用户: {currentAccount}</h3>
            </div>
            <div className="accountDisplay">
                <h3>开奖期数: {round}</h3>
            </div>
            <div className="accountDisplay">
                <h3>上期获奖者: {winnerAccount}</h3>
            </div>
            <div className="balanceDisplay">
                <h3>总额: {balance}</h3>
            </div>
            <div className="balanceDisplay">
                <h3>投资人数: {playerCounts}</h3>
            </div>
            <button onClick={playGame}>{playGameText}</button>
            <button onClick={unPlayGame}>{unPlayGameText}</button>
            <button onClick={openGame}>{openGameText}</button>
        </div>
    )
}
export default InitWeb3;
