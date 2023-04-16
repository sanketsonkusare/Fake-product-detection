import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import { Loader } from './Loader';
import OwnerHistory from './OwnerHistory';
import { contractABI, contractAddress, options } from '../lib';

const CheckProductByQR = () => {
    const queryParameters = new URLSearchParams(window.location.search)
    const id = queryParameters.get("id")
    console.log(id)
    const [productDetail, setProductDetail] = useState('')
    const [productID, setProductID] = useState(id)
    const [isLoading, setIsLoading] = useState(false)

    const getManufacturer = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                setProductDetail('')
                setIsLoading(true)
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const FPDetectionContract = new ethers.Contract(contractAddress, contractABI, signer);
                const productInfo = await FPDetectionContract.getProduct(productID)
                console.log(productInfo)
                const productInfoCleaned =
                {
                    id: productInfo.id.toNumber(),
                    name: productInfo.name,
                    model: productInfo.model,
                    manufacturer: productInfo.manufacturer,
                    initialPrice: productInfo.price.toNumber(),
                    exists: productInfo.exists,
                    curOwner: productInfo.curOwner,
                    manufacturedTimestamp: new Date(productInfo.manufacturedTimestamp.toNumber() * 1000),
                    owners: productInfo.owners.map((owner) => {
                        return {
                            owner: owner.curOwner,
                            timestamp: new Date(owner.curTimestamp.toNumber() * 1000)
                        }
                    })
                }
                setProductDetail(productInfoCleaned)
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
        setIsLoading(true)
        setProductDetail('')
        getManufacturer()
    }, [])

    useEffect(() => {
        setProductDetail(productDetail)
    }, [productDetail])
    return (
        <div className="rounded-lg mb-4 h-auto bg-gray-600" id="detectProduct">
            <div class="font-sans p-4 text-white w-full justify-center">
                <h3 className="text-xl mb-3 font-bold">
                    Check the Product
                </h3>

                {isLoading && <div className='mx-auto py-6 flex justify-center'><Loader /></div>}

                {productDetail && <div class="justify-center text-center">
                    {productDetail.exists ? <> <ul class="bg-gray-600 grid h-auto mt-4 content-center w-full text-gray-200">
                        <li class="px-6 py-2  w-full"><b>Product ID:</b> {productDetail.id}</li>
                        <li class="px-6 py-2  w-full"><b>Product Name:</b> {productDetail.name}</li>
                        <li class="px-6 py-2  w-full"><b>Product Model:</b> {productDetail.model}</li>
                        <li class="px-6 py-2  w-full"><b>Initial Price:</b> {productDetail.initialPrice}</li>
                        <li class="px-6 py-2  w-full"><b>Manufacturer:</b> {productDetail.manufacturer}</li>
                        <li class="px-6 py-2  w-full"><b>Current Owner:</b> {productDetail.curOwner}</li>
                        <li class="px-6 py-2  w-full"><b>Manufactured Time Stamp:</b> {productDetail.manufacturedTimestamp.toLocaleString("en-US", options)}</li>

                    </ul>
                        {productDetail.owners && <OwnerHistory owners={productDetail.owners} />}
                    </>
                        :
                        <ul class="flex justify-center text-center bg-white mt-8 border border-gray-800 w-96 text-gray-900">
                            <li class="px-6 py-2  w-full bg-red-600 text-white">
                                Product Not Available
                            </li>
                        </ul>
                    }
                </div>}
            </div>
        </div>
    )
}

export default CheckProductByQR