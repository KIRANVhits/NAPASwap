import { useEffect, useState } from 'react';


interface data {
    contract : any;
    signer:any
}
const Swapnft = ({contract,signer}:data) => {

    // const [currentAccount, setCurrentAccount] = useState<any>()
    // const [signer, setSigner] = useState<any>()
    // const [contract, setcontract] = useState<any>()
    const [senderNFTId, setSenderNFTId] = useState("");
    const [receiverNFTId, setreceiverNFTId] = useState('')
    const [endTimeOfSwapping, setEndTimeOfSwapping] = useState("");
    const [swapIdCount, setSwapIdCount] = useState(0);
    // const [swapDetails, setSwapDetails] = useState<Swap[]>([]);

    const handleSwapIdChange = (value: string) => {
        const newSwapIdCount = parseInt(value);
        setSwapIdCount(newSwapIdCount);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        initiateSwap(senderNFTId, endTimeOfSwapping);
    };

    const receipentHanleSubmit = (event: any) => {
        event.preventDefault()
        pairNFT(swapIdCount, receiverNFTId)
    }

    useEffect(() => {
        async function fetchSwapIdCount() {
            const swapIdCount = await getSwapId();
            setSwapIdCount(swapIdCount);
        }
        fetchSwapIdCount();
    }, [signer]);

    const getSwapId = async () => {
        const swapIdCount = await contract.swapId()
        console.log(swapIdCount.toNumber(), "jjjj")
        return swapIdCount.toNumber()
    }

    const initiateSwap = async (senderNFTId: any, endTimeOfSwapping: any) => {
        
        return await contract.initiateSwap(senderNFTId, endTimeOfSwapping)
    }

    const pairNFT = async (swapIdCount: any, receiverNFTId: any) => {
        return await contract.setRecipientNFT(swapIdCount, receiverNFTId)
    }


    return (
        <div>

            <h3> Pair creator for Initiate Swap</h3>
            <form onSubmit={handleSubmit}>
                <h6 > Enter details to create a pair </h6><br />
                <label>
                    Your NFT ID:
                    <input type="text" className='label' value={senderNFTId} onChange={(e) => setSenderNFTId(e.target.value)} />
                </label>
                <br />
                <label>
                    End time of swapping:
                    <input type="text" className='label' value={endTimeOfSwapping} onChange={(e) => setEndTimeOfSwapping(e.target.value)} />
                </label>
                <br />
                <button className='sbt-btn'>Initiate swap</button>

            </form> <br />

            {/* <h3>Join the swap pair</h3>

            <h6 > Enter details to swap your NFT</h6><br />
            
            <label >Enter swap ID you want to swap with:</label>
            <input type="text" className='label' onChange={(e) => handleSwapIdChange(e.target.value)} /> <br />
            
            <label > Your NFT ID : </label>
            <input type="text" className='label' value={receiverNFTId} onChange={(e) => setreceiverNFTId(e.target.value)} /> <br />
            <button onClick={receipentHanleSubmit}> submit </button> <br /> */}

            
           
        </div>
    )

}
export default Swapnft

