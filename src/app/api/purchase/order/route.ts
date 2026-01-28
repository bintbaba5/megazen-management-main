import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const purchases = await prisma.purchases.findMany({
      include: {
        PurchaseOrderLineItems: {
          include: {
            product: {
              select: {
                name: true,
                productId: true,
              },
            },
          },
        },
        supplier: true
      },
      orderBy: {
        updatedAt: "desc", 
      },
    });
    return NextResponse.json({ success: true, data: purchases });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch locations." },
      { status: 500 }
    );
  }
}

//ye mejemeriaya
// export async function POST(req: Request) {
//   const session = await auth();
//   const userId = session?.user?.id;
//   try {
//     const data = await req.json();
//     console.log("Received data:", data);

//     if (
//       !data ||
//       !data.supplierName ||
//       !data.supplierPhone ||
//       !data.paymentStatus ||
//       !data.totalAmount ||
//       !data.locationId ||
//       !data.purchaseOrderLineItems ||
//       !Array.isArray(data.purchaseOrderLineItems) ||
//       data.purchaseOrderLineItems.length === 0
//     ) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     // Extract necessary data from the request
//     const {
//       supplierName,
//       supplierPhone,
//       paymentStatus,
//       paidAmount,
//       locationId,
//       totalAmount,
//       orderDate,
//       dueDate,
//       purchaseOrderLineItems,
//     } = data;

//     // Create the purchase order
//     const createdPurchase = await prisma.purchases.create({
//       data: {
//         supplierName,
//         supplierPhone,
//         paymentStatus,
//         paidAmount,
//         totalAmount,
//         locationId: parseInt(locationId),
//         orderDate: new Date(orderDate),
//         PurchaseOrderLineItems: {
//           create: purchaseOrderLineItems.map((item: any) => ({
//             productId: parseInt(item.productId),
//             quantity: item.quantity,
//             unitPrice: parseFloat(item.unitPrice),
//             totalPrice: parseFloat(item.totalPrice),
//           })),
//         },
//       },
//       include: { PurchaseOrderLineItems: true }, // Include line items in the response
//     });

//     // Begin transaction to handle inventory updates and purchase details
//     const updatedPurchase = await prisma.$transaction(
//       async (tx) => {
//         // Process each purchase order line item
//         for (const item of createdPurchase.PurchaseOrderLineItems) {
//           const inventory = await tx.inventory.findUnique({
//             where: {
//               productId_locationId: {
//                 productId: item.productId,
//                 locationId: createdPurchase.locationId,
//               },
//             },
//           });

//           if (!inventory) {
//             throw new Error(
//               `Inventory not found for productId ${item.productId} at locationId ${createdPurchase.locationId}.`
//             );
//           }

//           const oldQuantity = inventory.quantity;

//           // Update inventory with purchased items
//           await tx.inventory.update({
//             where: {
//               productId_locationId: {
//                 productId: item.productId,
//                 locationId: createdPurchase.locationId,
//               },
//             },
//             data: {
//               quantity: inventory.quantity + item.quantity,
//               isLowStock:
//                 inventory.lowStockLevel !== null &&
//                 inventory.quantity + item.quantity < inventory.lowStockLevel,
//             },
//           });

//           // Create stock movement entry
//          const movements =  await tx.stockMovements.create({
//             data: {
//               quantity: item.quantity,
//               type: "PURCHASE",
//               inventoryId: inventory.inventoryId,
//             },
//           });
//           const session = await auth();
//           const userId = session?.user?.id;
//           // Log audit for stock change
//           await tx.audits.create({
//             data: {
//               action: "Movement",
//               timestamp: new Date(),
//               user: {
//                 connect: { id: userId }, // Replace with actual user ID
//               },
//               inventory: { connect: { inventoryId: inventory.inventoryId } },
//               movements:{ connect: { movementId: movements.movementId } },
//               oldQuantity,
//               newQuantity: inventory.quantity + item.quantity,
//             },
//           });
//         }

//         // Update purchase payment details after transaction
//         return await tx.purchases.update({
//           where: { purchaseId: createdPurchase.purchaseId },
//           data: {
//             paymentStatus,
//             paidAmount,
//             status: paymentStatus === "Paid" ? "Received" : "Pending",
//           },
//         });
//       },
//       {
//         timeout: 10000, // Set timeout to 10 seconds
//       }
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Purchase order created and updated successfully.",
//       updatedPurchase,
//       redirectUrl: "/purchaseLists", // Add the URL where the user should be redirected
//     }, { status: 200 });
//   } catch (error) {
//     console.error("Error processing the request:", error.message || error);
//     return NextResponse.json(
//       { success: false, error: error.message || "Internal server error." },
//       { status: 500 }
//     );
//   }
// }

