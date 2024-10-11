import React from 'react';
import Assets from '../Assets';

const Status = ({ totalScore, tokenAge, honeypotStatus, owner }) => {
  // Function to determine the background color based on the totalScore
  const getBackgroundColor = (score) => {
    if (score < 14.28) return '#6A116A'; // 0-14.28%
    if (score < 28.56) return '#B40E00'; // 14.28-28.56%
    if (score < 42.84) return '#DE9600'; // 28.56-42.84%
    if (score < 57.12) return '#2CA3C0'; // 42.84-57.12%
    if (score < 71.4) return '#469B44'; // 57.12-71.4%
    if (score < 85.68) return '#37751D'; // 71.4-85.68%
    return '#2D5D17'; // 85.68-100%
  };

  const handleCopy = () => {
    if (owner) {
      navigator.clipboard.writeText(owner).then(() => {
        // alert('Address copied to clipboard!'); // Optional: you can show a message
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  }

  return (
    <div>
      <div className="flex gap-4 text-sm">
        <div className="space-y-3">
          <div className="">
            <p className='text-[#DDDDDD]'>Last Known Status:</p>
            <div className="bg-[#FFFFFF]/10 h-10 w-fit rounded-[8px] p-[10px] flex items-center gap-2">
              <img className=' h-6' src={Assets.Token} alt="" />
              <p>{honeypotStatus}</p>
            </div>
          </div>
          <div className="w-fit">
            <p className='text-[#DDDDDD]'>Token Age:</p>
            <p className='text-center'>{tokenAge} Years</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-fit">
            <p className='text-[#DDDDDD]'>Overall Score:</p>
            <div 
              className="h-10 w-full rounded-[8px] flex justify-center items-center mx-auto" 
              style={{ backgroundColor: getBackgroundColor(totalScore) }} // Set background color dynamically
            >
              <p className='text-base font-semibold'>{totalScore}%</p>
            </div>
          </div>
          <div className="w-fit cursor-pointer" onClick={handleCopy}>
            <p className='text-[#DDDDDD] ' >Ownership:</p>
            {owner !== '' && owner.slice(0, 5)} {owner !== '' && "..."} {owner !== '' && owner.slice(-5)} 
            {owner === '' && <img className='h-4 mx-auto' src={Assets.X} alt="X" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
