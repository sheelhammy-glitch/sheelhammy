import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });

// Create PrismaClient with adapter for seed script
const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

let prisma: PrismaClient;

try {
  const url = new URL(connectionString);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    connectionLimit: 10,
    connectTimeout: 30000,
    acquireTimeout: 30000,
    allowPublicKeyRetrieval: true,
  });

  prisma = new PrismaClient({ adapter });
} catch (error) {
  console.error("❌ Error creating Prisma client:", error);
  console.error("Please check your DATABASE_URL in .env file");
  process.exit(1);
}

async function main() {
  console.log("🌱 Starting seed...");

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sheelhammy.com" },
    update: {},
    create: {
      email: "admin@sheelhammy.com",
      password: adminPassword,
      name: "مدير النظام",
      role: Role.ADMIN,
      phone: "0791234567",
      phoneCountryCode: "+962",
      defaultProfitRate: null,
      isActive: true,
    },
  });
  console.log("✅ Admin user created:", admin.email);
  console.log("   Email: admin@sheelhammy.com");
  console.log("   Password: admin123");
 
  const employee1Password = await bcrypt.hash("employee123", 10);
  const employee1 = await prisma.user.upsert({
    where: { email: "employee1@example.com" },
    update: {},
    create: {
      email: "employee1@example.com",
      password: employee1Password,
      name: "موظف تجريبي 1",
      role: Role.EMPLOYEE,
      phone: "0791234568",
      phoneCountryCode: "+962",
      country: "الأردن",
      specialization: "كتابة أبحاث",
      defaultProfitRate: 40,
      isActive: true,
    },
  });
  console.log("✅ Employee 1 created:", employee1.email);
  console.log("   Email: employee1@example.com");
  console.log("   Password: employee123");

  const employee2Password = await bcrypt.hash("employee123", 10);
  const employee2 = await prisma.user.upsert({
    where: { email: "employee2@example.com" },
    update: {},
    create: {
      email: "employee2@example.com",
      password: employee2Password,
      name: "موظف تجريبي 2",
      role: Role.EMPLOYEE,
      phone: "0791234569",
      phoneCountryCode: "+962",
      country: "الأردن",
      specialization: "ترجمة",
      defaultProfitRate: 35,
      isActive: true,
    },
  });
  console.log("✅ Employee 2 created:", employee2.email);

  // Create Referrer Employee
  const referrerPassword = await bcrypt.hash("referrer123", 10);
  const referrer = await prisma.user.upsert({
    where: { email: "referrer@example.com" },
    update: {},
    create: {
      email: "referrer@example.com",
      password: referrerPassword,
      name: "مندوب تجريبي",
      role: Role.EMPLOYEE,
      phone: "0791234570",
      phoneCountryCode: "+962",
      country: "الأردن",
      specialization: "مندوب مبيعات",
      defaultProfitRate: null,
      isActive: true,
      isReferrer: true,
      referrerCode: "REF001",
      commissionRate: 10,
    },
  });
  console.log("✅ Referrer created:", referrer.email);
  console.log("   Referrer Code: REF001");
  console.log("   Commission Rate: 10%");

  // Create Students
  const student1 = await prisma.student.upsert({
    where: { whatsapp: "0791111111" },
    update: {},
    create: {
      name: "أحمد محمد",
      whatsapp: "0791111111",
      email: "ahmed@example.com",
      phoneCountryCode: "+962",
      country: "الأردن",
      academicLevel: "bachelor",
      specialization: "هندسة الحاسوب",
      university: "الجامعة الأردنية",
      notes: "عميل ممتاز، يطلب بانتظام",
    },
  });

  const student2 = await prisma.student.upsert({
    where: { whatsapp: "0792222222" },
    update: {},
    create: {
      name: "فاطمة علي",
      whatsapp: "0792222222",
      email: "fatima@example.com",
      phoneCountryCode: "+962",
      country: "الأردن",
      academicLevel: "master",
      specialization: "الأدب العربي",
      university: "جامعة اليرموك",
    },
  });

  const student3 = await prisma.student.upsert({
    where: { whatsapp: "0793333333" },
    update: {},
    create: {
      name: "خالد حسن",
      whatsapp: "0793333333",
      phoneCountryCode: "+962",
      country: "الأردن",
      academicLevel: "diploma",
      notes: "يطلب خدمات متعددة",
    },
  });
  console.log("✅ Students created");

  // Create Categories
  const category1 = await prisma.category.create({
    data: {
      name: "أبحاث",
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: "ترجمة",
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: "تحرير",
    },
  });
  console.log("✅ Categories created");

  // Create Services
  const service1 = await prisma.service.create({
    data: {
      title: "بحث علمي",
      description: "نقدم خدمة كتابة الأبحاث العلمية بجودة عالية مع توثيق كامل ومراجع موثوقة",
      categoryId: category1.id,
      priceGuideline: 500,
      isActive: true,
      features: JSON.stringify(["توثيق كامل", "مراجع موثوقة", "تدقيق لغوي"]),
      countries: JSON.stringify(["الأردن", "السعودية", "الإمارات"]),
    },
  });

  const service2 = await prisma.service.create({
    data: {
      title: "ترجمة",
      description: "ترجمة دقيقة ومحترفة من وإلى عدة لغات مع الحفاظ على المعنى الأصلي",
      categoryId: category2.id,
      priceGuideline: 300,
      isActive: true,
      features: JSON.stringify(["دقة عالية", "حفظ المعنى", "مراجعة لغوية"]),
      countries: JSON.stringify(["الأردن", "السعودية", "الإمارات"]),
    },
  });

  const service3 = await prisma.service.create({
    data: {
      title: "تحرير",
      description: "تحرير وتدقيق لغوي شامل للمستندات مع تحسين الأسلوب والبنية",
      categoryId: category3.id,
      priceGuideline: 250,
      isActive: true,
      features: JSON.stringify(["تدقيق لغوي", "تحسين الأسلوب", "مراجعة شاملة"]),
      countries: JSON.stringify(["الأردن", "السعودية", "الإمارات"]),
    },
  });
  console.log("✅ Services created");

  // Create Orders
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "#1001",
      studentId: student1.id,
      serviceId: service1.id,
      employeeId: employee1.id,
      status: OrderStatus.IN_PROGRESS,
      totalPrice: 500,
      employeeProfit: 200,
      isPaid: true,
      paymentType: "cash",
      priority: "normal",
      subjectName: "الذكاء الاصطناعي",
      orderType: "بحث علمي",
      description: "بحث عن تطبيقات الذكاء الاصطناعي في التعليم",
      gradeType: "normal",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: "#1002",
      studentId: student2.id,
      serviceId: service2.id,
      employeeId: employee1.id,
      status: OrderStatus.ASSIGNED,
      totalPrice: 300,
      employeeProfit: 120,
      isPaid: false,
      paymentType: "installments",
      paymentInstallments: JSON.stringify([150, 150]),
      priority: "urgent",
      subjectName: "الأدب العربي",
      orderType: "ترجمة",
      description: "ترجمة مقال أكاديمي من الإنجليزية إلى العربية",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: "#1003",
      studentId: student3.id,
      serviceId: service3.id,
      employeeId: employee2.id,
      status: OrderStatus.DELIVERED,
      totalPrice: 250,
      employeeProfit: 100,
      isPaid: true,
      paymentType: "cash",
      discount: 50,
      priority: "normal",
      subjectName: "اللغة العربية",
      orderType: "تحرير",
      description: "تحرير وتدقيق أطروحة ماجستير",
      grade: "M",
      gradeType: "BTEC",
      revisionCount: 1,
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: "#1004",
      studentId: student1.id,
      serviceId: service1.id,
      status: OrderStatus.PENDING,
      totalPrice: 600,
      employeeProfit: 240,
      isPaid: false,
      paymentType: "installments",
      paymentInstallments: JSON.stringify([200, 200, 200]),
      priority: "normal",
      subjectName: "هندسة البرمجيات",
      orderType: "بحث علمي",
      description: "بحث عن منهجيات تطوير البرمجيات",
    },
  });

  // Create order with referrer
  const order5 = await prisma.order.create({
    data: {
      orderNumber: "#1005",
      studentId: student2.id,
      serviceId: service2.id,
      employeeId: employee1.id,
      referrerId: referrer.id,
      referrerCommission: 30, // 10% of 300
      status: OrderStatus.ASSIGNED,
      totalPrice: 300,
      employeeProfit: 120,
      isPaid: true,
      paymentType: "cash",
      priority: "normal",
      subjectName: "الترجمة",
      orderType: "ترجمة",
      description: "ترجمة وثائق أكاديمية",
    },
  });
  console.log("✅ Orders created");

  // Create Transfers
  const transfer1 = await prisma.transfer.create({
    data: {
      employeeId: employee1.id,
      amount: 2000,
      status: "COMPLETED",
    },
  });

  const transfer2 = await prisma.transfer.create({
    data: {
      employeeId: employee1.id,
      amount: 1500,
      status: "COMPLETED",
    },
  });

  const transfer3 = await prisma.transfer.create({
    data: {
      employeeId: employee2.id,
      amount: 1000,
      status: "PENDING",
    },
  });
  console.log("✅ Transfers created");

  // Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: employee1.id,
        orderId: order2.id,
        message: "تم إسناد طلب جديد #1002 لك، الموعد النهائي خلال 5 أيام",
        isRead: false,
      },
      {
        userId: employee1.id,
        orderId: order1.id,
        message: "تذكير: طلب #1001 قيد التنفيذ، الموعد النهائي خلال 7 أيام",
        isRead: false,
      },
      {
        userId: employee1.id,
        message: "تم تحويل مبلغ 2000 د.أ لمحفظتك",
        isRead: true,
      },
    ],
  });
  console.log("✅ Notifications created");

  // Create Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: "أحمد محمد",
        content: "خدمة ممتازة وجودة عالية، أنصح بها بشدة",
        rating: 5,
      },
      {
        clientName: "فاطمة علي",
        content: "تم تسليم العمل في الوقت المحدد وبجودة عالية",
        rating: 5,
      },
      {
        clientName: "خالد حسن",
        content: "خدمة احترافية ومتابعة ممتازة",
        rating: 4,
      },
    ],
  });
  console.log("✅ Testimonials created");

  // Create FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "ما هي مدة التسليم؟",
        answer: "مدة التسليم تختلف حسب نوع الخدمة وحجم العمل، عادة ما تكون بين 3-7 أيام عمل.",
      },
      {
        question: "كيف يمكنني الدفع؟",
        answer: "يمكنك الدفع عبر التحويل البنكي أو المحافظ الإلكترونية المتاحة.",
      },
      {
        question: "هل يمكنني طلب تعديلات؟",
        answer: "نعم، يمكنك طلب تعديلات مجانية خلال 7 أيام من تاريخ التسليم.",
      },
    ],
  });
  console.log("✅ FAQs created");

  // Create Portfolio Items
  await prisma.portfolio.createMany({
    data: [
      {
        title: "بحث علمي في الذكاء الاصطناعي",
        description: "بحث شامل عن تطبيقات الذكاء الاصطناعي في التعليم",
        link: "https://example.com/project-1",
        academicLevel: "master",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        countries: JSON.stringify(["الأردن", "السعودية"]),
      },
      {
        title: "ترجمة كتاب أكاديمي",
        description: "ترجمة كتاب من الإنجليزية إلى العربية",
        academicLevel: "bachelor",
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        countries: JSON.stringify(["الأردن"]),
      },
      {
        title: "تحرير أطروحة ماجستير",
        description: "تحرير وتدقيق أطروحة ماجستير في الأدب العربي",
        link: "https://example.com/project-3",
        academicLevel: "master",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        countries: JSON.stringify(["الأردن", "الإمارات"]),
      },
    ],
  });
  console.log("✅ Portfolio items created");

  // Create Expenses
  await prisma.expense.createMany({
    data: [
      {
        title: "إعلانات فيسبوك",
        amount: 500,
        category: "إعلانات",
        description: "إعلانات شهرية",
      },
      {
        title: "سيرفر",
        amount: 200,
        category: "تقنية",
        description: "اشتراك شهري",
      },
    ],
  });
  console.log("✅ Expenses created");

  // Create Payment Methods
  await prisma.paymentMethod.createMany({
    data: [
      { code: "VODAFONE_CASH", label: "فودافون كاش", enabled: true },
      { code: "INSTAPAY", label: "إنستاباي", enabled: true },
      { code: "ETISALAT_CASH", label: "اتصالات كاش", enabled: false },
      { code: "WE", label: "وي", enabled: false },
      { code: "WESTERN_UNION", label: "ويسترن يونيون", enabled: true },
      { code: "ZAIN_CASH", label: "زين كاش", enabled: true },
      { code: "U_WALLET", label: "يو واليت", enabled: true },
      { code: "MONEYGRAM", label: "مونيجرام", enabled: false },
      { code: "CLIQ", label: "كليك", enabled: true },
      { code: "ARAB_BANK", label: "البنك العربي", enabled: true },
    ],
  });
  console.log("✅ Payment methods created");

  // Create Settings (single record)
  await prisma.settings.upsert({
    where: { id: "settings-1" },
    update: {},
    create: {
      id: "settings-1",
      platformName: "شيل همي",
      platformDescription: "منصة متخصصة في تقديم خدمات أكاديمية ومهنية",
      currency: "JOD",
      workingHoursStart: "09:00",
      workingHoursEnd: "17:00",
      defaultFreeRevisions: 2,
      quoteExpiryHours: 48,
      defaultEmployeeProfitRate: 40,
      autoAssignOrders: false,
      maxOrdersPerEmployee: 10,
      enable2FA: false,
      enableAuditLogs: true,
      rateLimit: 100,
      deadlineReminderHours: 24,
      emailNotifications: true,
      smsNotifications: false,
      whatsappNotifications: true,
      platformFee: 15,
    },
  });
  console.log("✅ Settings created");

  // Create Blog Posts
  const blogPost1 = await prisma.blog.create({
    data: {
      title: "كيفية كتابة بحث علمي ممتاز",
      slug: "how-to-write-excellent-research",
      excerpt: "دليل شامل لكتابة بحث علمي بجودة عالية مع نصائح عملية",
      content: `
        <h2>مقدمة</h2>
        <p>كتابة البحث العلمي تتطلب مهارات خاصة وفهم عميق للموضوع. في هذا المقال سنقدم لك دليل شامل.</p>
        
        <h2>الخطوات الأساسية</h2>
        <ol>
          <li>اختيار الموضوع المناسب</li>
          <li>جمع المراجع الموثوقة</li>
          <li>كتابة الخطة البحثية</li>
          <li>الكتابة والتحرير</li>
          <li>التوثيق والمراجع</li>
        </ol>
        
        <h2>الخلاصة</h2>
        <p>باتباع هذه الخطوات، ستتمكن من كتابة بحث علمي ممتاز.</p>
      `,
      author: "فريق شيل همي",
      isPublished: true,
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      category: "أكاديمي",
      tags: JSON.stringify(["بحث علمي", "أكاديمي", "نصائح"]),
      views: 150,
      seoTitle: "كيفية كتابة بحث علمي - دليل شامل",
      seoDescription: "تعلم كيفية كتابة بحث علمي بجودة عالية مع نصائح عملية وخطوات مفصلة",
    },
  });

  const blogPost2 = await prisma.blog.create({
    data: {
      title: "أهمية الترجمة الدقيقة في الأبحاث الأكاديمية",
      slug: "importance-of-accurate-translation",
      excerpt: "دور الترجمة الدقيقة في نقل المعرفة العلمية بشكل صحيح",
      content: `
        <h2>مقدمة</h2>
        <p>الترجمة الدقيقة تلعب دوراً حيوياً في الأبحاث الأكاديمية.</p>
        
        <h2>أهمية الترجمة</h2>
        <ul>
          <li>نقل المعرفة بدقة</li>
          <li>الحفاظ على المعنى الأصلي</li>
          <li>تسهيل الوصول للمعلومات</li>
        </ul>
        
        <h2>الخلاصة</h2>
        <p>الترجمة الدقيقة ضرورية للبحث العلمي الجيد.</p>
      `,
      author: "فريق شيل همي",
      isPublished: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: "ترجمة",
      tags: JSON.stringify(["ترجمة", "أكاديمي", "بحث"]),
      views: 89,
      seoTitle: "أهمية الترجمة الدقيقة في الأبحاث",
      seoDescription: "اكتشف أهمية الترجمة الدقيقة في الأبحاث الأكاديمية وكيف تؤثر على جودة البحث",
    },
  });

  const blogPost3 = await prisma.blog.create({
    data: {
      title: "نصائح لتحسين جودة الأبحاث الأكاديمية",
      slug: "tips-to-improve-research-quality",
      excerpt: "نصائح عملية لتحسين جودة أبحاثك الأكاديمية",
      content: `
        <h2>مقدمة</h2>
        <p>هناك عدة نصائح يمكن اتباعها لتحسين جودة الأبحاث الأكاديمية.</p>
        
        <h2>النصائح</h2>
        <ol>
          <li>استخدم مصادر موثوقة</li>
          <li>راجع عملك بعناية</li>
          <li>احصل على ملاحظات من الخبراء</li>
        </ol>
      `,
      author: "فريق شيل همي",
      isPublished: false, // Draft
      category: "أكاديمي",
      tags: JSON.stringify(["نصائح", "أكاديمي"]),
      views: 0,
    },
  });
  console.log("✅ Blog posts created");

  console.log("🎉 Seed completed successfully!");
  console.log("\n📋 Summary:");
  console.log("   - 1 Admin user (admin@sheelhammy.com / admin123)");
  console.log("   - 2 Employee users (employee1@example.com / employee123)");
  console.log("   - 1 Referrer (referrer@example.com / referrer123, Code: REF001)");
  console.log("   - 3 Students");
  console.log("   - 3 Categories");
  console.log("   - 3 Services");
  console.log("   - 5 Orders (1 with referrer)");
  console.log("   - 3 Transfers");
  console.log("   - 3 Notifications");
  console.log("   - 3 Testimonials");
  console.log("   - 3 FAQs");
  console.log("   - 3 Portfolio items");
  console.log("   - 2 Expenses");
  console.log("   - 10 Payment methods");
  console.log("   - 1 Settings record");
  console.log("   - 3 Blog posts (2 published, 1 draft)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
