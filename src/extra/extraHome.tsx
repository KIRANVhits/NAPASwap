import { useEffect, useState } from 'react';

type Swap = {
    sender: string;
    recipient: string;
    Nftaddress: string;
    senderNFTId: number;
    recipientNFTId: number;
    initiated: boolean;
    startTime: number;
    endTime: number;
};
type Swap2 = {
    sender : string 
    recipient :string
    senderNFTId :number
    recipientNFTId: number
    senderPrice : string
    recipientPrice : string
    startTime : number
    endTime: number
    active : boolean
    swapComplete : boolean
}

interface data {
    contract: any;
    signer: any
}
const Home = ({ contract, signer }: data) => {
    const [swapIdCount, setSwapIdCount] = useState(0);
    const [swapDetails, setSwapDetails] = useState<Swap[]>([]);
    const [selectedSwapId, setSelectedSwapId] = useState("");


    const handleSwapIdChange = (value: string) => {
        setSelectedSwapId(value);
    };

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

    const handleGetSwapDetails = async () => {
        console.log(handleGetSwapDetails, "called")
        const swapId = parseInt(selectedSwapId);
        const swap = await contract.swaps(swapId)
        const newSwapDetails = {
            sender: swap.sender,
            recipient: swap.recipient,
            Nftaddress: swap.Nftaddress,
            senderNFTId: swap.senderNFTId.toNumber(),
            recipientNFTId: swap.recipientNFTId.toNumber(),
            initiated: swap.initiated,
            startTime: swap.startTime.toNumber(),
            endTime: swap.endTime.toNumber(),
        };
        setSwapDetails([newSwapDetails]);
        console.log(setSwapDetails, "swapp")
    };

    return (
        <div>
            <h2 >Total Swaps :  {swapIdCount}</h2>
            <h2 >Available Swaps :  {swapDetails.filter(swap => swap.initiated).length}</h2>
            <label htmlFor="swapId">Enter swap ID:</label>
            <input type="text" className='label' onChange={(e) => handleSwapIdChange(e.target.value)} />
            <button className='sbt-btn' onClick={handleGetSwapDetails}>Show Details</button>
            <ul>
                {swapDetails.map((swap, index) => (
                    <li key={index} className='details'>
                        <p>Sender: {swap.sender}</p>
                        <p>Recipient: {swap.recipient}</p>
                        <p>NFT Address: {swap.Nftaddress}</p>
                        <p>Sender NFT ID: {swap.senderNFTId}</p>
                        <p>Recipient NFT ID: {swap.recipientNFTId}</p>
                        <p>Initiated: {swap.initiated ? "true" : "false"}</p>
                        <p>Start Time: {swap.startTime}</p>
                        <p>End Time: {swap.endTime}</p>
                    </li>
                ))}
            </ul>
        </div>
    )

}
export default Home

