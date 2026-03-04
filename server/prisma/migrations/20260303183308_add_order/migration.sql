-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER,
    "cartId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "fullPrice" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "deliveryMode" TEXT NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "street" TEXT,
    "house" TEXT,
    "entrance" TEXT,
    "floor" TEXT,
    "apartment" TEXT,
    "intercom" TEXT,
    "scheduledDate" TEXT,
    "scheduledTime" TEXT,
    "restaurantId" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "changeMethod" TEXT NOT NULL,
    "changeFrom" TEXT,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "selectedOptions" TEXT NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
