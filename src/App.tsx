import { ethers } from 'ethers';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import nftAbi from './abis/nft.json';
import abi from './abis/nftswap.json';
import { nftAddress, nftSwapAddress } from './addressHelpers/addressHelper';
import Create from './components/Create';
import CreateSwap from './components/CreateSwap';
import NFTs from './components/NFTs';
import Swaps from './components/Swaps';
import Header from './components/header';
import { SelectedNFTsProvider } from './Helpers/SelectedNFTsContext';
import './assets/style.css'

function App() {
  const [currentAccount, setCurrentAccount] = useState<any>()
  const [signer, setSigner] = useState<any>()
  const [contract, setContract] = useState<any>()
  const [contractNft, setContractNFT] = useState<any>()


  const connectWallet = async () => {

    // const chainId = { mainnet: 137, testnet: 80001 }; // Polygon Mainnet
    const chainId = { mainnet: 1, testnet: 11155111 }; // Sepolia  

    // const chainId = { mainnet: 1, testnet: 5 }; // Goerli 


    if (window.ethereum.networkVersion !== chainId.testnet) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexValue(chainId.testnet) }],
      });
    }

    const { ethereum } = window
    if (ethereum) {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } else {
      return alert('Please install metamask wallet')
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = provider.getSigner();
    setSigner(_signer)

    const contracts = new ethers.Contract(nftSwapAddress, abi.abi, _signer);
    setContract(contracts)
    console.log(contracts, "contracts")

    const nftContract = new ethers.Contract(nftAddress, nftAbi.nftAbi, _signer);
    setContractNFT(nftContract)
    console.log(nftContract, "NFT")
  }

  return (
    <>
      <SelectedNFTsProvider>
        <Header connectWallet={connectWallet} currentAccount={currentAccount} />
        <Routes>
          <Route path='/' element={<Swaps contract={contract} signer={signer} contractNft={contractNft} currentAccount={currentAccount} />} />
          <Route path='/NFTs' element={<NFTs currentAccount={currentAccount} />} />
          <Route path='/Create' element={<Create contract={contract} contractNft={contractNft} nftSwapAddress={nftSwapAddress} signer={undefined} />} />
          <Route path='/CreateSwap' element={<CreateSwap contract={contract} contractNft={contractNft} nftSwapAddress={nftSwapAddress} signer={undefined} />} />
        </Routes>
      </SelectedNFTsProvider>
    </>
  );
}

export default App;
