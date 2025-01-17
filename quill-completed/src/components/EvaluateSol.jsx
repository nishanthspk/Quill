import React, { useState, useEffect } from 'react';
import ScoreAndAge from './EvaluateSol/ScoreAndAge';
import Skeleton from 'react-loading-skeleton'; // Assuming you have this installed for skeleton loading
import Report from './EvaluateSol/Report';
import Status from './EvaluateSol/Status';
import Assets from './Assets';

const EvaluateSol = ({ onBackClick, tokenAddress, selectedToken }) => {
    const [loading, setLoading] = useState(false);
    const [valueFetch, setValueFetch] = useState(null);
    const [ercerror, setErcerror] = useState(false);
    const [error, setError] = useState(null);
    const [owner, setOwner] = useState('');

    const calculateAge = (dateString) => {
        if (ercerror) {
            return '-';
        }
        const [day, month, year] = dateString.split('/').map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatValue = (value) => {
        return isNaN(value) ? '-' : value;
    };

    const fetchTokenInfo = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://check-api.quillai.network/api/v1/tokens/solana/${tokenAddress}?distinctId=$device:1921f267d7f65c-06d6ddb090976-1a525637-122897-1921f267d7f65c&generateGptInput=true&generateChecksDescription=true`,
                {
                    headers: {
                        'x-api-key': '6muNpTyDvR9hGJBuG1muh5VlKE74V6Ik4cWNBmg0',
                    },
                }
            );

            if (res.status === 200) {
                const data = await res.json();
                setValueFetch(data);
                if (data.errorStatus === 420) {
                    setErcerror(true);
                } else {
                    setOwner(data?.tokenInformation?.generalInformation?.ownerAddress);
                }
            } else {
                setError('Failed to fetch token information');
            }
        } catch (error) {
            setError('Error fetching token information');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tokenAddress) {
            fetchTokenInfo();
        }
    }, [tokenAddress]);

    const totalScore = !ercerror ? formatValue(parseFloat(valueFetch?.honeypotDetails?.overAllScorePercentage)) : '-';
    const tokenCreationDate = !ercerror ? valueFetch?.tokenInformation?.generalInformation?.tokenCreationDate : null;
    const currentDate = new Date();
    let buyTax = 0;
    let sellTax = 0;
    let transferTax = 0;

    if (valueFetch?.honeypotDetails?.length > 0) {
        const details = valueFetch.honeypotDetails[0];
        buyTax = formatValue(parseFloat(details?.buyTax?.number || "0"));
        sellTax = formatValue(parseFloat(details?.sellTax?.number || "0"));
        transferTax = formatValue(parseFloat(details?.transferTax?.number || "0"));
    }

    let tokenAge = '-';
    if (valueFetch && tokenCreationDate) {
        tokenAge = calculateAge(tokenCreationDate);
        tokenAge = formatValue(tokenAge); // Format token age
    }

    const criticalPoint = !ercerror ? formatValue(valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount[0].count) : '-';
    const riskyPoint = !ercerror ? formatValue(valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "RISKY")?.count) : '-';
    const mediumPoint = !ercerror ? formatValue(valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "Medium Risk")?.count) : '-';
    const neutralPoint = !ercerror ? formatValue(valueFetch?.tokenInformation.totalChecksInformation?.aggregatedCount.find(item => item.name === "Neutral")?.count) : '-';



    const holdersCount = formatValue(parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.holdersDescription?.holdersCount?.number));
    const currentLiquidity = formatValue(parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.totalLpSupplyInUsd?.number));
    const lockedLiquidity = formatValue(parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.liquidityLockedDetails?.totalLiquidityPercentageLocked?.number));
    const lpHolders = formatValue(parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.lpHolderCount?.number));
    const pairs = formatValue(parseFloat(!ercerror && valueFetch?.marketChecks?.marketCheckDescription?.liquidityDescription?.aggregatedInformation?.tradingPairCount?.number));

    const mintingAuth = valueFetch?.codeChecks?.codeCheckDescription?.ownershipPermissionsDescription[0]?.heading === "Token Minting Authority is Enabled";
    const freezingAuth = valueFetch?.codeChecks?.codeCheckDescription?.ownershipPermissionsDescription[1]?.heading === "Token Freezing Authority is Enabled";
    const metadataStatus = valueFetch?.codeChecks?.codeCheckDescription?.ownershipPermissionsDescription[2]?.heading === "Token Metadata is Mutable";
    const transferFeeStatus = valueFetch?.codeChecks?.codeCheckDescription?.ownershipPermissionsDescription[3]?.risk === 0;

    const critical = !ercerror ? formatValue(valueFetch?.riskCategories?.critical) : '-';
    const risky = !ercerror ? formatValue(valueFetch?.riskCategories?.risky) : '-';
    const medium = !ercerror ? formatValue(valueFetch?.riskCategories?.medium) : '-';
    const neutral = !ercerror ? formatValue(valueFetch?.riskCategories?.neutral) : '-';

    const honeypotStatus = !ercerror && valueFetch?.honeypotDetails?.isTokenHoneypot === 1 ? "Honeypot" : "Not a Honeypot";

    return (
        <div className="bg-[#18162099]/60 rounded-[10px] backdrop-filter h-[90%] backdrop-blur-sm w-[460px] mx-auto jost text-white" style={{ boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.5)' }}>
            {!ercerror ? (
                <>
                    <div className="bg-[#181B2E] rounded-t-[10px] p-[5px] px-[20px]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {loading ? (
                                    <Skeleton width={40} height={40} />
                                ) : (
                                    <>
                                        <img
                                            className="h-5"
                                            src={valueFetch?.tokenInformation?.generalInformation?.tokenImageLink || '/default-token.png'}
                                            alt="Token"
                                        />
                                        <p className="text-lg text-center">{valueFetch?.tokenInformation?.generalInformation?.tokenName || 'Token Name'}</p>
                                        <p className="text-xs">({valueFetch?.tokenInformation?.generalInformation?.tokenSymbol || 'Symbol'})</p>
                                    </>
                                )}
                            </div>
                            <div className="flex rounded-[20px]">
                                <div className="border p-1 rounded">
                                    <img
                                        onClick={onBackClick}
                                        src="https://cdn.iconscout.com/icon/premium/png-256-thumb/back-arrow-9601866-8212676.png?f=webp&w=256"
                                        className="w-5 h-5"
                                        alt="Back"
                                    />
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-white flex items-center  w-72 overflow-scroll scrollbar-hide">
                            {selectedToken && (
                                <span className="mr-2 bg-[#300D5A] p-[6px] px-4 rounded-[5px] text-sm flex justify-center gap-1 items-center"><img className='h-4' src={Assets.SOL} alt="" />{selectedToken}</span>
                            )}
                            {loading ? <Skeleton width={150} /> : tokenAddress || 'Enter Token Address'}
                        </p>
                    </div>
                    <div className="p-[20px] flex items-center">
                        <div className=" items-center h-full">
                            {loading ? (
                                <>
                                    <Skeleton width={100} height={100} />
                                    <Skeleton width={200} height={100} />
                                </>
                            ) : (
                                <>
                                    <ScoreAndAge totalScore={totalScore} tokenAge={tokenAge} owner={owner} />
                                    <div className="border-b-2 border-white/10 my-5 self-stretch"></div>
                                    <Report 
                                        mintingAuth={mintingAuth} 
                                        freezingAuth={freezingAuth} 
                                        metadataStatus={metadataStatus} 
                                        transferFeeStatus={transferFeeStatus} 
                                    />
                                </>
                            )}
                        </div>
                        <div className="border-l-2 border-white/10 mx-5 self-stretch"> </div>
                        <div className=" items-center h-full">
                            {loading ? (
                                <>
                                    <Skeleton width={100} height={100} />
                                    <Skeleton width={200} height={100} />
                                </>
                            ) : (
                                <>
                                    <Status holdersCount={holdersCount} currentLiquidity={currentLiquidity} lockedLiquidity={lockedLiquidity} pairs={pairs} owner={owner} />
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="m-5 flex flex-col justify-center items-center py-3 pt-4">
                    <p className="text-lg">{error || 'No Data Found!'}</p>
                </div>
            )}
        </div>
    );
};

export default EvaluateSol;
