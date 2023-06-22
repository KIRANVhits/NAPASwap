import React, { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SelectedNFTsContext } from '../Helpers/SelectedNFTsContext';

interface Props {
    contract: any;
    signer: any;
    contractNft: any;
    nftSwapAddress: any;
}

const CreateSwap = ({ contract, contractNft, nftSwapAddress }: Props) => {
    const [senderNFTImage, setSenderNFTImage] = useState('');
    const [nftImage, setnftImage] = useState('');
    const [nftPrice, setNftPrice] = useState<any>();
    const [swappingId, setSwappingId] = useState<string>('');
    const [selectedNFTs] = useContext(SelectedNFTsContext);
    const location = useLocation();
    const token_id = new URLSearchParams(location.search).get('token_id');
    const swapId = new URLSearchParams(location.search).get('swapId');
    const token_address = new URLSearchParams(location.search).get('nftAddress')

    console.log(selectedNFTs, "selected")

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);  
        console.log('', searchParams.toString());

        const senderNFTImageParam = searchParams.get('senderNFTImage');
        const nftImageParam = searchParams.get('nftImage');
        if (senderNFTImageParam) {
            setSenderNFTImage(senderNFTImageParam);
            console.log(senderNFTImageParam, "ddd")
        }
        if (nftImageParam) {
            setnftImage(nftImageParam)
            console.log(nftImageParam, "nftImage")
        }
    }, [location]);

    useEffect(() => {
        if (swapId) {
            setSwappingId(swapId);
        }
    }, [swapId]);


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const tokenIds = selectedNFTs.map((nft: { token_id: number[]; }) => nft.token_id).join(',');
        const tokenAddresses = selectedNFTs.map((nft: { token_address: String[]; }) => nft.token_address).join(',');    
        CreateSwap(swappingId, tokenAddresses, tokenIds, nftPrice);
    };

    const CreateSwap = async (
        swapId: any,
        tokenAddresses: string,
        tokenIds: string,
        nftPrice: any,
    ) => {
        const approval = await contractNft.approve(nftSwapAddress, tokenIds);
        approval
            .wait()
            .then(async () => {
                const create = await contract.setRecipientNFT(swapId, [tokenAddresses], [tokenIds], [nftPrice]);
                toast.success('Transaction Successful!');
                return create;
            })
            .catch((error: any) => {
                console.error('Approve transaction failed:', error);
                toast.error('Transaction failed!');
                throw new Error('Approve transaction failed');
            });
    };

    return (
        <>
            <div className="text-center mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center align-items-center">
                        <ul>
                            <div className='card mx-auto ' style={{ width: "32rem" }}>
                                <div className='card-body d-flex justify-content-between'>
                                    {senderNFTImage && <img className='nft-img' src={senderNFTImage} alt="Sender NFT" />}
                                    <span className="swap-icon">&#8644;</span>
                                    {nftImage && <img className='nft-img' src={nftImage} alt="NFT" />}
                                </div>
                            </div>
                        </ul>
                    </div>
                    <label className="form-label text-white">
                        NFT Price:
                        <input
                            type="text"
                            className="form-control mt-3 ms-2"
                            value={nftPrice}
                            onChange={(e) => setNftPrice(e.target.value)}
                        />
                    </label>
                    <br />
                    <button className="cnt-btn mt-4">Request Swap</button>
                </form>
                <ToastContainer />
            </div>
        </>
    );
};

export default CreateSwap;
