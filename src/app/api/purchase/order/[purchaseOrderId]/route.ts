import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

//yemejeriya yenebere
// export async function PUT(req: Request) {
//   console.log("Updating purchase order...");
//   try {
//     const data = await req.json();
//     const {
//       purchaseId,
//       supplier,
//       totalAmount,
//       paidAmount,
//       orderDate,
//       locationId,
//       purchaseOrderLineItems,
//     } = data;

//     // Validate required fields
//     if (!purchaseId || totalAmount === undefined || paidAmount === undefined) {
//       return NextResponse.json(
//         { error: "Missing required fields: purchaseId, totalAmount, or paidAmount." },
//         { status: 400 }
//       );
//     }

//     const paidAmountFloat = parseFloat(paidAmount);

//     if (isNaN(paidAmountFloat) || paidAmountFloat < 0) {
//       return NextResponse.json(
//         { error: "Invalid paidAmount. It must be a non-negative float." },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(purchaseOrderLineItems) || purchaseOrderLineItems.length === 0) {
//       return NextResponse.json(
//         { error: "Purchase order must have at least one valid line item." },
//         { status: 400 }
//       );
//     }

//     // Validate that the purchase order exists
//     const existingPurchaseOrder = await prisma.purchases.findUnique({
//       where: { purchaseId },
//       include: { PurchaseOrderLineItems: true },
//     });

//     if (!existingPurchaseOrder) {
//       return NextResponse.json(
//         { error: `Purchase order with ID ${purchaseId} not found.` },
//         { status: 404 }
//       );
//     }

//     const deletedLineItems = purchaseOrderLineItems.filter(item => item.deleted);
//     const updatedLineItems = purchaseOrderLineItems.filter(item => !item.deleted);
    
//     let adjustedStatus;
//     if (paidAmountFloat === 0) {
//       adjustedStatus = 'Unpaid';
//     } else if (paidAmountFloat < totalAmount) {
//       adjustedStatus = 'Partial';
//     } else if (paidAmountFloat === totalAmount) {
//       adjustedStatus = 'Paid';
//     }
//     // Update the purchase order
//     const updatedPurchaseOrder = await prisma.purchases.update({
//       where: { purchaseId },
//       data: {
//         supplierName,
//         totalAmount,
//         paidAmount: paidAmountFloat,
//         orderDate: orderDate ? new Date(orderDate) : undefined,
//         status: existingPurchaseOrder.status,
//         paymentStatus: adjustedStatus|| existingPurchaseOrder.paymentStatus,
//         locationId, 
//         PurchaseOrderLineItems: {
//           deleteMany: deletedLineItems.map(item => ({ id: item.id })),
//           updateMany: updatedLineItems
//             .filter(item => item.id) // Only update items with IDs
//             .map(item => ({
//               where: { id: item.id },
//               data: {
//                 productId: item.productId,
//                 quantity: item.quantity,
//                 unitPrice: item.unitPrice,
//                 totalPrice: item.totalPrice,
//               },
//             })),
//           create: updatedLineItems
//             .filter(item => !item.id) // Create new items without IDs
//             .map(item => ({
//               productId: item.productId,
//               quantity: item.quantity,
//               unitPrice: item.unitPrice,
//               totalPrice: item.totalPrice,
//             })),
//         },
//       },
//       include: {
//         PurchaseOrderLineItems: true,
//       },
//     });

//     // Update inventory quantities for updated line items
//     await Promise.all(
//       updatedLineItems.map(async item => {
//         if (item.deleted) return; // Skip deleted items

//         const currentInventory = await prisma.inventory.findFirst({
//           where: { productId: item.productId, locationId },
//         });

//         const previousLineItem = existingPurchaseOrder.PurchaseOrderLineItems.find(
//           lineItem => lineItem.productId === item.productId
//         );

//         const quantityDifference = previousLineItem
//           ? item.quantity - previousLineItem.quantity
//           : item.quantity;

