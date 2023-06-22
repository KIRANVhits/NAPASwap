import { useEffect, useState, useContext } from 'react';
import { getNapaNFTOfUser, runMoralis } from '../Helpers/nftHelpers';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SelectedNFTsContext } from '../Helpers/SelectedNFTsContext';

interface Data {
  currentAccount: string;
}

const NFTs = ({ currentAccount }: Data) => {
  const [nfts, setNfts] = useState<any[]>();
  const [flag, setFlag] = useState(false);
  const [selectedNFTs, setSelectedNFTs] = useContext(SelectedNFTsContext);
  const location = useLocation();
  const navigate = useNavigate();


  const fetchNFTs = async () => {
    if (!flag) {
      runMoralis();
      setFlag(true);
    }
    const nftData = await getNapaNFTOfUser(currentAccount);
    
    console.log(await nftData, 'NFTdata');
    const filteredNfts = nftData?.filter((nft) => nft.token_uri);
    const promises = filteredNfts?.map(async (nft: any) => {
      const IPFsUrl = `https://${nft.token_uri.split('://')[1]}`;
      const response = await fetch(IPFsUrl);
      const metadata = await response.json();
      console.log(metadata, 'metadata');
      return {
        token_id: nft.token_id,
        name: metadata.name,
        image: metadata.image,
        description: metadata.description,
        token_address: nft.token_address,
      };
    });
    Promise.all(promises || []).then((data) => {
      setNfts(data);
    });
  };

  useEffect(() => {
    if (currentAccount) {
      fetchNFTs();
    }
  }, [currentAccount]);

  const handleSelectNFT = (nft: any) => {
    const isSelected = selectedNFTs.some((selectedNFT: { token_id: any; }) => selectedNFT.token_id === nft.token_id);
    if (isSelected) {
      setSelectedNFTs(selectedNFTs.filter((selectedNFT: { token_id: any; }) => selectedNFT.token_id !== nft.token_id));
    } else {
      setSelectedNFTs([...selectedNFTs, nft]);
    }
  };

  const handleNextClick = () => {
    const queryParam = location.search;
    if (queryParam && selectedNFTs.length > 0) {
      const swapIds = new URLSearchParams(queryParam).get('swapId');
      const senderNFTImage = new URLSearchParams(queryParam).get('senderNFTImage');
      const nftIds = selectedNFTs.map((nft: { token_id: string[] }) => nft.token_id[selectedNFTs]).join(',');
      const nftAddresses = selectedNFTs.map((nft: { token_address: string[] }) => nft.token_address).join(',');

      const queryParams = new URLSearchParams({
        token_id: nftIds,
        nftAddress: nftAddresses,
        swapId: swapIds || '',
        senderNFTImage: senderNFTImage || '',
      });

      if (swapIds && senderNFTImage) {
        // If swapId and senderNFTImage are present, navigate to CreateSwap component
        selectedNFTs.forEach((nft: { image: string }) => {
          queryParams.append('nftImage', nft.image);
        });
        navigate(`/CreateSwap?${queryParams.toString()}`);
      } else {
        // Otherwise, navigate to Create component
        navigate(`/Create?${queryParams.toString()}`);
      }
    }
  };

  return (
    <>
      <div className='mt-4'>
        <ul>
          <div className="nft-show">
            {nfts?.map((nft: any, index: number) => (
              <div key={index} className="nft-item">
                <div className="card-body d-flex justify-content-between align-items-center ">
                  <img className="nft-img" src={nft.image} alt={nft.name} />
                </div>
                <button className="choose-btn mt-2" onClick={() => handleSelectNFT(nft)}>Choose</button>

              </div>
            ))}
          </div>
        </ul>
      </div>
      {selectedNFTs.length > 0 && (
        <button className="cnt-btn mt-2" onClick={handleNextClick}>
          <Link
            to={
              location.search
                ? `/CreateSwap?token_id=${selectedNFTs.token_id}&swapId=${new URLSearchParams(location.search).get('swapId')}&nftImage=${selectedNFTs.image}&senderNFTImage=${new URLSearchParams(location.search).get('senderNFTImage')}&nftAddress=${selectedNFTs.token_address}`
                : `/Create?token_id=${selectedNFTs.token_id}&nftAddress=${selectedNFTs.token_address}`
            }
            className="text-black text"
          >
            Next
          </Link>
        </button>
      )}
    </>
  );
};

export default NFTs;
