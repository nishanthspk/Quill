import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Ensure to import the CSS for Skeleton
import Assets from './Assets';
import Status from './Evaluate/Status';
import Report from './Evaluate/Report';
import Info from './Evaluate/Info';
import axios from 'axios';

const EvaluateReport = ({ onBackClick, selectedToken, tokenAddress, chainId }) => {
  const [valueFetch, setValueFetch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [owner, setOwner] = useState('')
  const [ercerror, setErcerror] = useState(false)

  const calculateAge = (dateString) => {
    // Split the input date string into day, month, and year
    if (ercerror) {
      return
    }
    const [day, month, year] = dateString.split('/').map(Number);

    // Create a Date object from the given date
    const birthDate = new Date(year, month - 1, day); // month - 1 because months are zero-indexed in JavaScript

    // Get the current date
    const today = new Date();

    // Calculate the age
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if the birthday hasn't occurred yet this year
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const fetchTokenInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://check-api.quillai.network/api/v1/tokens/ui/information/${tokenAddress}?chainId=${chainId}&distinctId=$device:1921f267d7f65c-06d6ddb090976-1a525637-122897-1921f267d7f65c&generateGptInput=true&generateChecksDescription=true`,
        {
          headers: {
            'x-api-key': '6muNpTyDvR9hGJBuG1muh5VlKE74V6Ik4cWNBmg0',
          },
        }
      );

      console.log(res, "res");
      if (res.status === 200) {
        const data = await res.json();

        setValueFetch(data);
        console.log('====================================');
        console.log(data);
        if (data.errorStatus === 420) {
          setErcerror(true)
        }
        setOwner(data?.tokenInformation?.generalInformation?.ownerAddress)
        console.log('====================================');
      }

    } catch (error) {
      setError('Failed to fetch token information');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  useEffect(() => {
    if (tokenAddress) {
      fetchTokenInfo();
    }
  }, [tokenAddress, chainId]);

  const tokenImages = {
    ETH: Assets.ETH,
    BSC: Assets.BSC,
    Polygon: Assets.Polygon,
    Base: Assets.Base,
  };

  const totalScore = !ercerror && parseFloat(valueFetch?.honeypotDetails?.overAllScorePercentage);
  const tokenCreationDate = !ercerror && valueFetch?.tokenInformation?.generalInformation?.tokenCreationDate;

  console.log("token creation date", !ercerror && tokenCreationDate);
  console.log("token creation date in real", !ercerror && valueFetch?.tokenInformation?.generalInformation?.tokenCreationDate);
  const currentDate = new Date();

  let buyTax = 0;
  let sellTax = 0;
  let transferTax = 0;



  if (valueFetch?.honeypotDetails?.length > 0) {
    const details = valueFetch.honeypotDetails[0];
    buyTax = parseFloat(details?.buyTax?.number || "0");
    sellTax = parseFloat(details?.sellTax?.number || "0");
    transferTax = parseFloat(details?.transferTax?.number || "0");
  }

  let tokenAge = 'Unknown';
  if (valueFetch) {

    const ageInMilliseconds = currentDate - tokenCreationDate;
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    // tokenAge = `${Math.floor(ageInYears)} years`;
    tokenAge = calculateAge(tokenCreationDate)
    console.log("total age", tokenAge);

  }

  const criticalPoint = !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount[0].count || 0;
  console.log("fgxhgdf", !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount[0]);
  console.log("fgxdthtdhdfghghgdf", !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount[0].count);

  const riskyPoint = !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "RISKY")?.count || 0;
  const mediumPoint = !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "Medium Risk")?.count || 0;
  const neutralPoint = !ercerror && valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "Neutral")?.count || 0;

  console.log(criticalPoint, riskyPoint, mediumPoint, neutralPoint);

  const holdersCount = parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.holdersDescription?.holdersCount?.number);
  const currentLiquidity = parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.totalLpSupplyInUsd?.number);
  const lpHolders = parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.lpHolderCount?.number);
  const pairs = parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.pairByPairInformation[0]?.numberOfPairs);

  const critical = !ercerror && valueFetch?.riskCategories?.critical || 0;
  const risky = !ercerror && valueFetch?.riskCategories?.risky || 0;
  const medium = !ercerror && valueFetch?.riskCategories?.medium || 0;
  const neutral = !ercerror && valueFetch?.riskCategories?.neutral || 0;



  // Honeypot status message
  const honeypotStatus = !ercerror && valueFetch?.honeypotDetails?.isTokenHoneypot === 1 ? "Honeypot" : "Not a Honeypot";

  return (
    <div
      className="bg-[#18162099]/60 rounded-[10px] backdrop-filter h-[90%] backdrop-blur-sm w-[460px] mx-auto jost text-white"
      style={{ boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.5)' }}
    >
      {
        !ercerror && <> <div className="bg-[#181B2E] rounded-t-[10px] p-[5px] px-[20px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Skeleton for Avatar and Token Name */}
              {loading ? (
                <>
                  <Skeleton circle={true} height={20} width={20} />
                  <Skeleton width={100} height={20} />
                  <Skeleton width={50} height={15} />
                </>
              ) : (
                <>
                  <img className='h-5' src={valueFetch?.tokenInformation?.generalInformation?.tokenImageLink || tokenImages[selectedToken]} alt="Avatar" />
                  <p className="text-lg text-center">{valueFetch?.tokenInformation?.generalInformation?.tokenName || 'Token Name'}</p>
                  <p className='text-xs'>({valueFetch?.tokenInformation?.generalInformation.tokenSymbol || 'Symbol'})</p>
                </>
              )}
            </div>

            <div className="flex rounded-[20px]">
              {loading ? (
                <Skeleton height={30} width={80} />
              ) : (

                <div className='border p-1 rounded'>
                  <img onClick={onBackClick} src={"https://cdn.iconscout.com/icon/premium/png-256-thumb/back-arrow-9601866-8212676.png?f=webp&w=256"} className='w-5 h-5' alt="" />
                </div>
              )}
            </div>
          </div>

          {/* Token Address */}
          <p className='text-xs text-white flex items-center'>
            {loading ? (
              <Skeleton width={250} />
            ) : (
              selectedToken && (
                <span className="mr-2 bg-black p-[6px] px-4 rounded-[5px] text-sm flex gap-1 items-center">
                  {tokenImages[selectedToken] && (
                    <img src={tokenImages[selectedToken]} alt={selectedToken} className="h-3" />
                  )}
                  {selectedToken}
                </span>
              )
            )}
            {loading ? <Skeleton width={200} /> : (tokenAddress || 'Enter Token Address')}
          </p>
        </div>

          <div className="px-[20px] pt-[20px] pb-[10px]">
            <div className="flex items-center justify-between h-full">
              {/* Status and Report */}
              {loading ? (
                <>
                  <Skeleton width={100} height={100} />
                  <Skeleton width={200} height={100} />
                </>
              ) : (
                <>
                  <Status totalScore={totalScore} tokenAge={tokenAge} honeypotStatus={honeypotStatus} owner={owner} />
                  <div className="border-l-2 border-white/10 mx-5 self-stretch"></div>
                  <Report critical={criticalPoint} risky={riskyPoint} medium={mediumPoint} neutral={neutralPoint} />
                </>
              )}
            </div>

            <div className="border-b-2 border-white/10 my-1 self-stretch"></div>

            {/* Info Section */}
            {loading ? (
              <Skeleton width={400} height={60} />
            ) : (
              <Info
                holdersCount={formatNumber(holdersCount)}
                currentLiquidity={currentLiquidity}
                lpHolders={lpHolders}
                buyTax={buyTax}
                sellTax={sellTax}
                transferTax={transferTax}
                pairs={pairs}
              />
            )}

            {/* Honeypot Status Display */}
            {/* <div className="text-center text-lg mt-2">
        {loading ? <Skeleton width={200} height={30} /> : <p>{honeypotStatus}</p>}
      </div> */}
          </div>
        </>
      }

      {
        ercerror && <div className='m-5 flex flex-col justify-center items-center py-3 pt-4'>  <p className=' text-3xl  flex gap-4  '> <img src={
          "https://check.quillai.network/icons/X.svg"} className='w-7 ' alt='x' /> ERC-20 contract not be found at the given address </p> <br />
          <div className='flex justify-center items-center px-5 ' >
            Please confirm the contract is ERC-20 and on the correct chain.



          </div><div >
            <button className='underline' onClick={onBackClick}>Go back</button>
          </div>

        </div>
      }
    </div>
  );
};

export default EvaluateReport;