//         if (currentInventory) {
//           await prisma.inventory.update({
//             where: { inventoryId: currentInventory.inventoryId },
//             data: {
//               quantity: currentInventory.quantity + quantityDifference,
//               lastUpdated: new Date(),
//             },
//           });
//         } else {
//           await prisma.inventory.create({
//             data: {
//               productId: item.productId,
//               locationId,
//               quantity: item.quantity,
//               lastUpdated: new Date(),
//             },
//           });
//         }
//       })
//     );

//     // Update inventory for removed line items
//     await Promise.all(
//       deletedLineItems.map(async item => {
//         const currentInventory = await prisma.inventory.findFirst({
//           where: { productId: item.productId, locationId },
//         });

//         if (currentInventory) {
//           await prisma.inventory.update({
//             where: { inventoryId: currentInventory.inventoryId },
//             data: {
//               quantity: currentInventory.quantity - item.quantity,
//               lastUpdated: new Date(),
//             },
//           });
//         }
//       })
//     );

//     return NextResponse.json(
//       { message: "Purchase order and inventory updated successfully.", updatedPurchaseOrder },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating purchase order and inventory:", error);
//     return NextResponse.json(
//       { error: "Failed to update purchase order and inventory. Please try again later." },
//       { status: 500 }
//     );
//   }
// }

//yeneber
// export async function PUT(req: Request) {
//   const session = await auth();
//   const userId = session?.user?.id;
//   try {
//     const data = await req.json();
//     console.log("data: ", data)
//     const {
//       purchaseId, 
//       supplier,    
//       totalAmount,
//       paidAmount,  
//       orderDate,
//       locationId,
//       purchaseOrderLineItems, 
//     } = data;

//     // Validate required fields
//     if (!purchaseId || totalAmount === undefined || paidAmount === undefined) {
//       return NextResponse.json(
//         { error: "Missing required fields: purchaseId, totalAmount, or paidAmount." },
//         { status: 400 }
//       );
//     }

//     const paidAmountFloat = parseFloat(paidAmount);
//     if (isNaN(paidAmountFloat) || paidAmountFloat < 0) {
//       return NextResponse.json(
//         { error: "Invalid paidAmount. It must be a non-negative float." },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(purchaseOrderLineItems) || purchaseOrderLineItems.length === 0) {
//       return NextResponse.json(
//         { error: "Purchase order must have at least one valid line item." },
//         { status: 400 }
//       );
//     }

//     // Fetch existing purchase order
//     const existingPurchaseOrder = await prisma.purchases.findUnique({
//       where: { purchaseId },
//       include: { 
//         PurchaseOrderLineItems: true,
//         supplier: true
//       },
//     });

//     if (!existingPurchaseOrder) {
//       return NextResponse.json(
//         { error: `Purchase order with ID ${purchaseId} not found.` },
//         { status: 404 }
//       );
//     }

//     // Calculate payment difference
//     const paymentDifference = paidAmountFloat - existingPurchaseOrder.paidAmount;
//     const deletedLineItems = purchaseOrderLineItems.filter(item => item.deleted);
//     const updatedLineItems = purchaseOrderLineItems.filter(item => !item.deleted);
    
//     let adjustedStatus;
//     if (paidAmountFloat === 0) {
//       adjustedStatus = 'Unpaid';
//     } else if (paidAmountFloat < totalAmount) {
//       adjustedStatus = 'Partial';
//     } else if (paidAmountFloat === totalAmount) {
//       adjustedStatus = 'Paid';
//     }

//     const result = await prisma.$transaction(async (prisma) => {
//       // Update purchase order
//       const updatedPurchase = await prisma.purchases.update({
//         where: { purchaseId },
//         data: {
//           supplierId: supplier?.id || existingPurchaseOrder.supplierId,
//           totalAmount,
//           paidAmount: paidAmountFloat,
//           orderDate: orderDate ? new Date(orderDate) : undefined,
//           paymentStatus: adjustedStatus || existingPurchaseOrder.paymentStatus,
//           status: 'Received',
//           locationId, 
//           PurchaseOrderLineItems: {
//             deleteMany: deletedLineItems.map(item => ({ id: item.id })),
//             updateMany: updatedLineItems
//               .filter(item => item.id)
//               .map(item => ({
//                 where: { id: item.id },
//                 data: {
//                   productId: item.productId,
//                   quantity: item.quantity,
//                   unitPrice: item.unitPrice,
//                   totalPrice: item.totalPrice,
//                 },
//               })),
//             create: updatedLineItems
//               .filter(item => !item.id)
//               .map(item => ({
//                 productId: item.productId,
//                 quantity: item.quantity,
//                 unitPrice: item.unitPrice,
//                 totalPrice: item.totalPrice,
//               })),
//           },
//         },
//         include: { PurchaseOrderLineItems: true },
//       });

