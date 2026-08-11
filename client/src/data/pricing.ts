import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
    {
        name: "Free",
        price: 0,
        period: "month",
        credits: 30,
        features: [
            "30 Credits / month",
            "YouTube & Instagram SEO",
            "Viral Title Generator",
            "Hashtag & Tag Packs",
            "Standard Generation Speed"
        ],
        mostPopular: false
    },
    {
        name: "Pro",
        price: 499,
        period: "month",
        credits: 200,
        features: [
            "200 Credits / month",
            "Full Video Script Outlines",
            "Thumbnail Visual Prompts",
            "SEO Keyword Optimizer",
            "Priority AI Generation",
            "24/7 Priority Support"
        ],
        mostPopular: true
    },
    {
        name: "Premium",
        price: 1499,
        period: "month",
        credits: 1000,
        features: [
            "1,000 Credits / month",
            "Everything in Pro Plan",
            "Bulk Content Packs",
            "Advanced Keyword Optimizer",
            "VIP Dedicated Support",
            "Maximum Priority Processing"
        ],
        mostPopular: false
    }
];