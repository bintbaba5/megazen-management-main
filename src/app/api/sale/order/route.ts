// misera gn reduce mayaregew nw
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sales = await prisma.sales.findMany({
      include: {
        SalesOrderLineItems: {
          include: {
            product: {
              select: {
                name: true,
                productId: true,
              },
            },
          },
        },
        customer: true
      },
      orderBy: {
        updatedAt: "desc", // Sort by updatedAt in descending order (most recent first)
      },
    });
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch locations." },
      { status: 500 }
    );
  }
}

//mejemeriya yenebere
// export async function POST(req: Request) {
//   try {
//     const data = await req.json();
//     const {
//       customerName,
//       customerContact,
//       orderDate,
//       dueDate,
//       totalAmount,
//       salesOrderLineItems,
//     } = data;

//     // Validate required fields
//     if (
//       !customerName ||
//       !dueDate ||
//       totalAmount === undefined ||
//       !Array.isArray(salesOrderLineItems) ||
//       salesOrderLineItems.length === 0 ||
//       salesOrderLineItems.some(
//         (item: any) =>
//           !item.locationId ||
//           !item.productId ||
//           item.quantity === undefined ||
//           item.unitPrice === undefined ||
//           item.totalPrice === undefined
//       )
//     ) {
//       return NextResponse.json(
//         { error: "Missing required fields or invalid salesOrderLineItems." },
//         { status: 400 }
//       );
//     }

//     // Create sale with nested salesOrderLineItems
//     const sale = await prisma.sales.create({
//       data: {
//         customerName,
//         customerContact,
//         orderDate: orderDate ? new Date(orderDate) : undefined,
//         dueDate: new Date(dueDate),
//         totalAmount,
//         paymentStatus: "Unpaid",
//         payedAmount: 0.0,
//         SalesOrderLineItems: {
//           create: salesOrderLineItems.map((item: any) => ({
//             locationId: parseInt(item.locationId),
//             productId: parseInt(item.productId),
//             quantity: item.quantity,
//             unitPrice: parseFloat(item.unitPrice),
//             totalPrice: parseFloat(item.totalPrice),
//           })),
//         },
//       },
//       include: {
//         SalesOrderLineItems: true,
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Sale order created successfully.",
//         sale,
//         redirectUrl: "/orders-list/salePerson",
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Error creating sale order:", error.message, error.stack);
//     return NextResponse.json(
//       { error: "Failed to create sale order. Please try again later." },
//       { status: 500 }
//     );
//   }
// }

//before credit yenebere
// export async function POST(req: Request) {
//   try {
//     const data = await req.json();

//     // Extract necessary data from the request
//     const {
//       customerId,
//       dueDate,
//       totalAmount,
//       orderDate,
//       salesOrderLineItems,
//     } = data;

//     if (
//       !dueDate ||
//       totalAmount === undefined ||
//       !Array.isArray(salesOrderLineItems) ||
//       salesOrderLineItems.length === 0 ||
//       salesOrderLineItems.some(
//         (item: any) =>
//           !item.locationId ||
//           !item.productId ||
//           item.quantity === undefined ||
//           item.unitPrice === undefined ||
//           item.totalPrice === undefined
//       )
//     ) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields." },
//         { status: 400 }
//       );
//     }
//     // Create the sales order
//     const createdSales = await prisma.sales.create({
//       data: {
//         customerId ,
//         paymentStatus: "Unpaid",
//         payedAmount: 0.0,
//         totalAmount,
//         dueDate: new Date(dueDate),
//         orderDate: orderDate ? new Date(orderDate) : undefined,
//         SalesOrderLineItems: {
//           create: salesOrderLineItems.map((item: any) => ({
//             productId: parseInt(item.productId),
//             locationId: parseInt(item.locationId),
//             quantity: item.quantity,
//             unitPrice: parseFloat(item.unitPrice),
//             totalPrice: parseFloat(item.totalPrice),
//           })),
//         },
//       },
//       include: { SalesOrderLineItems: true },
//     });

//     // Begin transaction to handle inventory updates and sales details
//     const updatedSales = await prisma.$transaction(
//       async (transactionPrisma) => {
//         // Process each sales order line item
//         for (const item of createdSales.SalesOrderLineItems) {
//           const inventory = await transactionPrisma.inventory.findUnique({
//             where: {
//               productId_locationId: {
//                 productId: item.productId,
//                 locationId: item.locationId,
//               },
//             },
//           });

