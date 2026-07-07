import { useEffect, useState } from "react";
import GetSubmittedClaim from "../components/GetSubmittedClaim";
import {
    ClipboardCheck,
    Clock3,
    BadgeCheck
} from "lucide-react";
import { getSubmittedClaim } from "../services/claimService";
import { getCurrentUser } from "../services/userService";
import { getAllClaims } from "../services/claimService";
import AgentClaimReview from "../components/AgentClaimReview";

const AgentDashboard = () => {

    const [showClaimsModal, setShowClaimsModal] =
        useState(false);

    const [agentData, setAgentData] = useState(null);
    const [claims, setClaims] = useState([])

    const [submitClaimData, setSubmitClaimData] = useState([]);
    const [loadingClaims, setLoadingClaims] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedClaimId, setSelectedClaimId] = useState(null);

    const getAgentData = async () => {
        try {
            const data = await getCurrentUser();
            setAgentData(data);
            console.log("Agent Data:", data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubmittedClaims = async () => {
        try {
            setLoadingClaims(true);

            const data = await getSubmittedClaim();

            setSubmitClaimData(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingClaims(false);
        }
    };

    const fetchClaims = async () => {
        try {
            const data = await getAllClaims(0, 10);
            console.log(data);
            setClaims(data.content);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAgentData();
        fetchClaims();
        fetchSubmittedClaims();
    }, []);

    return (
        <div>

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-white">
                    Welcome {agentData?.fullName} 👋
                </h1>

                <p className="text-slate-400 mt-2">
                    Review customer claims and manage recommendations.
                </p>

            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-6
                    "
                >
                    <div className="flex gap-2">
                        <ClipboardCheck
                            size={40}
                            className="text-cyan-400 mb-4"
                        />
                        <p className="text-3xl font-bold text-white">
                            {submitClaimData.length}
                        </p>
                    </div>


                    <h3 className="text-white text-xl font-bold">
                        Submitted Claims
                    </h3>

                    <p className="text-slate-400 mt-2">
                        Claims waiting for review.
                    </p>
                </div>

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-6
                    "
                >
                    <div className="flex gap-2">
                        <Clock3
                            size={40}
                            className="text-yellow-400 mb-4"
                        />
                        <p className="text-3xl font-bold text-white">
                            {submitClaimData.length}
                        </p>
                    </div>

                    <h3 className="text-white text-xl font-bold">
                        Pending Reviews
                    </h3>

                    <p className="text-slate-400 mt-2">
                        Claims awaiting recommendation.
                    </p>
                </div>

                <div
                    className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        backdrop-blur-xl
                        p-6
                    "
                >
                    <div className="flex gap-2 ">
                        <BadgeCheck
                            size={40}
                            className="text-green-400 mb-4"
                        />
                        <p className="text-3xl font-bold text-white">
                            {
                                claims.filter(
                                    claim =>
                                        claim.claimStatus === "APPROVED"
                                ).length
                            }
                        </p>
                    </div>

                    <h3 className="text-white text-xl font-bold">
                        Approved Recommendations
                    </h3>

                    <p className="text-slate-400 mt-2">
                        Successfully reviewed claims.
                    </p>
                </div>

            </div>

            <div
                className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/5
                    backdrop-blur-xl
                    p-8
                "
            >
                <h2 className="text-2xl text-white font-bold mb-3">
                    Claim Review Portal
                </h2>

                <p className="text-slate-400 mb-6">
                    Open submitted claims and start reviewing.
                </p>

                {agentData?.active ? (

                    <button
                        onClick={() =>
                            setShowClaimsModal(true)
                        }
                        className="
                            px-6
                            py-3
                            rounded-xl
                            text-white
                            font-semibold
                            bg-gradient-to-r
                            from-cyan-500
                            to-blue-600
                            hover:scale-105
                            transition
                        "
                    >
                        Review Submitted Claims
                    </button>

                ) : (

                    <button
                        disabled
                        className="
                            px-6
                            py-3
                            rounded-xl
                            bg-gray-600
                            text-white
                            cursor-not-allowed
                        "
                    >
                        Agent Inactive
                    </button>

                )}

            </div>

            {/* Submitted Claims Modal */}

            {showClaimsModal && (
                <GetSubmittedClaim
                    onClose={() => setShowClaimsModal(false)}
                    submitClaimData={submitClaimData}
                    loading={loadingClaims}
                    refreshClaims={fetchSubmittedClaims}
                    setShowReviewModal={setShowReviewModal}
                    setSelectedClaimId={setSelectedClaimId}
                />
            )}

            {/* Review Claim Modal */}

            {showReviewModal && selectedClaimId && (
                <AgentClaimReview
                    claimId={selectedClaimId}
                    isModal={true}
                    onClose={() => {
                        setShowReviewModal(false);
                        setSelectedClaimId(null);

                        fetchSubmittedClaims();
                        fetchClaims();
                    }}
                />
            )}
        </div>
    );
};

export default AgentDashboard;