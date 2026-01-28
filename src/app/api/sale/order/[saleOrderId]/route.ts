import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

// export async function PUT(req: Request) {
//   try {
//     const data = await req.json();
//     const { saleId, customerName, customerContact, dueDate, totalAmount, salesOrderLineItems } =
//     data;

//     if (!saleId || totalAmount === undefined) {
//       return NextResponse.json(
//         { error: "Missing required fields." },
//         { status: 400 }
//       );
//     }

//     // Update sale order details without payment information
//     const updatedSale = await prisma.sales.update({
//       where: { saleId },
//       data: {
//         customerName,
//         customerContact,
//         dueDate: dueDate ? new Date(dueDate) : undefined,
//         totalAmount,
//         SalesOrderLineItems: {
//           deleteMany: {}, // Deletes all existing line items for the sale
//           create: salesOrderLineItems.map((item: any) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             totalPrice: item.totalPrice,
//           })),
//         },
//       },
//       include: {
//         SalesOrderLineItems: true,
//       },
//     });

//     return NextResponse.json(
//       { message: "Sale order updated successfully.", updatedSale },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating sale order:", error);
//     return NextResponse.json(
//       { error: "Failed to update sale order. Please try again later." },
//       { status: 500 }
//     );
//   }
// }


// export async function PUT(request: Request) {
//   try {
//     const saleId = request.url.split("/").pop();
//     const saleData = await request.json();

//     if (!saleData || !saleId) {
//       return new NextResponse("Invalid payload", { status: 400 });
//     }

//     const updatedSale = await prisma.sales.update({
//       where: { saleId: parseInt(saleId) },
//       data: {
//         customerName: saleData.customerName,
//         customerContact: saleData.customerContact,
//         totalAmount: saleData.totalAmount,
//         payedAmount: saleData.payedAmount,
//         orderDate: new Date(saleData.orderDate),
//         dueDate: new Date(saleData.dueDate),
//         SalesOrderLineItems: {
//           update: saleData.salesOrderLineItems.map((item: any) => ({
//             where: { id: item.id },
//             data: {
//               quantity: item.quantity,
//               unitPrice: item.unitPrice,
//               totalPrice: item.totalPrice,
//               locationId: item.locationId,
//             },
//           })),
//         },
//       },
//       include: {
//         SalesOrderLineItems: true,
//       },
//     });

//     return NextResponse.json(updatedSale);
//   } catch (error) {
//     console.error("Error updating sale:", error);
//     return new NextResponse("Failed to update sale", { status: 500 });
//   }
// }

export async function PUT(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  try {
    const data = await req.json();
    const { saleId, customer, totalAmount, payedAmount, orderDate, dueDate, paymentStatus, salesOrderLineItems } = data;

    
    if (!saleId || totalAmount === undefined || payedAmount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: saleId, totalAmount, or payedAmount." },
        { status: 400 }
      );
    }

    const payedAmountFloat = parseFloat(payedAmount);
    if (isNaN(payedAmountFloat) || payedAmountFloat < 0) {
      return NextResponse.json(
        { error: "Invalid payedAmount. It must be a non-negative float." },
        { status: 400 }
      );
    }

    if (!Array.isArray(salesOrderLineItems) || salesOrderLineItems.length === 0) {
      return NextResponse.json(
        { error: "Sales order must have at least one valid line item." },
        { status: 400 }
      );
    }

    const existingSalesOrder = await prisma.sales.findUnique({
      where: { saleId },
      include: { 
        SalesOrderLineItems: true,
        customer: true 
      },
    });

    if (!existingSalesOrder) {
      return NextResponse.json(
        { error: `Sales order with ID ${saleId} not found.` },
        { status: 404 }
      );
    }

    const deletedLineItems = salesOrderLineItems.filter(item => item.deleted);
    const updatedLineItems = salesOrderLineItems.filter(item => !item.deleted);
    
    const result = await prisma.$transaction(async (prisma) => {
      const updatedSalesOrder = await prisma.sales.update({
        where: { saleId },
        data: {
          customerId: customer?.id || existingSalesOrder.customerId, 
          totalAmount,
          payedAmount: payedAmountFloat,
          orderDate: orderDate ? new Date(orderDate) : undefined,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          status: existingSalesOrder.status,
          paymentStatus: existingSalesOrder.paymentStatus,
          SalesOrderLineItems: {
            deleteMany: deletedLineItems.map(item => ({ id: item.id })),
            updateMany: updatedLineItems
              .filter(item => item.id)
              .map(item => ({
                where: { id: item.id },
                data: {
                  productId: item.productId,
                  locationId: item.locationId,
                  quantity: item.quantity,
                  unitPrice: item.unitPrice,
                  totalPrice: item.totalPrice,
                },
              })),
            create: updatedLineItems
              .filter(item => !item.id)
              .map(item => ({
                productId: item.productId,
                locationId: item.locationId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              })),
          },
        },
        include: { SalesOrderLineItems: true },
      });
        

      return updatedSalesOrder;
          });

      // Update inventory quantities for updated line items
      await Promise.all(
        updatedLineItems.map(async item => {
          if (item.deleted) return; 
    
          const currentInventory = await prisma.inventory.findFirst({
            where: { productId: item.productId, locationId: item.locationId },
          });
    
          const previousLineItem = existingSalesOrder.SalesOrderLineItems.find(
            lineItem => lineItem.productId === item.productId
          );
    
          const quantityDifference = previousLineItem
            ? item.quantity - previousLineItem.quantity
            : item.quantity;
    
          if (currentInventory) {
            await prisma.inventory.update({
              where: { inventoryId: currentInventory.inventoryId },
              data: {
                quantity: currentInventory.quantity - quantityDifference,
                lastUpdated: new Date(),
              },
            });
          } else {
            await prisma.inventory.create({
              data: {
                productId: item.productId,
                locationId: item.locationId,
                quantity: item.quantity,
                lastUpdated: new Date(),
              },
            });
          }
        })
      );
    
      await Promise.all(
        deletedLineItems.map(async item => {
          const currentInventory = await prisma.inventory.findFirst({
            where: { productId: item.productId, locationId: item.locationId },
          });
    
          if (currentInventory) {
            await prisma.inventory.update({
              where: { inventoryId: currentInventory.inventoryId },
              data: {
                quantity: currentInventory.quantity + item.quantity,
                lastUpdated: new Date(),
              },
            });
          }
        })
      );
    
    return NextResponse.json(
      { 
        message: "Sales order and inventory data updated successfully.",
        updatedSalesOrder: result 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating sales order:", error);
    return NextResponse.json(
      { error: "Failed to update sales order. Please try again later." },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  const saleId = parseInt(req.url.split("/").pop() || "", 10);
console.log(saleId);
  // Validate saleId
  if (!saleId || isNaN(Number(saleId))) {
    return NextResponse.json({ error: "Invalid sale ID provided" }, { status: 400 });
  }

  const parsedSaleId = Number(saleId);

  try {
    // Fetch the sale to verify its existence and status
    const sale = await prisma.sales.findUnique({
      where: { saleId: parsedSaleId },
    });

    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    if (sale.status === "Completed") {
      return NextResponse.json(
        { error: "Completed sales cannot be deleted." },
        { status: 400 }
      );
    }

    // Delete associated line items first
    await prisma.salesOrderLineItems.deleteMany({
      where: { salesOrderId: parsedSaleId },
    });

    // Delete the sale record
    await prisma.sales.delete({
      where: { saleId: parsedSaleId },
    });

    return NextResponse.json({ message: "Sale deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json(
      { error: "Failed to delete sale. Please try again later." },
      { status: 500 }
    );
  }
}