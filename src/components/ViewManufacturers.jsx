import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import { contractABI, contractAddress } from '../lib';
import { Loader } from './Loader';

const ViewManufacturers = () => {
    const [manDetails, setManDetails] = useState('')
    const [manAddress, setManAddress] = useState('')
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
            alert(error);
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
            alert(error);
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


                <div className="border rounded w-full overflow-hidden flex">
                    <div>
                        {manufacturers.map((man) => (
                            <div key={man} >
                                {man}
                            </div>
                        ))}
                    </div>
                    <div>
                        {manDetails !== "" &&
                            <div>
                                {manDetails.website}
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