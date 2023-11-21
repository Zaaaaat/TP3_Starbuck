"use server"

import { OrdersResult } from "../../../../src/types";
import prisma from "../../../../src/utils/prisma";


export async function getOrders() {
    let result = await prisma.order.findMany();
    return result;
}