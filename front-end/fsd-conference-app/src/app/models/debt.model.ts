export interface Debt {
    events: { debt: number, discount: string, discountAmount: number, event: string, originalPrice: number }[];
    twoDayDiscount: { discount: string, discountAmount: number } | null;
    promoCodeDiscount: { discount: string, discountAmount: number } | null;
    totalDebt: number;

}