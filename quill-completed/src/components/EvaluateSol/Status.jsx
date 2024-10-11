import React from 'react'
import Assets from '../Assets'

const Status = ({ holdersCount, currentLiquidity, lockedLiquidity, pairs }) => {
  return (
    <div className=' space-y-2'>
        <div className="">
            <p>Holders</p>
            <p className=' text-lg font-bold flex items-center gap-1'><img className=' h-4' src={Assets.Exclamatory} ></img> {holdersCount}</p>
        </div>
        <div className="">
            <p>Current Liquidity</p>
            <p className=' text-lg font-bold flex items-center gap-1'><img className=' h-4' src={Assets.Shield} ></img> ${currentLiquidity}</p>
        </div>
        <div className="">
            <p>Locked Liquidity</p>
            <p className=' text-lg font-bold flex items-center gap-1'><img className=' h-4' src={Assets.Shield} ></img> {lockedLiquidity}</p>
        </div>
        <div className="">
            <p>Trading Pairs</p>
            <p className=' text-lg font-bold flex items-center gap-1'><img className=' h-4' src={Assets.Caution} ></img> {pairs}</p>
        </div>
    </div>
  )
}

export default Status