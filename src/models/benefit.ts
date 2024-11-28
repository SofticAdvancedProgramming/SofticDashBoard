interface BenefitType {
    id: number;
    companyId: number;
    name: string;
    nameAr: string;
}

interface Benefit {
    amount: number;
    transactionDate: string;
    benefitType?: {
        name: string;
        nameAr: string;
    };
}