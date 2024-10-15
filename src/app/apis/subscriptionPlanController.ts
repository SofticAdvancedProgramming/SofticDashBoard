import { environment } from "../environment/environment";


export const subscriptionPlanController = {
    getSubscriptionPlan: `${environment.apiBaseUrl}SubscriptionPlan/Get`,
    addSubscriptionPlan: `${environment.apiBaseUrl}SubscriptionPlan/Add`,
    editSubscriptionPlan: `${environment.apiBaseUrl}SubscriptionPlan/Edit`,
    deleteSubscriptionPlan: (id: number) => `${environment.apiBaseUrl}SubscriptionPlan/Delete/${id}`,
};
