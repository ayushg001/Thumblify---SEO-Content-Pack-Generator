'use client'
import { useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { pricingData } from "../data/pricing";
import type { IPricing } from "../types";
import { CheckIcon, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../configs/api";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PricingSection() {
    const navigate = useNavigate();
    const { isLoggedIn, user, fetchUser } = useAuth();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    // Get current user's plan price (default to 0 for free plan or logged out)
    const currentUserPlanPrice = pricingData.find(
        (p) => p.name.toLowerCase() === (user?.plan || 'free').toLowerCase()
    )?.price || 0;

    const handlePurchase = async (plan: IPricing) => {
        if (!isLoggedIn) {
            toast.error("Please login to choose a plan");
            navigate('/login');
            return;
        }

        // 1. If clicking user's active plan
        if (currentUserPlanPrice === plan.price) {
            toast.success("You are currently using this plan");
            navigate('/generate');
            return;
        }

        // 2. If clicking a lower plan than user's active plan
        if (plan.price < currentUserPlanPrice) {
            toast.error(`You are already on a higher plan (${user?.plan?.toUpperCase()})`);
            return;
        }

        // 3. Higher plan -> proceed to upgrade
        try {
            setLoadingPlan(plan.name);

            // Step 1: Create Razorpay order from backend
            const { data } = await api.post('/api/payment/create-order', {
                plan: plan.name,
                amount: plan.price
            });

            if (!data.success) {
                toast.error(data.message || 'Failed to create order');
                return;
            }

            // Step 2: Open Razorpay popup
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Thumblify",
                description: `${plan.name} Plan Subscription`,
                order_id: data.order.id,
                prefill: {
                    name: user?.name || '',
                    email: user?.email || ''
                },
                theme: { color: '#ec4899' },
                handler: async (response: any) => {
                    // Step 3: Verify payment after successful payment popup response
                    try {
                        const verifyRes = await api.post('/api/payment/verify-payment', {
                            ...response,
                            plan: plan.name
                        });

                        if (verifyRes.data.success) {
                            toast.success(verifyRes.data.message || 'Payment verified!');
                            await fetchUser();
                            navigate('/generate');
                        } else {
                            toast.error(verifyRes.data.message || 'Payment verification failed');
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || 'Payment verification error');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to initialize payment');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32">
            <SectionTitle text1="Pricing" text2="Simple Pricing" text3="Choose the plan that fits your creation schedule. Cancel anytime." />

            <div className="flex flex-wrap items-center justify-center gap-8 mt-20">
                {pricingData.map((plan: IPricing, index: number) => {
                    const isCurrentPlan = isLoggedIn && currentUserPlanPrice === plan.price;
                    const isLowerPlan = isLoggedIn && plan.price < currentUserPlanPrice;
                    const isLoadingThisPlan = loadingPlan === plan.name;

                    return (
                        <motion.div key={index} className={`w-72 border border-pink-950 p-6 pb-8 rounded-2xl flex flex-col justify-between ${plan.mostPopular ? 'bg-pink-950/60 relative' : 'bg-pink-950/20'}`}
                            initial={{ y: 150, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                        >
                            {plan.mostPopular && (
                                <p className="absolute px-3 text-xs font-semibold -top-3 left-6 py-1 bg-pink-500 text-white rounded-full shadow-md">Most Popular</p>
                            )}
                            <div>
                                <p className="font-bold text-lg text-pink-200">{plan.name}</p>
                                <h1 className="text-3xl font-extrabold mt-2 text-white">${plan.price}<span className="text-gray-400 font-normal text-sm">/{plan.period}</span></h1>
                                <ul className="list-none text-slate-300 mt-6 space-y-3 text-sm text-left">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start gap-2.5">
                                            <CheckIcon className="size-4.5 text-pink-400 shrink-0 mt-0.5" />
                                            <span className="text-zinc-200">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => handlePurchase(plan)}
                                disabled={isLoadingThisPlan || !!loadingPlan}
                                type="button"
                                className={`w-full py-3 rounded-xl font-semibold mt-8 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${plan.mostPopular ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/20' : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'} ${(isLoadingThisPlan || !!loadingPlan) ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoadingThisPlan ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin text-white" />
                                        <span>Processing...</span>
                                    </>
                                ) : isLoggedIn ? (
                                    isCurrentPlan ? 'Current Plan' : isLowerPlan ? 'Included' : 'Upgrade Plan'
                                ) : (
                                    plan.price === 0 ? 'Start Free' : 'Choose Plan'
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}