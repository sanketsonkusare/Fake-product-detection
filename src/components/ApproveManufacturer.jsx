import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import { Loading } from './Loader';
import { contractABI, contractAddress } from '../lib';

const ApproveManufacturer = () => {
    const [isLoading, setIsLoading] = useState(false)

    const getManufacturers = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const FPDetectionContract = new ethers.Contract(contractAddress, contractABI, signer);
                const man_record = await FPDetectionContract.createManufacturer(
                    manufacturer.man_name,
                    manufacturer.website,
                    manufacturer.wallet_address,
                    { gasLimit: 3000000 })
                const receipt = await man_record.wait()
                const data = receipt.logs[0].data
                const [man_name, man_address] = ethers.utils.defaultAbiCoder.decode(
                    ['string', 'address'], data
                )
                console.log(man_name)
                console.log(man_address)
                setIsLoading(false)
                setManufacturer({ man_name: '', website: '', wallet_address: '' })
            } else {
                setIsLoading(false)
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }


    useEffect(() => {
        setIsLoading(true)
        getManufacturers()
    }, [])
    return (
        <>
            {isLoading && <Loading />}

            <div className="border-2 border-gray-200 rounded-lg h-auto bg-white">
                <div class="font-sans p-4 text-black w-full  justify-center">
                    <h3 className="text-xl p-2 mb-3 text-gray-800 font-bold">
                        Approve New Manufacturer
                    </h3>
                    <div class="w-full px-4 py-2 mx-auto">

                    </div>
                </div>
            </div>
        </>
    )
}

export default ApproveManufacturer