//           if (!inventory) {
//             throw new Error(
//               `Inventory not found for productId ${item.productId} at locationId ${item.locationId}.`
//             );
//           }

//           const oldQuantity = inventory.quantity;

//           // Update inventory with sold items
//           await transactionPrisma.inventory.update({
//             where: {
//               productId_locationId: {
//                 productId: item.productId,
//                 locationId: item.locationId,
//               },
//             },
//             data: {
//               quantity: inventory.quantity - item.quantity,
//               isLowStock:
//                 inventory.lowStockLevel !== null &&
//                 inventory.quantity - item.quantity < inventory.lowStockLevel,
//             },
//           });

//           // Create stock movement entry for sale
//           const movements = await transactionPrisma.stockMovements.create({
//             data: {
//               quantity: item.quantity,
//               type: "SALES",
//               inventoryId: inventory.inventoryId,
//             },
//           });

//           const session = await auth();
//           const userId = session?.user?.id;

//           // Log audit for stock change
//           await transactionPrisma.audits.create({
//             data: {
//               action: "Movement",
//               timestamp: new Date(),
//               user: {
//                 connect: { id: userId },
//               },
//               inventory: { connect: { inventoryId: inventory.inventoryId } },
//               movements: { connect: { movementId: movements.movementId } },
//               oldQuantity,
//               newQuantity: inventory.quantity - item.quantity,
//             },
//           });
//         }

//         // Update sales payment details after transaction
//         return await transactionPrisma.sales.update({
//           where: { saleId: createdSales.saleId },
//           data: {
//             status: "Pending",
//           },
//         });
//       },
//       {
//         timeout: 10000, // Set timeout to 10 seconds
//       }
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Sale order created successfully.",
//         updatedSales,
//         redirectUrl: "/orders-list/salePerson",
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

// be credit

//huletengaw version
// export async function POST(req: Request) {
//   try {
//     const data = await req.json();

//     const {
//       customerId,
//       dueDate,
//       totalAmount,
//       orderDate,
//       salesOrderLineItems,
//     } = data;

//     if (
//       !dueDate ||
//       totalAmount === undefined ||
//       !Array.isArray(salesOrderLineItems) ||
//       salesOrderLineItems.length === 0 ||
//       salesOrderLineItems.some(
//         (item: any) =>
//           !item.locationId ||
//           !item.productId ||
//           item.quantity === undefined ||
//           item.unitPrice === undefined ||
//           item.totalPrice === undefined
//       )
//     ) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//      const session = await auth();
//     const userId = session?.user?.id;

//     const updatedSales = await prisma.$transaction(
//       async (tx) => {
//         const createdSales = await tx.sales.create({
//           data: {
//             customerId,
//             paymentStatus: "Unpaid",
//             payedAmount: 0.0,
//             totalAmount,
//             dueDate: new Date(dueDate),
//             orderDate: orderDate ? new Date(orderDate) : undefined,
//             SalesOrderLineItems: {
//               create: salesOrderLineItems.map((item: any) => ({
//                 productId: parseInt(item.productId),
//                 locationId: parseInt(item.locationId),
//                 quantity: item.quantity,
//                 unitPrice: parseFloat(item.unitPrice),
//                 totalPrice: parseFloat(item.totalPrice),
//               })),
//             },
//           },
//           include: { SalesOrderLineItems: true },
//         });
//  for (const item of createdSales.SalesOrderLineItems) {
//           const inventory = await tx.inventory.findUnique({
//             where: {
//               productId_locationId: {
//                 productId: item.productId,
//                 locationId: item.locationId,
//               },
//             },
//           });

//           if (!inventory) {
//             throw new Error(
//               `Inventory not found for productId ${item.productId} at locationId ${item.locationId}.`
//             );
//           }

//           const oldQuantity = inventory.quantity;

//           await tx.inventory.update({
//             where: {
//               productId_locationId: {
//                 productId: item.productId,
//                 locationId: item.locationId,
//               },
//             },
//             data: {
//               quantity: inventory.quantity - item.quantity,
//               isLowStock:
//                 inventory.lowStockLevel !== null &&
//                 inventory.quantity - item.quantity < inventory.lowStockLevel,
//             },
//           });

//            const movements = await tx.stockMovements.create({
//             data: {
//               quantity: item.quantity,
//               type: "SALES",
//               inventoryId: inventory.inventoryId,
//             },
//           });