//       // Handle supplier credit balance
//       if (supplier?.id) {
//         if (paymentDifference !== 0) {
//           await prisma.creditTransactions.create({
//             data: {
//               type: "Supplier",
//               supplierId: supplier.id,
//               purchaseId: purchaseId,
//               amount: Math.abs(paymentDifference),
//               description: `${paymentDifference > 0 ? "Payment" : "Adjustment"} for purchase #${purchaseId}`,
//               date: new Date(),
//             },
//           });
//         }

//         const creditBalance = await prisma.creditBalance.findUnique({
//           where: { supplierId: supplier.id },
//         });

//         if (creditBalance) {
//           await prisma.creditBalance.update({
//             where: { supplierId: supplier.id },
//             data: {
              
//               balance: creditBalance.balance - paymentDifference
//             },
//           });
//         } else {
//           await prisma.creditBalance.create({
//             data: {
//               supplierId: supplier.id,
//               type: "Supplier",
//               balance: -paymentDifference, 
//             },
//           });
//         }
//       }

//       return updatedPurchase;
//     });

//     // Inventory updates (reverse logic from sales)
//     await Promise.all(
//       updatedLineItems.map(async item => {
//         if (item.deleted) return;

//         const currentInventory = await prisma.inventory.findFirst({
//           where: { productId: item.productId, locationId: locationId },
//         });

//         const previousLineItem = existingPurchaseOrder.PurchaseOrderLineItems.find(
//           lineItem => lineItem.productId === item.productId
//         );

//         const quantityDifference = previousLineItem
//           ? item.quantity - previousLineItem.quantity
//           : item.quantity;

//         if (currentInventory) {
//           await prisma.inventory.update({
//             where: { inventoryId: currentInventory.inventoryId },
//             data: {
//               quantity: currentInventory.quantity + quantityDifference,
//               lastUpdated: new Date(),
//             },
//           });
//         } else {
//           await prisma.inventory.create({
//             data: {
//               productId: item.productId,
//               locationId: locationId,
//               quantity: item.quantity,
//               lastUpdated: new Date(),
//             },
//           });
//         }
//       })
//     );

//     // Handle deleted line items
//     await Promise.all(
//       deletedLineItems.map(async item => {
//         const currentInventory = await prisma.inventory.findFirst({
//           where: { productId: item.productId, locationId: locationId },
//         });

//         if (currentInventory) {
//           await prisma.inventory.update({
//             where: { inventoryId: currentInventory.inventoryId },
//             data: {
//               quantity: currentInventory.quantity - item.quantity,
//               lastUpdated: new Date(),
//             },
//           });
//         }
//       })
//     );

//     return NextResponse.json(
//       { 
//         message: "Purchase order, inventory, and credit data updated successfully.",
//         updatedPurchaseOrder: result 
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating purchase order:", error);
//     return NextResponse.json(
//       { error: "Failed to update purchase order. Please try again later." },
//       { status: 500 }
//     );
//   }
// }

// final misera new, wedezi temeles
// export async function PUT(req: Request) {
//   const session = await auth();
//   const userId = session?.user?.id;
//   try {
//     const data = await req.json();
//     console.log("data: ", data);
//     const {
//       purchaseId, 
//       supplier,    
//       totalAmount,
//       paidAmount,  
//       orderDate,
//       locationId,
//       purchaseOrderLineItems, 
//     } = data;

//     if (!purchaseId || totalAmount === undefined || paidAmount === undefined) {
//       return NextResponse.json(
//         { error: "Missing required fields: purchaseId, totalAmount, or paidAmount." },
//         { status: 400 }
//       );
//     }

