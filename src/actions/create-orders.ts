import { ProductLineData } from '@/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateOrderResult {
    success: boolean;
    orderId?: number;
    error?: string;
}

export default async function createOrder(lines: ProductLineData[]): Promise<CreateOrderResult> {
    try {
        let total = 0;
        lines.forEach((line) => (total += line.qty * line.product.price));

        if (lines.length > 0) {
            const result = await prisma.order.create({
                data: {
                    status: 'IN_PROGRESS',
                    completedAt: null,
                    total: total,
                    lines: {
                        create: lines.map((line) => {
                            return {
                                productId: line.product.id,
                                subtotal: line.product.price * line.qty,
                                qty: line.qty,
                            };
                        }),
                    },
                },
            });

            return { success: true, orderId: result.id };
        }
    } catch (error) {
        console.error('Erreur lors de la création de la commande :', error);
        return { success: false, error: 'Une erreur s\'est produite lors de la création de la commande.' };
    } finally {
        await prisma.$disconnect();
    }

    return { success: false, error: 'Aucune ligne de commande à traiter.' };
}
