import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

type SwapData = {
  sender: string;
  recipient: string;
  senderNftAddress: string;
  recipientNftAddress: string[];
  senderNFTId: number;
  recipientNFTId: number[];
  senderPrice: string;
  recipientPrice: string;
  startTime: number;
  endTime: number;
  active: boolean;
  swapComplete: boolean;
  senderNFTURI?: string;
  recipientNFTURI?: string;
  senderNFTImage?: any;
  recipientNFTImage?: string;
};

interface Data {
  contract: any;
  signer: any;
  contractNft: any;
  currentAccount: string;
}

const Swaps = ({ contract, signer, contractNft, currentAccount }: Data) => {
  const [swapDetails, setSwapDetails] = useState<SwapData[]>([]);
  const [swapIds, setSwapIds] = useState<number[]>([]);
  const [showAllSwaps, setShowAllSwaps] = useState<boolean>(false);

  const handleCancleSwap = async (event: any, swapId: number) => {
    event.preventDefault();
    forCancelSwap(swapIds[swapId - 1]);
  };

  const handleConfirmSwap = async (event: any, swapId: number) => {
    event.preventDefault();
    forCompleteSwap(swapIds[swapId - 1]);
  };

  const handleClaimBack = async (event: any, swapId: number) => {
    event.preventDefault();
    forCancelandClaim(swapIds[swapId - 1]);
  };

  const getSwapImage = async (tokenURI: string) => {
    try {
      const response = await axios.get(tokenURI);
      return response.data.image;
    } catch (error) {
      console.log("Error fetching NFT image:", error);
      return null;
    }
  };

  const fetchAllSwaps = async () => {
    const allSwaps = await contract.getAllSwaps();
    const latestSwapId = allSwaps.length;
    const swapIdsArr: number[] = [];

    const swapDetails = await Promise.all(
      allSwaps.map(
        async (
          swap: {
            senderNFTId: { toString: () => any };
            recipientNFTId: number[];
            recipientNftAddress: string[];
          },
          index: number
        ) => {
          try {
            const senderNFTURI = await contractNft.tokenURI(
              swap.senderNFTId.toString()
            );
            const senderNFTImage = await getSwapImage(senderNFTURI);

            const senderNFTImageResponse = await axios.get(
              senderNFTURI.toString()
            );

            let recipientNFTURI = "";
            let recipientNFTImage = "";

            if (swap.recipientNFTId.length !== 0) {
              recipientNFTURI = await contractNft.tokenURI(
                swap.recipientNFTId.toString()
              );
              recipientNFTImage = await getSwapImage(recipientNFTURI);
            }
            const recipientNFTImageResponse = await axios.get(
              recipientNFTURI.toString()
            );

            for (let i = swapIdsArr.length + 1; i <= latestSwapId; i++) {
              swapIdsArr.push(i);
            }
            return {
              ...swap,
              senderNFTURI,
              recipientNFTURI,
              senderNFTImage: senderNFTImageResponse.data.image,
              recipientNFTImage: recipientNFTImageResponse.data.image,
            };
          } catch (error) {
            console.log("error while fetching URI", error);
            return null;
          }
        }
      )
    );

    const filteredSwapDetails = swapDetails.filter(
      (swap) => swap !== null && swap.active === true
    );

    setSwapDetails(filteredSwapDetails);
    setSwapIds(swapIdsArr);
  };

  useEffect(() => {
    fetchAllSwaps();
  }, []);

  const fetchSwapsByWalletAddress = async (currentAccount: string) => {
    const userSwaps = await contract.getSwapsByWalletAddress(currentAccount);
    const swapIdsArr: number[] = [];

    const swapDetails = await Promise.all(
      userSwaps.map(
        async (
          swap: {
            senderNFTId: { toString: () => any };
            recipientNFTId: number[];
          },
          index: number
        ) => {
          try {
            const senderNFTURI = await contractNft.tokenURI(
              swap.senderNFTId.toString()
            );
            const senderNFTImage = await getSwapImage(senderNFTURI);

            const senderNFTImageResponse = await axios.get(
              senderNFTURI.toString()
            );

            let recipientNFTURI = "";
            let recipientNFTImage = "";

            if (swap.recipientNFTId.length !== 0) {
              recipientNFTURI = await contractNft.tokenURI(
                swap.recipientNFTId.toString()
              );
              recipientNFTImage = await getSwapImage(recipientNFTURI);
            }
            const recipientNFTImageResponse = await axios.get(
              recipientNFTURI.toString()
            );

            return {
              ...swap,
              senderNFTURI,
              recipientNFTURI,
              senderNFTImage: senderNFTImageResponse.data.image,
              recipientNFTImage: recipientNFTImageResponse.data.image,
            };
          } catch (error) {
            console.log("error while fetching URI", error);
            return null;
          }
        }
      )
    );

    const filteredSwapDetails = swapDetails.filter(
      (swap) => swap !== null && swap.active === true
    );

    setSwapDetails(filteredSwapDetails);
    setSwapIds(swapIdsArr);
  };

  const forCancelSwap = async (swapIds: any) => {
    try {
      return await contract.rejectSwap(swapIds);
    } catch (error) {
      toast.error("Error:You're not a Swap Initiator ");
    }
  };

  const forCompleteSwap = async (swapIds: any) => {
    try {
      return await contract.completeSwap(swapIds);
    } catch (error) {
      toast.error("Error: You're not a Swap Initiator");
    }
  };

  const forCancelandClaim = async (swapIds: any) => {
    try {
      return await contract.cancelSwapAndClaimNFTBack(swapIds);
    } catch (error) {
      toast.error(
        "Error:You're neither an Initiator nor a receiver for this swap "
      );
    }
  };

  const handleAllSwapsClick = () => {
    setShowAllSwaps(true);
    fetchAllSwaps();
  };

  const handleMySwapsClick = () => {
    setShowAllSwaps(false);
    fetchSwapsByWalletAddress(currentAccount);
  };

  return (
    <>
      <div className="filter-buttons mt-3">
        <button onClick={handleAllSwapsClick}>All Swaps</button>
        <button onClick={handleMySwapsClick}>My Swaps</button>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button className="cnt-btn">
          <Link to="/NFTs" className="text-black text">
            Create offer
          </Link>
        </button>
      </div>
      <div className="swap-list">
        {swapDetails.map((swap, index) => (
          <div key={index} className="swap-item">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div
                style={{ width: "200px", height: "200px", marginRight: "5px" }}
              >
                {/* <p className="card-text">ID: {swapIds[index]}</p> */}
                {swap.senderNFTImage && (
                  <img
                    className="nft-img rounded"
                    src={swap.senderNFTImage}
                    alt="Sender NFT"
                  />
                )}
              </div>
              <div
                style={{ width: "200px", height: "200px", marginRight: "5px" }}
              >
                {swap.recipientNFTId.length !== 0 && swap.recipientNFTImage ? (
                  <img
                    className="nft-img rounded"
                    src={swap.recipientNFTImage}
                    alt="Recipient NFT"
                  />
                ) : (
                  <div className="blank-image-box rounded">
                    <p className="waiting-text">Waiting for swap</p>
                  </div>
                )}
              </div>
              {swap.senderNFTId !== 0 && swap.recipientNFTId.length !== 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "14px",
                  }}
                >
                  <button
                    className="cmplt-btn text-white"
                    onClick={(event) =>
                      handleConfirmSwap(event, swapIds[index])
                    }
                  >
                    Accept & Complete
                  </button>
                  <button
                    className="rjct-btn text-white"
                    onClick={(event) => handleCancleSwap(event, swapIds[index])}
                  >
                    Reject
                  </button>
                  <button
                    className="ccb-btn text-white"
                    onClick={(event) => handleClaimBack(event, swapIds[index])}
                  >
                    Cancel & Claim Back
                  </button>
                </div>
              ) : (
                swap.senderNFTId !== 0 && (
                  <button className="cs-btn mt-4">
                    <Link
                      to={`/NFTs?swapId=${
                        swapIds[index]
                      }&senderNFTImage=${encodeURIComponent(
                        swap.senderNFTImage
                      )}`}
                      className="text-white text"
                      onClick={() => console.log(swapIds[index])}
                    >
                      Create Swap
                    </Link>
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </>
  );
};

export default Swaps;