//     const paidAmountFloat = parseFloat(paidAmount);
//     if (isNaN(paidAmountFloat) || paidAmountFloat < 0) {
//       return NextResponse.json(
//         { error: "Invalid paidAmount. It must be a non-negative float." },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(purchaseOrderLineItems) || purchaseOrderLineItems.length === 0) {
//       return NextResponse.json(
//         { error: "Purchase order must have at least one valid line item." },
//         { status: 400 }
//       );
//     }

//     const existingPurchaseOrder = await prisma.purchases.findUnique({
//       where: { purchaseId },
//       include: { 
//         PurchaseOrderLineItems: true,
//         supplier: true
//       },
//     });

//     if (!existingPurchaseOrder) {
//       return NextResponse.json(
//         { error: `Purchase order with ID ${purchaseId} not found.` },
//         { status: 404 }
//       );
//     }

//     const paymentDifference = paidAmountFloat - existingPurchaseOrder.paidAmount;
//     const deletedLineItems = purchaseOrderLineItems.filter(item => item.deleted);
//     const updatedLineItems = purchaseOrderLineItems.filter(item => !item.deleted);
    
//     let adjustedStatus;
//     if (paidAmountFloat === 0) {
//       adjustedStatus = 'Unpaid';
//     } else if (paidAmountFloat < totalAmount) {
//       adjustedStatus = 'Partial';
//     } else if (paidAmountFloat === totalAmount) {
//       adjustedStatus = 'Paid';
//     }

//     const result = await prisma.$transaction(async (prisma) => {
//       const updatedPurchase = await prisma.purchases.update({
//         where: { purchaseId },
//         data: {
//           supplierId: supplier?.id || existingPurchaseOrder.supplierId,
//           totalAmount,
//           paidAmount: paidAmountFloat,
//           orderDate: orderDate ? new Date(orderDate) : undefined,
//           paymentStatus: adjustedStatus || existingPurchaseOrder.paymentStatus,
//           status: 'Received',
//           locationId, 
//           PurchaseOrderLineItems: {
//             deleteMany: deletedLineItems.map(item => ({ id: item.id })),
//             updateMany: updatedLineItems
//               .filter(item => item.id)
//               .map(item => ({
//                 where: { id: item.id },
//                 data: {
//                   productId: item.productId,
//                   quantity: item.quantity,
//                   unitPrice: item.unitPrice,
//                   totalPrice: item.totalPrice,
//                 },
//               })),
//             create: updatedLineItems
//               .filter(item => !item.id)
//               .map(item => ({
//                 productId: item.productId,
//                 quantity: item.quantity,
//                 unitPrice: item.unitPrice,
//                 totalPrice: item.totalPrice,
//               })),
//           },
//         },
//         include: { PurchaseOrderLineItems: true },
//       });

//       const existingSupplierId = existingPurchaseOrder.supplierId;
//       const newSupplierId = supplier?.id || existingSupplierId;

//       if (newSupplierId) {
//         //  Handle supplier change scenario
//         if (existingSupplierId && existingSupplierId !== newSupplierId) {
//           const previousBalance = await prisma.creditBalance.findUnique({
//             where: { supplierId: existingSupplierId }
//           });
//           console.log("previousBalance: ", previousBalance);
//           if (previousBalance) {
//             // Revert previous supplier's balance by adding total paid amount
//             await prisma.creditBalance.update({
//               where: { id: previousBalance.id },
//               data: { balance: previousBalance.balance + existingPurchaseOrder.paidAmount }
//             });

//             // Create reversal transaction
//             await prisma.creditTransactions.create({
//               data: {
//                 type: 'Supplier',
//                 supplierId: existingSupplierId,
//                 amount: existingPurchaseOrder.paidAmount,
//                 description: `Supplier change reversal for purchase #${purchaseId}`,
//                 purchaseId: purchaseId,
//                 date: new Date(),
//               }
//             });
//           }
//         }

//         // Handle new/existing supplier credit updates
//         let creditBalance = await prisma.creditBalance.findUnique({
//           where: { supplierId: newSupplierId }
//         });

//         if (!creditBalance) {
//           // Initial creation with outstanding balance
//           const initialBalance = updatedPurchase.totalAmount - updatedPurchase.paidAmount;
          
