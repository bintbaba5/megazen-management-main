# 🚀 Inventory Management System (IMS)

Welcome to the **Inventory Management System (IMS)**, a modern, feature-rich, and scalable solution designed to streamline inventory, sales, purchases, and credit management for businesses of all sizes. Built with cutting-edge technologies, this system is designed to be fast, reliable, and easy to use.

---

## 🌟 Key Features

### 📦 **Stock Management**

- Track inventory levels in real-time.
- Manage multiple product categories and locations.
- Low stock alerts and automated reordering.

### 💳 **Sales Management**

- Create and manage sales orders.
- Handle partial payments and credit sales.
- Generate invoices and receipts.

### 🛒 **Purchase Management**

- Manage supplier orders and track deliveries.
- Handle partial payments and credit purchases.
- Automate purchase order generation.

### 📊 **Reports & Analytics**

- Generate detailed sales, purchase, and inventory reports.
- Visualize data with charts and graphs.
- Export reports in PDF, CSV, and Excel formats.

### 💳 **Credit Management**

- Track customer and supplier credit balances.
- Manage credit transactions and payments.
- Real-time credit balance updates.

---

## 🛠️ Tools & Technologies

### Frontend

- **Next.js 15**: For building a fast and SEO-friendly frontend.
- **ShadCN UI**: For beautiful, customizable, and accessible UI components.
- **Tailwind CSS**: For utility-first CSS styling.

### Backend

- **Prisma**: For type-safe database access and migrations.
- **PostgreSQL**: For a robust and scalable relational database.
- **Next.js API Routes**: For building RESTful APIs.

### Other Tools

- **TypeScript**: For type-safe development.
- **React Hook Form**: For efficient form management.
- **Chart.js**: For data visualization.
- **Vercel**: For seamless deployment.

---

## 🚀 Modules

### 1. **Stock Management**

- Add, update, and delete products.
- Track stock levels across multiple locations.
- Set low stock alerts.

### 2. **Sales Management**

- Create and manage sales orders.
- Handle partial and full payments.
- Generate invoices and receipts.

### 3. **Purchase Management**

- Manage supplier orders and deliveries.
- Track purchase payments and credits.
- Automate purchase order generation.

### 4. **Reports Module**

- Generate sales, purchase, and inventory reports.
- Visualize data with interactive charts.
- Export reports in multiple formats.

### 5. **Credit Management**

- Track customer and supplier credit balances.
- Manage credit transactions and payments.
- Real-time balance updates.

---

## 🖥️ Screenshots

| **Stock Management**                                 | **Sales Management**                                 |
| ---------------------------------------------------- | ---------------------------------------------------- |
| ![Stock Management](https://via.placeholder.com/400) | ![Sales Management](https://via.placeholder.com/400) |

| **Purchase Management**                                 | **Reports Module**                                 |
| ------------------------------------------------------- | -------------------------------------------------- |
| ![Purchase Management](https://via.placeholder.com/400) | ![Reports Module](https://via.placeholder.com/400) |

---

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/inventory-management-system.git
   ```
2. Navigate to the project directory:

   ```bash

   cd inventory-management-system
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:

   - Create a PostgreSQL database.

   - Update the .env file with your database credentials.

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/your-database-name"
   ```

5. Run migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open your browser and visit:

   ```bash
   http://localhost:3000
   ```

   ***

## 📁 Project Structure

```bash
inventory-management-system/
├── app/
│   ├── api/                  # API routes
│   ├── components/           # Reusable components
│   ├── lib/                  # Utility functions
│   ├── pages/                # Application pages
│   └── styles/               # Global styles
├── prisma/                   # Prisma schema and migrations
├── public/                   # Static assets
├── .env                      # Environment variables
├── .gitignore                # Git ignore file
├── package.json              # Project dependencies
├── README.md                 # Project documentation
└── tsconfig.json             # TypeScript configuration

```

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.

2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:

   ```bash
   git push origin feature/YourFeatureName
   ```

5. Open a pull request.

## 📄 License

```bash
This project is licensed under the MIT License. See the LICENSE file for details.
```

## 🙏 Acknowledgments

```bash

Next.js for providing a powerful framework for building modern web applications.

Prisma for simplifying database access and migrations.

ShadCN for providing beautiful and customizable UI components.
Tailwind CSS for utility-first CSS styling.
Chart.js for data visualization.
Vercel for seamless deployment.
Thank you for checking out the Inventory Management System! 🚀
```

## 📧 Contact

```bash

For any questions or feedback, feel free to reach out:

Email: trisanatechnologies@gmail.com

GitHub: trisana-technologies

LinkedIn: Trisana Technologies

Made with ❤️ by Trisana Technologies
```
