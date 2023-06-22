import { Link } from 'react-router-dom';
import '../index.css'
import React from 'react';

interface data {
    connectWallet: () => Promise<void>;
    currentAccount: any

}

const Header = ({ connectWallet, currentAccount }: data) => {

    const Address = currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : null;

    return (
        <>
            <header className='header' >
                <nav className='Nav'>
                    <Link to="/">Swap</Link>
                    <Link to="/NFTs">NFTs</Link>
                    <Link to="/Create">Create</Link>
                    <Link to="/CreateSwap">CreateSwap</Link>
                </nav>
                <div className='Container'>
                    <button className='cnt-btn' onClick={connectWallet}>{currentAccount ? Address : "Connect wallet"}</button>
                </div>
            </header>
        </>
    )
}

export default Header