//           creditBalance = await prisma.creditBalance.create({
//             data: {
//               type: 'Supplier',
//               balance: initialBalance,
//               supplierId: newSupplierId
//             }
//           });

//           // Create initial adjustment transaction
//           await prisma.creditTransactions.create({
//             data: {
//               type: 'Supplier',
//               supplierId: newSupplierId,
//               purchaseId: purchaseId,
//               amount: initialBalance,
//               description: `Initial balance setup for purchase #${purchaseId}`,
//               date: new Date(),
//             }
//           });
//         } else {
//           // Handle payment changes for existing balance
//           if (paymentDifference !== 0) {
//             const newBalance = creditBalance.balance - paymentDifference;
            
//             await prisma.creditBalance.update({
//               where: { id: creditBalance.id },
//               data: { balance: newBalance }
//             });

//             // Create transaction based on payment type
//             await prisma.creditTransactions.create({
//               data: {
//                 type: "Supplier",
//                 supplierId: newSupplierId,
//                 purchaseId: purchaseId,
//                 amount: Math.abs(paymentDifference),
//                 description: paymentDifference > 0 
//                   ? `Payment received for purchase #${purchaseId}`
//                   : `Credit adjustment for purchase #${purchaseId}`,
//                 date: new Date(),
//               }
//             });
//           }
//         }
//       }

//       return updatedPurchase;
//     });

//     await Promise.all(
//       updatedLineItems.map(async item => {
//         if (item.deleted) return;

//         const currentInventory = await prisma.inventory.findFirst({
//           where: { productId: item.productId, locationId: locationId },
//         });

//         const previousLineItem = existingPurchaseOrder.PurchaseOrderLineItems.find(
//           lineItem => lineItem.productId === item.productId
//         );

//         const quantityDifference = previousLineItem
//           ? item.quantity - previousLineItem.quantity
//           : item.quantity;

//         if (currentInventory) {
//           await prisma.inventory.update({
//             where: { inventoryId: currentInventory.inventoryId },
//             data: {
//               quantity: currentInventory.quantity + quantityDifference,
//               lastUpdated: new Date(),
//             },
//           });
//         } else {
//           await prisma.inventory.create({
//             data: {
//               productId: item.productId,
//               locationId: locationId,
//               quantity: item.quantity,
//               lastUpdated: new Date(),
//             },
//           });
//         }
//       })
//     );

//     // Handle deleted line items
//     await Promise.all(
//       deletedLineItems.map(async item => {
//         const currentInventory = await prisma.inventory.findFirst({
//           where: { productId: item.productId, locationId: locationId },
//         });

//         if (currentInventory) {
//           await prisma.inventory.update({
//             where: { inventoryId: currentInventory.inventoryId },
//             data: {
//               quantity: currentInventory.quantity - item.quantity,
//               lastUpdated: new Date(),
//             },
//           });
//         }
//       })
//     );