//            await tx.audits.create({
//             data: {
//                 action: "Movement",
//                 timestamp: new Date(),
//                 user: {
//                   connect: { id: userId },
//                 },
//                 inventory: { connect: { inventoryId: inventory.inventoryId } },
//                 movements: { connect: { movementId: movements.movementId } },
//                 oldQuantity,
//                 newQuantity: inventory.quantity - item.quantity,
//             },
//           });
//         }

//         // Step 5: Handle credit balance updates if customerId is present
//         if (customerId) {
//           const existingCreditBalance = await tx.creditBalance.findUnique({
//             where: { customerId },
//           });

//           if (existingCreditBalance) {
//             // Update the existing credit balance
//             await tx.creditBalance.update({
//               where: { customerId },
//               data: {
//                 balance: existingCreditBalance.balance + totalAmount, // Increase balance by total amount of the sale
//               },
//             });
//           } else {
//             // Create a new credit balance entry for the customer
//             await tx.creditBalance.create({
//               data: {
//                 customerId,
//                 type: "Customer",
//                 balance: totalAmount,
//               },
//             });
//           }
//         }

//         // Step 6: Update sales order status
//         return await tx.sales.update({
//           where: { saleId: createdSales.saleId },
//           data: {
//             status: "Pending",
//           },
//         });
//       },
//       { timeout: 10000 } 
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Sale order created successfully.",
//         updatedSales,
//         redirectUrl: "/orders-list/salePerson",
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

// export async function POST(req: Request) {
//   try {
//     const data = await req.json();
//     const { customerId, dueDate, totalAmount, orderDate, salesOrderLineItems } = data;

//     if (!dueDate || totalAmount === undefined || !Array.isArray(salesOrderLineItems) || salesOrderLineItems.length === 0) {
//       return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
//     }

//     const session = await auth();
//     const userId = session?.user?.id;

//     const updatedSales = await prisma.$transaction(async (tx) => {
//       // ✅ Create Sales Order
//       const createdSales = await tx.sales.create({
//         data: {
//           customerId,
//           paymentStatus: "Unpaid",
//           payedAmount: 0.0,
//           totalAmount,
//           dueDate: new Date(dueDate),
//           orderDate: orderDate ? new Date(orderDate) : undefined,
//           SalesOrderLineItems: {
//             create: salesOrderLineItems.map((item: any) => ({
//               productId: parseInt(item.productId),
//               locationId: parseInt(item.locationId),
//               quantity: item.quantity,
//               unitPrice: parseFloat(item.unitPrice),
//               totalPrice: parseFloat(item.totalPrice),
//             })),
//           },
//         },
//         include: { SalesOrderLineItems: true },
//       });

//       // ✅ Fetch all inventory records at once (batch query)
//       const inventoryIds = salesOrderLineItems.map((item) => ({
//         productId: parseInt(item.productId),
//         locationId: parseInt(item.locationId),
//       }));

//       const inventories = await tx.inventory.findMany({
//         where: {
//           OR: inventoryIds,
//         },
//       });

//       // Create a map for easy lookup
//       const inventoryMap = new Map(
//         inventories.map((inv) => [`${inv.productId}-${inv.locationId}`, inv])
//       );

//       // ✅ Batch process inventory updates, movements, and audits
//       const inventoryUpdates = salesOrderLineItems.map(async (item) => {
//         const key = `${item.productId}-${item.locationId}`;
//         const inventory = inventoryMap.get(key);

//         if (!inventory) {
//           throw new Error(`Inventory not found for productId ${item.productId} at locationId ${item.locationId}.`);
//         }

//         const oldQuantity = inventory.quantity;
//         const newQuantity = oldQuantity - item.quantity;

//         // ✅ Prevent negative stock
//         if (newQuantity < 0) {
//           throw new Error(`Not enough stock for productId ${item.productId} at locationId ${item.locationId}.`);
//         }

//         return tx.audits.create({
//           data: {
//             action: "Movement",
//             timestamp: new Date(),
//             user: { connect: { id: userId } },
//             inventory: { connect: { inventoryId: inventory.inventoryId } },
//             oldQuantity,
//             newQuantity,
//             movements: {
//               create: {
//                 quantity: item.quantity,
//                 type: "SALES",
//                 inventory: { connect: { inventoryId: inventory.inventoryId } },
//               },
//             },
//           },
//         }).then(() =>
//           tx.inventory.update({
//             where: {
//               productId_locationId: {
//                 productId: parseInt(item.productId),
//                 locationId: parseInt(item.locationId),
//               },
//             },
//             data: {
//               quantity: newQuantity,
//               isLowStock: inventory.lowStockLevel !== null && newQuantity < inventory.lowStockLevel,
//             },
//           })
//         );
//       });