// before 
// export async function POST(req: Request) {
//   try {
//     const data = await req.json();    
//         if (
//       !data ||
//       !data.paymentStatus ||
//       !data.totalAmount ||
//       !data.locationId ||
//       !data.purchaseOrderLineItems ||
//       !Array.isArray(data.purchaseOrderLineItems) ||
//       data.purchaseOrderLineItems.length === 0
//     ) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields." },
//         { status: 400 }
//       );
//     }
//     const {
//       supplierId,
//       paymentStatus,
//       paidAmount,
//       locationId,
//       totalAmount,
//       orderDate,
//       purchaseOrderLineItems,
//     } = data;

//     const session = await auth();
//     const userId = session?.user?.id;

//     const updatedSales = await prisma.$transaction(
//       async (tx) => {
//         // Create purchase instead of sale
//         const createdPurchase = await tx.purchases.create({
//           data: {
//             supplierId, // Now using supplierId
//             paymentStatus,
//             paidAmount,
//             totalAmount,
//             status: 'Received',
//             locationId: parseInt(locationId),
//             orderDate: new Date(orderDate),
//             PurchaseOrderLineItems: {
//               create: purchaseOrderLineItems.map((item: any) => ({
//                 productId: parseInt(item.productId),
//                 quantity: item.quantity,
//                 unitPrice: parseFloat(item.unitPrice),
//                 totalPrice: parseFloat(item.totalPrice),
//               })),
//             },
//           },
//           include: { PurchaseOrderLineItems: true }, // Include line items in the response
//         });

//         for (const item of createdPurchase.PurchaseOrderLineItems) {
//           const inventory = await tx.inventory.findUnique({
//             where: {
//               productId_locationId: {
//                 productId: item.productId,
//                 locationId: createdPurchase.locationId,
//               },
//             },
//           });

//           if (!inventory) {
//             throw new Error(
//               `Inventory not found for productId ${item.productId} at locationId ${createdPurchase.locationId}.`
//             );
//           }

//           const oldQuantity = inventory.quantity;

//           // Update inventory with purchased items
//           await tx.inventory.update({
//             where: {
//               productId_locationId: {
//                 productId: item.productId,
//                 locationId: createdPurchase.locationId,
//               },
//             },
//             data: {
//               quantity: inventory.quantity + item.quantity,
//               isLowStock:
//                 inventory.lowStockLevel !== null &&
//                 inventory.quantity + item.quantity < inventory.lowStockLevel,
//             },
//           });

//           // Create stock movement entry
//          const movements =  await tx.stockMovements.create({
//             data: {
//               quantity: item.quantity,
//               type: "PURCHASE",
//               inventoryId: inventory.inventoryId,
//             },
//           });
//           // Log audit for stock change
//           await tx.audits.create({
//             data: {
//               action: "Movement",
//               timestamp: new Date(),
//               user: {
//                 connect: { id: userId }, // Replace with actual user ID
//               },
//               inventory: { connect: { inventoryId: inventory.inventoryId } },
//               movements:{ connect: { movementId: movements.movementId } },
//               oldQuantity,
//               newQuantity: inventory.quantity + item.quantity,
//             },
//           });
//         }
//         // Handle SUPPLIER credit balance
//         if (supplierId) {
//           await tx.creditTransactions.create({
//             data: {
//               type: "Supplier",
//               supplierId: supplierId,
//               purchaseId: createdPurchase.purchaseId,
//               amount: totalAmount,
//               description: `Purchase Order #${createdPurchase.purchaseId}`,
//               date: new Date(),
//             },
//           });
//           const existingCreditBalance = await tx.creditBalance.findUnique({
//             where: { supplierId },
//           });

//           if (existingCreditBalance) {
//             // For suppliers, INCREASE balance (you owe them more)
//             await tx.creditBalance.update({
//               where: { supplierId },
//               data: {
//                 balance: existingCreditBalance.balance + totalAmount,
//               },
//             });
//           } else {
//             // Create new supplier balance
//             await tx.creditBalance.create({
//               data: {
//                 supplierId,
//                 type: "Supplier",
//                 balance: totalAmount, // Initial balance is what you owe
//               },
//             });
//           }
//         }