//     return NextResponse.json(
//       { 
//         message: "Purchase order, inventory, and credit data updated successfully.",
//         updatedPurchaseOrder: result 
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating purchase order:", error);
//     return NextResponse.json(
//       { error: "Failed to update purchase order. Please try again later." },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  try {
    const data = await req.json();
    console.log("data: ", data);
    const {
      purchaseId,
      supplier,
      totalAmount,
      paidAmount,
      orderDate,
      locationId,
      purchaseOrderLineItems,
    } = data;

    if (!purchaseId || totalAmount === undefined || paidAmount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: purchaseId, totalAmount, or paidAmount." },
        { status: 400 }
      );
    }

    const paidAmountFloat = parseFloat(paidAmount);
    if (isNaN(paidAmountFloat) || paidAmountFloat < 0) {
      return NextResponse.json(
        { error: "Invalid paidAmount. It must be a non-negative float." },
        { status: 400 }
      );
    }

    if (!Array.isArray(purchaseOrderLineItems) || purchaseOrderLineItems.length === 0) {
      return NextResponse.json(
        { error: "Purchase order must have at least one valid line item." },
        { status: 400 }
      );
    }

    const existingPurchaseOrder = await prisma.purchases.findUnique({
      where: { purchaseId },
      include: {
        PurchaseOrderLineItems: true,
        supplier: true,
      },
    });

    if (!existingPurchaseOrder) {
      return NextResponse.json(
        { error: `Purchase order with ID ${purchaseId} not found.` },
        { status: 404 }
      );
    }

    const paymentDifference = paidAmountFloat - existingPurchaseOrder.paidAmount;
    const totalAmountDifference = totalAmount - existingPurchaseOrder.totalAmount;
    const deletedLineItems = purchaseOrderLineItems.filter(item => item.deleted);
    const updatedLineItems = purchaseOrderLineItems.filter(item => !item.deleted);

    let adjustedStatus;
    if (paidAmountFloat === 0) {
      adjustedStatus = 'Unpaid';
    } else if (paidAmountFloat < totalAmount) {
      adjustedStatus = 'Partial';
    } else if (paidAmountFloat === totalAmount) {
      adjustedStatus = 'Paid';
    }

    const result = await prisma.$transaction(async (prisma) => {
      const updatedPurchase = await prisma.purchases.update({
        where: { purchaseId },
        data: {
          supplierId: supplier?.id || existingPurchaseOrder.supplierId,
          totalAmount,
          paidAmount: paidAmountFloat,
          orderDate: orderDate ? new Date(orderDate) : undefined,
          paymentStatus: adjustedStatus || existingPurchaseOrder.paymentStatus,
          status: 'Received',
          locationId,
          PurchaseOrderLineItems: {
            deleteMany: deletedLineItems.map(item => ({ id: item.id })),
            updateMany: updatedLineItems
              .filter(item => item.id)
              .map(item => ({
                where: { id: item.id },
                data: {
                  productId: item.productId,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  totalPrice: item.totalPrice,
                },
              })),
            create: updatedLineItems
              .filter(item => !item.id)
              .map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              })),
          },
        },
        include: { PurchaseOrderLineItems: true },
      });

      const existingSupplierId = existingPurchaseOrder.supplierId;
      const newSupplierId = supplier?.id || existingSupplierId;

      if (newSupplierId) {
        // Handle supplier change scenario
        if (existingSupplierId && existingSupplierId !== newSupplierId) {
          const previousBalance = await prisma.creditBalance.findUnique({
            where: { supplierId: existingSupplierId }
          });

          if (previousBalance) {
            // Revert previous supplier's balance by adding total paid amount
            await prisma.creditBalance.update({
              where: { id: previousBalance.id },
              data: { balance: previousBalance.balance + existingPurchaseOrder.paidAmount }
            });

            // Create reversal transaction
            await prisma.creditTransactions.create({
              data: {
                type: 'Supplier',
                supplierId: existingSupplierId,
                amount: existingPurchaseOrder.paidAmount,
                description: `Supplier change reversal for purchase #${purchaseId}`,
                purchaseId: purchaseId,
                date: new Date(),
              }
            });
          }
        }

        // Handle new/existing supplier credit updates
        let creditBalance = await prisma.creditBalance.findUnique({
          where: { supplierId: newSupplierId }
        });

        if (!creditBalance) {
          // Initial creation with outstanding balance
          const initialBalance = updatedPurchase.totalAmount - updatedPurchase.paidAmount;

          creditBalance = await prisma.creditBalance.create({
            data: {
              type: 'Supplier',
              balance: initialBalance,
              supplierId: newSupplierId
            }
          });

          // Create initial adjustment transaction
          await prisma.creditTransactions.create({
            data: {
              type: 'Supplier',
              supplierId: newSupplierId,
              purchaseId: purchaseId,
              amount: initialBalance,
              description: `Initial balance setup for purchase #${purchaseId}`,
              date: new Date(),
            }
          });
        } else {
          // Handle payment changes and total amount changes for existing balance
          const balanceAdjustment = totalAmountDifference - paymentDifference;
          const newBalance = creditBalance.balance + balanceAdjustment;

          await prisma.creditBalance.update({
            where: { id: creditBalance.id },
            data: { balance: newBalance }
          });

          // Create transaction based on payment type
          await prisma.creditTransactions.create({
            data: {
              type: "Supplier",
              supplierId: newSupplierId,
              purchaseId: purchaseId,
              amount: Math.abs(balanceAdjustment),
              description: balanceAdjustment > 0
                ? `Credit adjustment for purchase #${purchaseId}`
                : `Payment received for purchase #${purchaseId}`,
              date: new Date(),
            }
          });
        }
      }

      return updatedPurchase;
    });

    // Handle inventory updates for updated line items
    await Promise.all(
      updatedLineItems.map(async item => {
        if (item.deleted) return;

        const currentInventory = await prisma.inventory.findFirst({
          where: { productId: item.productId, locationId: locationId },
        });

        const previousLineItem = existingPurchaseOrder.PurchaseOrderLineItems.find(
          lineItem => lineItem.productId === item.productId
        );

        const quantityDifference = previousLineItem
          ? item.quantity - previousLineItem.quantity
          : item.quantity;

        if (currentInventory) {
          await prisma.inventory.update({
            where: { inventoryId: currentInventory.inventoryId },
            data: {
              quantity: currentInventory.quantity + quantityDifference,
              lastUpdated: new Date(),
            },
          });
        } else {
          await prisma.inventory.create({
            data: {
              productId: item.productId,
              locationId: locationId,
              quantity: item.quantity,
              lastUpdated: new Date(),
            },
          });
        }
      })
    );

    // Handle deleted line items
    await Promise.all(
      deletedLineItems.map(async item => {
        const currentInventory = await prisma.inventory.findFirst({
          where: { productId: item.productId, locationId: locationId },
        });

        if (currentInventory) {
          await prisma.inventory.update({
            where: { inventoryId: currentInventory.inventoryId },
            data: {
              quantity: currentInventory.quantity - item.quantity,
              lastUpdated: new Date(),
            },
          });
        }
      })
    );

    return NextResponse.json(
      {
        message: "Purchase order, inventory, and credit data updated successfully.",
        updatedPurchaseOrder: result
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating purchase order:", error);
    return NextResponse.json(
      { error: "Failed to update purchase order. Please try again later." },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const purchaseId = parseInt(url.pathname.split("/").pop() || "", 10);

  if (isNaN(purchaseId)) {
    return NextResponse.json({ error: "Invalid purchase ID format." }, { status: 400 });
  }

  const result = await prisma.$transaction(async (prisma) => {
    const purchaseOrder = await prisma.purchases.findUnique({
      where: { purchaseId },
      include: { 
        PurchaseOrderLineItems: true, 
        supplier: true, 
      },
    });

    if (!purchaseOrder) {
      throw new Error("Purchase order not found.");
    }

    const { supplierId, totalAmount, paidAmount, paymentStatus } = purchaseOrder;

    for (const lineItem of purchaseOrder.PurchaseOrderLineItems) {
      await prisma.inventory.update({
        where: { 
          productId_locationId: { 
            productId: lineItem.productId, 
            locationId: purchaseOrder.locationId 
          } 
        },
        data: { quantity: { decrement: lineItem.quantity } }, 
      });
    }

   
    if (supplierId) {
      const creditBalance = await prisma.creditBalance.findUnique({
        where: { supplierId },
      });

      if (creditBalance) {
        let balanceAdjustment = 0;

        // Calculate the unpaid portion of the purchase
        balanceAdjustment = totalAmount - paidAmount;

        // Update the supplier's credit balance(DECREASE the balance)
        await prisma.creditBalance.update({
          where: { supplierId },
          data: { balance: { decrement: balanceAdjustment } },
        });

        // Create a credit transaction to record the reversal
        await prisma.creditTransactions.create({
          data: {
            type: 'Supplier',
            supplierId,
            amount: balanceAdjustment,
            description: `Reversal of unpaid credit from deleted purchase #${purchaseId}`,
            purchaseId: purchaseId,
            date: new Date(),
          },
        });
      }
    }

    await prisma.purchaseOrderLineItems.deleteMany({
      where: { purchaseOrderId: purchaseId },
    });

    await prisma.purchases.delete({
      where: { purchaseId },
    });

    return { message: "Purchase order, line items, and credit adjustments handled successfully." };
  });

  return NextResponse.json(result);
}