//       // Execute batch updates
//       await Promise.all(inventoryUpdates);

//       return await tx.sales.update({
//         where: { saleId: createdSales.saleId },
//         data: {
//           status: "Pending",
//         },
//       });
//       { timeout: 10000 }
//     });

//     return NextResponse.json(
//       { success: true, message: "Sale order created successfully.", updatedSales, redirectUrl: "/orders-list/salePerson" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error processing the request:", error.message || error);
//     return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
//   }
// }

//yale credit yemisera
// export async function POST(req: Request) {
//   try {
//     const data = await req.json();
//     const { customerId, dueDate, totalAmount, orderDate, salesOrderLineItems } = data;

//     if (!dueDate || totalAmount === undefined || !Array.isArray(salesOrderLineItems) || salesOrderLineItems.length === 0) {
//       return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
//     }

//     const session = await auth();
//     const userId = session?.user?.id;

//     const updatedSales = await prisma.$transaction(async (tx) => {
//       const createdSales = await tx.sales.create({
//         data: {
//           customerId,
//           paymentStatus: "Unpaid",
//           payedAmount: 0.0,
//           totalAmount,
//           dueDate: new Date(dueDate),
//           orderDate: orderDate ? new Date(orderDate) : undefined,
//           SalesOrderLineItems: {
//             create: salesOrderLineItems.map((item: any) => ({
//               productId: parseInt(item.productId),
//               locationId: parseInt(item.locationId),
//               quantity: item.quantity,
//               unitPrice: parseFloat(item.unitPrice),
//               totalPrice: parseFloat(item.totalPrice),
//             })),
//           },
//         },
//         include: { SalesOrderLineItems: true },
//       });

//       const inventoryIds = salesOrderLineItems.map((item) => ({
//         productId: parseInt(item.productId),
//         locationId: parseInt(item.locationId),
//       }));

//       const inventories = await tx.inventory.findMany({
//         where: {
//           OR: inventoryIds,
//         },
//       });

//       const inventoryMap = new Map(
//         inventories.map((inv) => [`${inv.productId}-${inv.locationId}`, inv])
//       );

//       const inventoryUpdates = [];
//       const auditLogs = [];

//       for (const item of salesOrderLineItems) {
//         const key = `${item.productId}-${item.locationId}`;
//         const inventory = inventoryMap.get(key);

//         if (!inventory) {
//           throw new Error(`Inventory not found for productId ${item.productId} at locationId ${item.locationId}.`);
//         }

//         const oldQuantity = inventory.quantity;
//         const newQuantity = oldQuantity - item.quantity;

//         if (newQuantity < 0) {
//           throw new Error(`Not enough stock for productId ${item.productId} at locationId ${item.locationId}.`);
//         }

//         // Collect inventory update operations
//         inventoryUpdates.push(
//           tx.inventory.update({
//             where: {
//               productId_locationId: {
//                 productId: parseInt(item.productId),
//                 locationId: parseInt(item.locationId),
//               },
//             },
//             data: {
//               quantity: newQuantity,
//               isLowStock: inventory.lowStockLevel !== null && newQuantity < inventory.lowStockLevel,
//             },
//           })
//         );

//         // Collect audit log creation
//         auditLogs.push(
//           prisma.audits.create({
//             data: {
//               action: "Movement",
//               timestamp: new Date(),
//               user: { connect: { id: userId } },
//               inventory: { connect: { inventoryId: inventory.inventoryId } },
//               oldQuantity,
//               newQuantity,
//               movements: {
//                 create: {
//                   quantity: item.quantity,
//                   type: "SALES",
//                   inventory: { connect: { inventoryId: inventory.inventoryId } },
//                 },
//               },
//             },
//           })
//         );
//       }

//       //  inventory updates inside the transaction
//       await Promise.all(inventoryUpdates);

//       // audit logs **outside** the transaction to prevent timeout
//       setTimeout(async () => {
//         await prisma.$transaction(auditLogs);
//       }, 1000); 

//       return await tx.sales.update({
//         where: { saleId: createdSales.saleId },
//         data: {
//           status: "Pending",
//         },
//       });
//     }, { timeout: 10_000 }); 

//     return NextResponse.json(
//       { success: true, message: "Sale order created successfully.", updatedSales, redirectUrl: "/orders-list/salePerson" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error processing the request:", error.message || error);
//     return NextResponse.json({ success: false, error: error.message || "Internal server error." }, { status: 500 });
//   }
// }


