export interface PlanDetail {
    credits: number;
    price: number;
}

export interface PlansConfig {
    [key: string]: PlanDetail;
}

const plans: PlansConfig = {
    free: {
        credits: 30,
        price: 0
    },
    pro: {
        credits: 200,
        price: 499
    },
    premium: {
        credits: 1000,
        price: 1499
    }
};

export default plans;