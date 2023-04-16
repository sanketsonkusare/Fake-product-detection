import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import { contractABI, contractAddress } from '../lib';
import { Loader } from './Loader';

const ViewManufacturers = () => {
    const [manDetails, setManDetails] = useState('')

    const [manufacturers, setManufacturers] = useState([])
    const [lenError, setLenError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const getManufacturer = async (manAddress) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                setIsLoading(true)
                setManDetails('')
                setLenError(false)
                const address = ethers.utils.getAddress(manAddress)
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const FPDetectionContract = new ethers.Contract(contractAddress, contractABI, signer);
                const manDetail = await FPDetectionContract.getManufacture(address)
                setManDetails(manDetail)
                console.log(manDetail)
                setIsLoading(false)
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            setIsLoading(false)
            //alert(error);
        }
    }

    const getManufacturers = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                setIsLoading(true)
                setLenError(false)
                //const address = ethers.utils.getAddress(manAddress)
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const FPDetectionContract = new ethers.Contract(contractAddress, contractABI, signer);
                const manDetail = await FPDetectionContract.getAllManufacturers()
                setManufacturers(manDetail)
                console.log(manDetail)
                console.log("got the manufacturers")
                setIsLoading(false)
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const handleClick = async (manAddress, status) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                setIsLoading(true)
                setLenError(false)
                const address = ethers.utils.getAddress(manAddress)
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const FPDetectionContract = new ethers.Contract(contractAddress, contractABI, signer);
                const manDetail = await FPDetectionContract.approveManufacturer(address, status)
                alert("Manufacturer Status Change will be reflected in the next few seconds")
                console.log(manDetail)
                setIsLoading(false)

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }

    }

    useEffect(() => {
        getManufacturers()
    }, [])


    return (
        <div className="border-2 border-gray-200 rounded-lg h-96 bg-white" id="detectManufacturer">
            <div className="font-sans p-4 text-black w-full bg-white  justify-center">
                <h3 className="text-xl mb-3 font-bold">
                    View the Manufacturers
                </h3>

                <div className="rounded w-full overflow-hidden flex w-full">
                    <div className='w-1/2'>
                        {manufacturers.map((man) => (
                            <div key={man} onClick={() => getManufacturer(man)} className='curson-pointer'>
                                {man}
                            </div>
                        ))}
                    </div>
                    <div className='w-1/2'>
                        {manDetails !== "" &&
                            <div className='flex w-full flex-col'>
                                <div className='m-2 font-bold'>Showing details for {manDetails.wallet_address}</div>
                                <div className='flex w-full justify-between'>
                                    <div className='m-2 font-bold'>{manDetails.name}</div>
                                    <div className='m-2 font-bold'>{manDetails.website} </div>
                                    <button class="float-right h-10 px-5 w-fit text-indigo-100 bg-indigo-700 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-indigo-800" onClick={() => handleClick(manDetails.wallet_address, !manDetails.exists)}>
                                        {manDetails.exists ? "Disapprove" : "Approve"}
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {lenError && <p className='pl-2 text-red-400 font-thin '>Invalid wallet address</p>}
                {isLoading && <div className='mx-auto py-6 flex justify-center'><Loader /></div>}

            </div>
        </div>
    )
}

export default ViewManufacturers