export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { customerId, dueDate, totalAmount, orderDate, salesOrderLineItems } = data;

    if (!dueDate || totalAmount === undefined || !Array.isArray(salesOrderLineItems) || salesOrderLineItems.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;

    const updatedSales = await prisma.$transaction(async (tx) => {
      // Create the sales order
      const createdSales = await tx.sales.create({
        data: {
          customerId,
          paymentStatus: "Pending",
          payedAmount: 0.0,
          totalAmount,
          dueDate: new Date(dueDate),
          orderDate: orderDate ? new Date(orderDate) : undefined,
          SalesOrderLineItems: {
            create: salesOrderLineItems.map((item: any) => ({
              productId: parseInt(item.productId),
              locationId: parseInt(item.locationId),
              quantity: item.quantity,
              unitPrice: parseFloat(item.unitPrice),
              totalPrice: parseFloat(item.totalPrice),
            })),
          },
        },
        include: { SalesOrderLineItems: true },
      });

      // // Handle credit balance and transactions if customer exists
      // if (customerId) {
      //   const unpaidAmount = createdSales.totalAmount; // Since payedAmount is 0

      //   // Update or create credit balance
      //   let creditBalance = await tx.creditBalance.findUnique({
      //     where: { customerId },
      //   });

      //   if (creditBalance) {
      //     // Add to existing balance
      //     await tx.creditBalance.update({
      //       where: { id: creditBalance.id },
      //       data: { balance: creditBalance.balance + unpaidAmount },
      //     });
      //   } else {
      //     // Create new balance
      //     creditBalance = await tx.creditBalance.create({
      //       data: {
      //         type: "Customer",
      //         balance: unpaidAmount,
      //         customerId,
      //       },
      //     });
      //   }

      //   // // Create credit transaction
      //   // await tx.creditTransactions.create({
      //   //   data: {
      //   //     type: "Customer",
      //   //     customerId,
      //   //     saleId: createdSales.saleId,
      //   //     amount: unpaidAmount,
      //   //     description: `Sale #${createdSales.saleId} created`,
      //   //     date: new Date(),
      //   //   },
      //   // });
      // }

      // Inventory management 
      const inventoryIds = salesOrderLineItems.map((item) => ({
        productId: parseInt(item.productId),
        locationId: parseInt(item.locationId),
      }));

      const inventories = await tx.inventory.findMany({
        where: { OR: inventoryIds },
      });

      const inventoryMap = new Map(
        inventories.map((inv) => [`${inv.productId}-${inv.locationId}`, inv])
      );

      const inventoryUpdates = [];
      const auditLogs = [];

      for (const item of salesOrderLineItems) {
        const key = `${item.productId}-${item.locationId}`;
        const inventory = inventoryMap.get(key);

        if (!inventory) {
          throw new Error(`Inventory not found for productId ${item.productId} at locationId ${item.locationId}.`);
        }

        const oldQuantity = inventory.quantity;
        const newQuantity = oldQuantity - item.quantity;

        if (newQuantity < 0) {
          throw new Error(`Not enough stock for productId ${item.productId} at locationId ${item.locationId}.`);
        }

        inventoryUpdates.push(
          tx.inventory.update({
            where: { productId_locationId: { 
              productId: parseInt(item.productId), 
              locationId: parseInt(item.locationId) 
            }},
            data: {
              quantity: newQuantity,
              isLowStock: inventory.lowStockLevel !== null && newQuantity < inventory.lowStockLevel,
            },
          })
        );

        auditLogs.push(
          tx.audits.create({
            data: {
              action: "Movement",
              timestamp: new Date(),
              userId: userId,
              inventoryId: inventory.inventoryId,
              oldQuantity,
              newQuantity,
              movements: {
                create: {
                  quantity: item.quantity,
                  type: "SALES",
                  inventoryId: inventory.inventoryId,
                },
              },
            },
          })
        );
      }

      // Execute inventory updates
      await Promise.all(inventoryUpdates);

      // Create audit logs within the same transaction
      await Promise.all(auditLogs);

      return await tx.sales.update({
        where: { saleId: createdSales.saleId },
        data: { status: "Pending" },
      });
    }, { timeout: 20_000 });  // Increased timeout

    return NextResponse.json(
      { 
        success: true, 
        message: "Sale order created successfully.", 
        updatedSales, 
        redirectUrl: "/orders-list/salePerson" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Internal server error." 
      },
      { status: 500 }
    );
  }
}