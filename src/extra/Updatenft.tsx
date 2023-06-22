import React, { useState } from 'react'

interface data {
    contract : any;
}

const Updatenft = ({contract}:data) => {

    const [swapIdCount, setSwapIdCount] = useState(0);

    const handleCancleSwap = async (event: any) => {
        event.preventDefault()
        forCancleSwap(swapIdCount)
    }

    const handleConfirmSwap = async (event: any) => {
        event.preventDefault()
        forCompleteSwap(swapIdCount)
    }
    const handleSwapIdChange = (value: string) => {
        const newSwapIdCount = parseInt(value);
        setSwapIdCount(newSwapIdCount);
    };
    const forCancleSwap = async (swapIdCount: any) => {
        return await contract.cancelSwap(swapIdCount)
    }
    const forCompleteSwap = async (swapIdCount: any) => {
        return await contract.completeSwap(swapIdCount)
    }
    return (
        <div>

            <h3>To Cancle Your Swap</h3>
            <label htmlFor="swapId">Enter swap ID:</label>
            <input type="text" className='label' onChange={(e) => handleSwapIdChange(e.target.value)} />
            <button onClick={handleCancleSwap}>Cancle Swap</button> <br />
            <h3>To Complete Your Swap</h3>
            <label htmlFor="swapId">Enter swap ID:</label>
            <input type="text" className='label' onChange={(e) => handleSwapIdChange(e.target.value)} />
            <button onClick={handleConfirmSwap}>Complete Swap</button>
        </div>
    )
}

export default Updatenft
