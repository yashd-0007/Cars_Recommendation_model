const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dealers = [
  {
    name: "DreamDrive Elite Motors - Delhi",
    city: "Delhi",
    address: "123 Safdarjung Enclave, New Delhi, 110029",
    phone: "+91 98765 43210",
    workingHours: "10:00 AM - 08:00 PM",
    supportedBrands: JSON.stringify(["BMW", "Mercedes-Benz", "Audi", "Porsche", "Lamborghini", "Tata", "Mahindra", "Hyundai"]),
    rating: 4.8
  },
  {
    name: "AutoSphere Luxury Hub",
    city: "Mumbai",
    address: "45 Worli Sea Face, Mumbai, Maharashtra 400030",
    phone: "+91 91234 56780",
    workingHours: "09:30 AM - 07:30 PM",
    supportedBrands: JSON.stringify(["Mercedes-Benz", "Porsche", "Ferrari", "BMW"]),
    rating: 4.9
  },
  {
    name: "City Auto Mall",
    city: "Bangalore",
    address: "88 Indiranagar 100 Ft Road, Bengaluru, Karnataka 560038",
    phone: "+91 99887 76655",
    workingHours: "10:00 AM - 07:00 PM",
    supportedBrands: JSON.stringify(["Tata", "Mahindra", "Hyundai", "Kia", "Toyota"]),
    rating: 4.5
  },
  {
    name: "Prime Cars Chennai",
    city: "Chennai",
    address: "71 Mount Road, Anna Salai, Chennai, Tamil Nadu 600002",
    phone: "+91 88776 65544",
    workingHours: "10:00 AM - 08:00 PM",
    supportedBrands: JSON.stringify(["Hyundai", "Kia", "Honda", "BMW", "Audi"]),
    rating: 4.6
  },
  {
    name: "Apex Motors Pune",
    city: "Pune",
    address: "12 KP Road, Koregaon Park, Pune, Maharashtra 411001",
    phone: "+91 77665 54433",
    workingHours: "10:30 AM - 08:30 PM",
    supportedBrands: JSON.stringify(["Tata", "Mahindra", "Toyota", "Jeep"]),
    rating: 4.4
  },
  {
    name: "Horizon EV Hub",
    city: "Hyderabad",
    address: "Jubilee Hills Check Post Road, Hyderabad, Telangana 500033",
    phone: "+91 99988 77766",
    workingHours: "10:00 AM - 09:00 PM",
    supportedBrands: JSON.stringify(["Tata", "BYD", "Hyundai", "MG", "Kia"]),
    rating: 4.7
  }
];

async function seed() {
  console.log("Seeding dealers...");
  for (const dealer of dealers) {
    const existing = await prisma.dealer.findFirst({
      where: { name: dealer.name }
    });
    
    if (!existing) {
      await prisma.dealer.create({
        data: dealer
      });
      console.log(`Created dealer: ${dealer.name}`);
    } else {
      console.log(`Dealer ${dealer.name} already exists.`);
    }
  }
  console.log("Dealer seeding complete!");
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
