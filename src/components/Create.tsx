import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SelectedNFTsContext } from "../Helpers/SelectedNFTsContext";

interface Props {
  contract: any;
  signer: any;
  contractNft: any;
  nftSwapAddress: any;
}

const Create = ({ contract, contractNft, nftSwapAddress }: Props) => {
  const [senderNFTId, setSenderNFTId] = useState("");
  const [selectedNFTs] = useContext(SelectedNFTsContext);
  const [nftAddress, setNftAddress] = useState("");
  const [endTimeOfSwapping, setEndTimeOfSwapping] = useState<Date | null>(null);
  const [nftPrice, setNftPrice] = useState<string>("");
  const location = useLocation();
  const token_id = new URLSearchParams(location.search).get("token_id");
  const token_address = new URLSearchParams(location.search).get("nftAddress");

  // console.log(selectedNFTs); // Check the selectedNFTs object to ensure you're receiving the expected data

  const tokenIds = selectedNFTs
    .map((nft: { token_id: number[] }) => nft.token_id)
    .join(",");
  const tokenAddresses = selectedNFTs
    .map((nft: { token_address: String[] }) => nft.token_address)
    .join(",");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (selectedNFTs.length === 1) {
        const nft = selectedNFTs[0];
        const token_address = nft.token_address;
        const token_id = nft.token_id;

        await initiateSwap(
          token_address,
          nftPrice,
          token_id,
          endTimeOfSwapping,
          0
        );
      } else {
        for (let i = 0; i < selectedNFTs.length; i++) {
          const nft = selectedNFTs[i];
          const token_address = nft.token_address;
          const token_id = nft.token_id;

          await initiateSwap(
            token_address,
            nftPrice,
            token_id,
            endTimeOfSwapping,
            i
          );
        }
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed!");
      // Handle the error accordingly
    }
  };

  const initiateSwap = async (
    token_address: string,
    nftPrice: string,
    token_id: string,
    endTimeOfSwapping: Date | null,
    index: number
  ) => {
    try {
      const approval = await contractNft.approve(nftSwapAddress, token_id);
      const fees = await contract.getFees();
      const feesValue = fees.toString();

      await approval.wait();

      const formattedEndTime = endTimeOfSwapping
        ? Math.floor(endTimeOfSwapping.getTime() / 1000).toString()
        : null;

      const create = await contract.initiateSwap(
        [token_address],
        [nftPrice],
        [token_id],
        formattedEndTime,
        { value: feesValue }
      );

      toast.success("Transaction Successful!");
      return create;
    } catch (error) {
      console.error("Approve transaction failed:", error);
      toast.error("Transaction failed!");
      throw new Error("Approve transaction failed");
    }
  };

  return (
    <div className="text-center mt-5">
      <form onSubmit={handleSubmit}>
        {/* <label className="form-label">
                    Address:
                    <input
                        type="text"
                        className="form-control ms-2"
                        value={nftAddress}
                        onChange={(e) => setNftAddress(e.target.value)}
                    />
                </label>
                <br />
                <label className="form-label">
                    Your NFT ID:
                    <input
                        type="text"
                        className="form-control ms-2"
                        value={senderNFTId}
                        onChange={(e) => setSenderNFTId(e.target.value)}
                    />
                </label>
                <br /> */}
        <label className="form-label">
          NFT Price:
          <input
            type="text"
            className="form-control mt-3 ms-2"
            value={nftPrice}
            onChange={(e) => setNftPrice(e.target.value)}
          />
        </label>
        <br />
        <label className="form-label">
          End time of swapping:
          <DatePicker
            className="form-control mt-3 ms-2"
            selected={endTimeOfSwapping}
            onChange={(date) => setEndTimeOfSwapping(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Select end time"
          />
        </label>
        <br />
        <button className="cnt-btn mt-4">Initiate swap</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Create;