//         return await tx.purchases.update({
//           where: { purchaseId: createdPurchase.purchaseId },
//           data: { status: "Pending" },
//         });
//       },
//       { timeout: 10000 }
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Purchase order created successfully.", // Updated message
//         updatedSales,
//         redirectUrl: "/purchaseLists", // Update redirect if needed
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error processing the request:", error.message || error);
//     return NextResponse.json(
//       { success: false, error: error.message || "Internal server error." },
//       { status: 500 }
//     );
//   }
// }


export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (
      !data ||
      !data.paymentStatus ||
      !data.totalAmount ||
      !data.locationId ||
      !data.purchaseOrderLineItems ||
      !Array.isArray(data.purchaseOrderLineItems) ||
      data.purchaseOrderLineItems.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const {
      supplierId,
      paymentStatus,
      paidAmount,
      locationId,
      totalAmount,
      orderDate,
      purchaseOrderLineItems,
    } = data;

    const session = await auth();
    const userId = session?.user?.id;

    const createdPurchase = await prisma.$transaction(
      async (tx) => {
        const purchase = await tx.purchases.create({
          data: {
            supplierId,
            paymentStatus,
            paidAmount,
            totalAmount,
            status: 'Received',
            locationId: parseInt(locationId),
            orderDate: new Date(orderDate),
            PurchaseOrderLineItems: {
              create: purchaseOrderLineItems.map((item: any) => ({
                productId: parseInt(item.productId),
                quantity: item.quantity,
                unitPrice: parseFloat(item.unitPrice),
                totalPrice: parseFloat(item.totalPrice),
              })),
            },
          },
          include: { PurchaseOrderLineItems: true },
        });

        for (const item of purchase.PurchaseOrderLineItems) {
          const inventory = await tx.inventory.findUnique({
            where: {
              productId_locationId: {
                productId: item.productId,
                locationId: purchase.locationId,
              },
            },
          });

          if (!inventory) {
            throw new Error(
              `Inventory not found for productId ${item.productId} at locationId ${purchase.locationId}.`
            );
          }

          const oldQuantity = inventory.quantity;

          await tx.inventory.update({
            where: {
              productId_locationId: {
                productId: item.productId,
                locationId: purchase.locationId,
              },
            },
            data: {
              quantity: inventory.quantity + item.quantity,
              isLowStock:
                inventory.lowStockLevel !== null &&
                inventory.quantity + item.quantity < inventory.lowStockLevel,
            },
          });

          const movements = await tx.stockMovements.create({
            data: {
              quantity: item.quantity,
              type: "PURCHASE",
              inventoryId: inventory.inventoryId,
            },
          });

          await tx.audits.create({
            data: {
              action: "Movement",
              timestamp: new Date(),
              user: { connect: { id: userId } },
              inventory: { connect: { inventoryId: inventory.inventoryId } },
              movements: { connect: { movementId: movements.movementId } },
              oldQuantity,
              newQuantity: inventory.quantity + item.quantity,
            },
          });
        }

        return purchase;
      },
      { timeout: 30000 }
    );

    if (supplierId) {
      await prisma.$transaction(
        async (tx) => {
          const paidAmountFloat = parseFloat(paidAmount || "0");
          const totalAmountFloat = parseFloat(totalAmount);
    
          const outstandingBalance = totalAmountFloat - paidAmountFloat;
    
          // ONLY for partial or unpaid purchases
          if (outstandingBalance > 0) {
            await tx.creditTransactions.create({
              data: {
                type: "Supplier",
                supplierId: supplierId,
                purchaseId: createdPurchase.purchaseId,
                amount: outstandingBalance,
                description: `Outstanding balance for Purchase Order #${createdPurchase.purchaseId}`,
                date: new Date(),
              },
            });
    
            const existingCreditBalance = await tx.creditBalance.findUnique({
              where: { supplierId },
            });
    
            if (existingCreditBalance) {
              await tx.creditBalance.update({
                where: { supplierId },
                data: {
                  balance: existingCreditBalance.balance + outstandingBalance,
                },
              });
            } else {
              await tx.creditBalance.create({
                data: {
                  supplierId,
                  type: "Supplier",
                  balance: outstandingBalance,
                },
              });
            }
          }
        },
        { timeout: 10000 } 
      );
    }

    const updatedPurchase = await prisma.purchases.update({
      where: { purchaseId: createdPurchase.purchaseId },
      data: { status: "Pending" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Purchase order created successfully.",
        updatedPurchase,
        redirectUrl: "/purchaseLists",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error.message || error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}