import { baseAPIRoute } from "@Constants/routeConstants";
import baseServiceRouter from "@Routes/baseRouter";

export const RouterPaths = [
    {
        order: 1,
        route: baseAPIRoute,
        router: baseServiceRouter,
    },
];

console.log("RouterPaths configured:", RouterPaths);