import { useState } from "react";
import { File } from "../calls";
import { formatDate, formatFileSize, getFileTypeInfo } from "../utils";
import { ChevronDownIcon, ChevronRightIcon, ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import deployedContracts from "../../../contracts/deployedContracts";
import { useAccount } from "wagmi";

interface FilePreviewProps {
  file: File;
  bucketName: string;
  isOpen: boolean;
  onToggle: () => void;
  isBuy: boolean;
}

export const FilePreview = ({ file, bucketName, isOpen, onToggle, isBuy }: FilePreviewProps) => {
  const { address: connectedAddress } = useAccount();
  const contractAddress = deployedContracts[78963].Gateway.address;
  const contractABI = deployedContracts[78963].Gateway.abi;
  const [showCopied, setShowCopied] = useState(false);
  const fileInfo = getFileTypeInfo(file.Name);
  const fileUrl = `http://localhost:8000/buckets/${bucketName}/files/${file.Name}/download`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(fileUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000); // Hide after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    console.log(connectedAddress);
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to download files!");
        return;
      }

      const provider = new ethers.JsonRpcProvider(
        "https://node1-asia.ava.akave.ai/ext/bc/tLqcnkJkZ1DgyLyWmborZK9d7NmMj6YCzCFmf9d9oQEd2fHon/rpc",
      );
      // const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const isEligible = await contract.isVerified(connectedAddress, file.RootCID);

      if (isEligible) {
        e.stopPropagation();
        window.location.href = fileUrl;
      } else {
        alert("You are not eligible to download this file. Please purchase access first.");
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      alert("Error checking download eligibility. Please try again.");
    }
  };

  const handleBuy = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to purchase access!");
        return;
      }

      // Switch to Akave network
      // const chainId = "0x134A3" // 78963 in hex
      // try {
      //   await window.ethereum.request({
      //     method: 'wallet_switchEthereumChain',
      //     params: [{ chainId }],
      //   });
      // } catch (switchError: any) {
      //   if (switchError.code === 4902) {
      //     try {
      //       await window.ethereum.request({
      //         method: 'wallet_addEthereumChain',
      //         params: [{
      //           chainId,
      //           chainName: 'Akave Network',
      //           rpcUrls: ['https://node1-asia.ava.akave.ai/ext/bc/tLqcnkJkZ1DgyLyWmborZK9d7NmMj6YCzCFmf9d9oQEd2fHon/rpc'],
      //           nativeCurrency: {
      //             name: 'AKAVE',
      //             symbol: 'AKAVE',
      //             decimals: 18
      //           },
      //         }],
      //       });
      //     } catch (addError) {
      //       throw addError;
      //     }
      //   }
      //   throw switchError;
      // }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Assuming the contract has a purchaseAccess function that requires payment
      const price = ethers.parseEther("0.25");
      const tx = await contract.payForAccess(connectedAddress, file.RootCID, { value: price });

      // Wait for transaction to be mined
      await tx.wait();

      alert("Successfully purchased access to the file!");
    } catch (error) {
      console.error("Error purchasing access:", error);
      console.log("Error purchasing access. Please try again.");
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-none hover:bg-gray-50">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 cursor-pointer" onClick={onToggle}>
          <div className="w-6">
            {isOpen ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            )}
          </div>
          <span className="text-xl">{fileInfo.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{file.Name}</div>
            <div className="text-xs text-gray-500">
              {formatFileSize(file.Size)} • {formatDate(file.CreatedAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {
            isBuy && (
              <button
                onClick={handleBuy}
                className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-black btn-sm"
                title="Buy file"
              >
                Buy
              </button>
            )}
          <button
            onClick={handleShare}
            className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-black btn-sm"
            title="Copy download link"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
          {showCopied && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded shadow-lg">
              Copied!
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-x-4 border-x-transparent border-t-4 border-t-black"></div>
              </div>
            </div>
          )}

          <button
            onClick={handleDownload}
            className="btn bg-black hover:bg-gray-800 text-white border-2 border-black btn-sm"
            title="Download file"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-4">
          {/* <DocEndpoint
            endpoint={`/buckets/[bucketName]/files/[fileName]/download`}
            method="GET"
            implementationFile="/api/akave/bucket/[bucketName]/files/[fileName]/route.ts"
            description="Download a file from the specified bucket"
            docsUrl="https://hackathon-docs.akave.ai/js-docker-example-code#id-4.-download-a-file"
          /> */}
          <div className="grid gap-2 text-sm bg-white p-4 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Created:</span>
              <span className="text-gray-700">{formatDate(file.CreatedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Size:</span>
              <span className="text-gray-700">{formatFileSize(file.Size)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <span className="font-medium text-gray-900">CID:</span>
              <span className="ml-2 font-mono text-xs text-gray-600 break-all">{file.RootCID}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
