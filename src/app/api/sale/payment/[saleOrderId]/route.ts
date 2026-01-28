import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { saleId, payedAmount } = data;

    if (!saleId || payedAmount === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingSale = await tx.sales.findUnique({
        where: { saleId: Number(saleId) },
        include: { customer: true },
      });

      if (!existingSale) throw new Error('Sales order not found');

      const { totalAmount, customer, payedAmount: existingPaid } = existingSale;

      // new paid amount (clamped between 0 and totalAmount)
      const newPaid = Math.max(0, Math.min(payedAmount, totalAmount));
      const paymentDifference = newPaid - existingPaid;
      
      const paymentStatus = newPaid >= totalAmount ? 'Paid' : newPaid === 0 ? 'Unpaid' : 'Partial';

      const updatedSale = await tx.sales.update({
        where: { saleId: Number(saleId) },
        data: {
          payedAmount: newPaid,
          paymentStatus,
          status: paymentStatus === 'Paid' ? 'Complete' : 'Pending',
        },
        include: { customer: true },
      });

      // overall credit adjustments for the customer (if any)
      if (customer) {
        // Recalculate overall outstanding for the customer across all sale orders.
        const customerSales = await tx.sales.findMany({
          where: { customerId: customer.customerId },
          select: { totalAmount: true, payedAmount: true },
        });

        // Sum the outstanding (totalAmount - payedAmount) for each sale.
        const overallOutstanding = customerSales.reduce((sum, sale) => {
          return sum + (sale.totalAmount - sale.payedAmount);
        }, 0);

        // Look for an existing credit balance record for the customer.
        let creditBalance = await tx.creditBalance.findUnique({
          where: { customerId: customer.customerId },
        });

        if (!creditBalance) {
          // No credit balance exists yet – create one with the overall outstanding amount.
          creditBalance = await tx.creditBalance.create({
            data: {
              type: 'Customer',
              balance: overallOutstanding,
              customerId: customer.customerId,
            },
          });

          // Create an initial credit transaction.
          await tx.creditTransactions.create({
            data: {
              type: 'Customer',
              customerId: customer.customerId,
              saleId: updatedSale.saleId,
              amount: overallOutstanding,
              description: `Initial balance setup for sale #${updatedSale.saleId} covering all outstanding orders.`,
              date: new Date(),
            },
          });
        } else {
          // Compute the adjustment needed to match the overall outstanding balance.
          const balanceAdjustment = overallOutstanding - creditBalance.balance;
          if (balanceAdjustment !== 0) {
            // Update the credit balance to reflect the new overall outstanding.
            await tx.creditBalance.update({
              where: { id: creditBalance.id },
              data: { balance: overallOutstanding },
            });

            // Log the adjustment transaction.
            await tx.creditTransactions.create({
              data: {
                type: 'Customer',
                customerId: customer.customerId,
                saleId: updatedSale.saleId,
                amount: Math.abs(balanceAdjustment),
                description:
                  balanceAdjustment > 0
                    ? `Credit adjustment for sale #${updatedSale.saleId} and all outstanding orders`
                    : `Payment received for sale #${updatedSale.saleId} and all outstanding orders`,
                date: new Date(),
              },
            });
          }
        }
      }

      return updatedSale;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to update payment' },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const saleId = parseInt(url.pathname.split("/").pop() || "", 10);
    
    if (isNaN(saleId)) {
      return NextResponse.json(
        { error: "Invalid sale ID format." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (prisma) => {
      const salesOrder = await prisma.sales.findUnique({
        where: { saleId },
        include: {
          SalesOrderLineItems: true,
          creditsTransactions: true,
          customer: true,
        },
      });

      if (!salesOrder) {
        throw new Error("Sales order not found.");
      }

      for (const lineItem of salesOrder.SalesOrderLineItems) {
        const inventory = await prisma.inventory.findFirst({
          where: {
            productId: lineItem.productId,
            locationId: lineItem.locationId,
          },
        });

        if (!inventory) {
          throw new Error(
            `Inventory not found for product ${lineItem.productId} at location ${lineItem.locationId}`
          );
        }

        await prisma.inventory.update({
          where: { inventoryId: inventory.inventoryId },
          data: {
            quantity: inventory.quantity + lineItem.quantity,
            lastUpdated: new Date(),
          },
        });
      }

      // Calculate the unpaid portion of this sale order.
      const unpaidAmount = salesOrder.totalAmount - salesOrder.payedAmount;
      if (salesOrder.customerId && unpaidAmount > 0) {
        const creditBalance = await prisma.creditBalance.findUnique({
          where: { customerId: salesOrder.customerId },
        });

        if (creditBalance) {
          // The adjustment is the unpaid amount.
          const balanceAdjustment = unpaidAmount;
          await prisma.creditBalance.update({
            where: { customerId: salesOrder.customerId },
            data: {
              balance: { decrement: balanceAdjustment },
            },
          });

          await prisma.creditTransactions.create({
            data: {
              type: "Customer",
              customerId: salesOrder.customerId,
              amount: balanceAdjustment,
              description: `Reversal of unpaid credit from deleted sale #${saleId}`,
              saleId: saleId,
              date: new Date(),
            },
          });
        }
      }

      await prisma.creditTransactions.deleteMany({
        where: { saleId },
      });

      await prisma.salesOrderLineItems.deleteMany({
        where: { salesOrderId: saleId },
      });

      const deletedSale = await prisma.sales.delete({
        where: { saleId },
      });

      return { 
        message: "Sale order, inventory adjustments, and credit reversals handled successfully.",
        deletedSale 
      };
    }, { timeout: 30000 });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Delete Error:", errorMessage);
    return NextResponse.json(
      { error: `Deletion failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

  

// emvbi kale yhen tetekem
// export async function DELETE(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const saleId = parseInt(url.pathname.split("/").pop() || "", 10);
//     if (isNaN(saleId)) {
//       return NextResponse.json(
//         { error: "Invalid sale ID format." },
//         { status: 400 }
//       );
//     }

//     const result = await prisma.$transaction(
//       async (prisma) => {
//         // Fetch the sale order with line items and credit transactions
//         const salesOrder = await prisma.sales.findUnique({
//           where: { saleId },
//           include: {
//             SalesOrderLineItems: true,
//             creditsTransactions: true, // Include credit transactions to delete them
//           },
//         });

//         if (!salesOrder) {
//           throw new Error("Sales order not found.");
//         }

//         // Restore inventory quantities for each line item
//         for (const lineItem of salesOrder.SalesOrderLineItems) {
//           const currentInventory = await prisma.inventory.findFirst({
//             where: {
//               productId: lineItem.productId,
//               locationId: lineItem.locationId,
//             },
//           });

//           if (currentInventory) {
//             // Restore the inventory quantity
//             await prisma.inventory.update({
//               where: { inventoryId: currentInventory.inventoryId },
//               data: {
//                 quantity: currentInventory.quantity + lineItem.quantity,
//                 lastUpdated: new Date(),
//               },
//             });
//             console.log(`Inventory restored for product ID ${lineItem.productId} at location ID ${lineItem.locationId}.`);
//           } else {
//             throw new Error(
//               `Inventory not found for product ID ${lineItem.productId} and location ID ${lineItem.locationId}.`
//             );
//           }
//         }

//         // Calculate the unpaid amount
//         const unpaidAmount = salesOrder.totalAmount - salesOrder.payedAmount;

//         // Update customer's credit balance (if applicable and unpaid amount > 0)
//         if (salesOrder.customerId && unpaidAmount > 0) {
//           const creditBalance = await prisma.creditBalance.findUnique({
//             where: { customerId: salesOrder.customerId },
//           });

//           if (creditBalance) {
//             // Subtract the unpaid amount from the credit balance
//             await prisma.creditBalance.update({
//               where: { customerId: salesOrder.customerId },
//               data: {
//                 balance: creditBalance.balance - unpaidAmount,
//               },
//             });
//             console.log(`Credit balance updated for customer ID ${salesOrder.customerId}. Unpaid amount: ${unpaidAmount}`);
//           } else {
//             console.warn(`Credit balance not found for customer ID ${salesOrder.customerId}.`);
//           }
//         }

//         // Delete associated credit transactions (if any)
//         if (salesOrder.creditsTransactions && salesOrder.creditsTransactions.length > 0) {
//           await prisma.creditTransactions.deleteMany({
//             where: { saleId },
//           });
//           console.log(`Credit transactions deleted for sale ID ${saleId}.`);
//         }

//         // Delete sale order line items
//         await prisma.salesOrderLineItems.deleteMany({
//           where: { salesOrderId: saleId },
//         });
//         console.log("Sale order line items deleted for sale ID:", saleId);

//         // Delete the sale order
//         await prisma.sales.delete({
//           where: { saleId },
//         });
//         console.log("Sale order deleted for sale ID:", saleId);

//         // Return a success message
//         return { message: "Sales order and associated data deleted successfully." };
//       },
//       { timeout: 30000 } // Increase transaction timeout to 30 seconds
//     );

//     // Ensure result is always an object
//     const responsePayload = result || { message: "Transaction completed, but no result was returned." };

//     return NextResponse.json(responsePayload, { status: 200 });
//   } catch (error) {
//     // Ensure error is always an object
//     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
//     console.error("Error deleting sales order and updating inventory:", errorMessage);

//     // Return a detailed error response
//     return NextResponse.json(
//       { error: errorMessage },
//       { status: 500 }
//     );
//   }
// }


// export async function DELETE(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const saleId = parseInt(url.pathname.split("/").pop() || "", 10);
//     if (isNaN(saleId)) {
//       return NextResponse.json(
//         { error: "Invalid sale ID format." },
//         { status: 400 }
//       );
//     }
//     const result = await prisma.$transaction(async (prisma) => {
//       const salesOrder = await prisma.sales.findUnique({
//         where: { saleId },
//         include: { SalesOrderLineItems: true },
//       });
//       if (!salesOrder) {
//         throw new Error("Sales order not found.");
//       }

//        for (const lineItem of salesOrder.SalesOrderLineItems) {
//         const currentInventory = await prisma.inventory.findFirst({
//           where: {
//             productId: lineItem.productId,
//             locationId: lineItem.locationId,
//           },
//         });


//         if (currentInventory) {
//           await prisma.inventory.update({
//             where: { inventoryId: currentInventory.inventoryId },
//             data: { 
//               quantity: currentInventory.quantity + lineItem.quantity,
//               lastUpdated: new Date(),
//             },
//           });
//         } else {
//           throw new Error(
//             `Inventory not found for product ID ${lineItem.productId} and location ID ${lineItem.locationId}.`
//           );
//         }
//       }

//       await prisma.salesOrderLineItems.deleteMany({
//         where: { salesOrderId: saleId },
//       });

//       await prisma.sales.delete({
//         where: { saleId },
//       });

//       return { message: "Sales order and line items deleted successfully." };
//     });

//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting sales order and updating inventory:", error);
//     return NextResponse.json(
//       { error: "Failed to delete sales order. Please try again later." },
//       { status: 500 }
//     );
//   }
// }


