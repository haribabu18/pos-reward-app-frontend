import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconPlus,
  IconSearch,
  IconTrash,
  IconCash,
  IconCreditCard,
  IconCurrencyRupee,
  IconMinus,
} from "@tabler/icons-react";

// Define types
interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  user: {
    phoneNumber: string;
  };
  rewardPoints: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductFormData {
  store: string;
  name: string;
  price: number;
}

interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: number;
  customerId: number;
  storeId: number;
  amount: number;
  date: string;
}

async function fetchCustomerData() {
  const token = localStorage.getItem("token");
  const storeId = localStorage.getItem("store");

  const response = await axios.get(`http://localhost:8081/api/customers/details/${storeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}

async function fetchProductData() {
  const token = localStorage.getItem("token");

  const response = await axios.get("http://localhost:8081/api/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

async function fetchTransactionsData() {
  const token = localStorage.getItem("token");
  const storeId = localStorage.getItem("store");

  const response = await axios.get(
    `http://localhost:8081/api/transactions/store/${storeId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
}

const AddSale: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Select customer/products, Step 2: Review/payment
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [rewardPercentage, setRewardPercentage] = useState(5); // Default 5% for regular customers
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const [storeId, setStoreId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Fetch customers, products, and transactions

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStoreId(localStorage.getItem("store") || "");
        setToken(localStorage.getItem("token") || "");
      } catch (err) {}
    };
    fetchData();
  }, []);

  const addProduct = async (product: ProductFormData) => {
    console.log("Product:", product);
    console.log("Token:", token);
    console.log("Store ID:", storeId);

    const response = await axios.post(
      "http://localhost:8081/api/products",
      product,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token if authentication is required
        },
      }
    );
    return response.data;
  };

  // Fetch customers, products, and transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await fetchCustomerData();
        const productsResponse = await fetchProductData();
        const transactionsResponse = await fetchTransactionsData();

        setCustomers(customersResponse);
        setProducts(productsResponse);
        setTransactions(transactionsResponse);
        
        console.log("Transactions:", transactionsResponse);
        // Initially show up to 5 products
        setFilteredProducts(productsResponse.slice(0, 5));
      } catch (err) {
        setError("Failed to load data. Using mock data.");
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Search customers by phone number
  useEffect(() => {
    if (customerSearch) {
      const filtered = customers.filter((customer) =>
        customer.user.phoneNumber.includes(customerSearch)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [customerSearch, customers]);

  // Search products by name
  useEffect(() => {
    if (productSearch) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products.slice(0, 5));
    }
  }, [productSearch, products]);

  // Calculate total amount and discount
  const totalAmountBeforeDiscount = saleItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const maxDiscountFromPoints = totalAmountBeforeDiscount * 0.1; // 10% of total amount
  const discountFromPoints = pointsToRedeem; // 1 point = ₹1 discount
  let discountPercentage = 0;

  // Determine discount based on customer status
  if (selectedCustomer) {
    const customerTransactions = transactions.filter(
      (txn) => txn.customerId === selectedCustomer.id && txn.storeId === Number(storeId)
    );
    if (customerTransactions.length === 0) {
      discountPercentage = 15; // 15% discount for new customers to the store
    }
  }

  const discountFromPercentage =
    (totalAmountBeforeDiscount * discountPercentage) / 100;
  const totalDiscount = discountFromPoints + discountFromPercentage;
  const totalAmount = totalAmountBeforeDiscount - totalDiscount;
  const rewardsGiven = (totalAmount * rewardPercentage) / 100;

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setSaleItems([
      ...saleItems,
      { productId, quantity: 1, price: product.price },
    ]);
    setProductSearch("");
    setFilteredProducts(products.slice(0, 5));
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, delta: number) => {
    const newSaleItems = [...saleItems];
    newSaleItems[index].quantity = Math.max(
      1,
      newSaleItems[index].quantity + delta
    );
    setSaleItems(newSaleItems);
  };

  // Remove sale item
  const removeSaleItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  // Create new customer
  const handleCreateCustomer = async () => {
    try {
      const response = await axios.post("http://localhost:8081/api/customers", {
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        phoneNumber: newCustomer.phoneNumber,
        rewardPoints: 0,
      });
      const newCustomerData = {
        ...response.data,
        id: `NEW_${response.data.id}`,
      };
      setCustomers([...customers, newCustomerData]);
      setSelectedCustomer(newCustomerData);
      setIsNewCustomerModalOpen(false);
      setNewCustomer({ firstName: "", lastName: "", phoneNumber: "" });
    } catch (err) {
      setError("Failed to create customer. Please try again.");
      console.error("Error creating customer:", err);
    }
  };

  // Create new product
  const handleCreateProduct = async () => {
    try {
      const response = await addProduct({
        store: storeId || '',
        name: newProduct.name,
        price: newProduct.price,
      });
      const newProductData = {
        id: response.id,
        name: response.name,
        price: response.price,
        sku: response.sku,
      }
      console.log("New product data:", newProductData);
      const productsResponse = await fetchProductData();
      setProducts(productsResponse);

      // setProducts([...products, newProductData]);
      // setFilteredProducts([...filteredProducts, newProductData]);
      // // Automatically select the new product in the first available sale item
      // const firstEmptyItemIndex = saleItems.findIndex(
      //   (item) => !item.productId
      // );
      // if (firstEmptyItemIndex !== -1) {
      //   handleProductChange(firstEmptyItemIndex, newProductData.id);
      // }
      setIsNewProductModalOpen(false);
      setNewProduct({ name: "", price: 0});
    } catch (err) {
      setError("Failed to create product. Please try again.");
      console.error("Error creating product:", err);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedCustomer || saleItems.length === 0) {
      setError("Please select a customer and add at least one product.");
      return;
    }

    const saleData = {
      storeId,
      customerId: selectedCustomer.id,
      totalAmount: Math.floor(totalAmount),
      paidVia: paymentMethod,
      items: saleItems,      
      pointsEarned: Math.floor(rewardsGiven),
      discountApplied: Math.floor(totalDiscount),
      pointsRedeemed: Math.floor(pointsToRedeem),
      
    };

    console.log("Sale data:", saleData);

    try {
      const response = await axios.post("http://localhost:8081/api/transactions", saleData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Sale created:", response.data);
      navigate("/shopkeeper/sales");
    } catch (err) {
      setError("Failed to create sale. Please try again.");
      console.error("Error creating sale:", err);
    }
  };

  return (
    <Dialog open onOpenChange={() => navigate("/shopkeeper/sales")}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new transaction.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-destructive mb-4">{error}</p>}

        {step === 1 ? (
          // Step 1: Select Customer and Products
          <div className="space-y-6">
            {/* Customer Search and Selection */}
            <div>
              <Label className="block text-sm font-medium text-foreground mb-1">
                Select customer
              </Label>
              <div className="relative">
                <Input
                  placeholder="7654"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pr-10"
                />
                <IconSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewCustomerModalOpen(true)}
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  New
                </Button>
              </div>
              {filteredCustomers.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-border rounded-md">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-3 flex items-center justify-between cursor-pointer hover:bg-muted ${
                        selectedCustomer?.id === customer.id
                          ? "bg-blue-100"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch("");
                        setFilteredCustomers([]);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedCustomer?.id === customer.id}
                        />
                        <span>
                          {customer.firstName} {customer.lastName}, Reward
                          Points: {customer.rewardPoints}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {customerSearch && filteredCustomers.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  No customers found.
                </p>
              )}
              {selectedCustomer && (
                <p className="text-sm text-foreground mt-2">
                  Selected: {selectedCustomer.firstName}{" "}
                  {selectedCustomer.lastName}, Reward Points:{" "}
                  {selectedCustomer.rewardPoints}
                </p>
              )}
            </div>

            {/* Products */}
            <div>
              <Label className="block text-sm font-medium text-foreground mb-1">
                Products
              </Label>
              <div className="relative">
                <Input
                  placeholder="Search By Name"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pr-10"
                />
                <IconSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {filteredProducts.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-border rounded-md">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 cursor-pointer hover:bg-muted"
                      onClick={() => handleProductSelect(product.id)}
                    >
                      {product.name} (₹{product.price})
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewProductModalOpen(true)}
                >
                  <IconPlus className="h-4 w-4 mr-1" />
                  Add Product
                </Button>
              </div>
              {saleItems.length > 0 && (
                <div className="mt-4 space-y-2">
                  {saleItems.map((item, index) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-md"
                      >
                        <span>{product?.name}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(index, -1)}
                          >
                            <IconMinus/>
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity.toString().padStart(2, "0")}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(index, 1)}
                          >
                            <IconPlus/>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSaleItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => navigate("/shopkeeper/sales")}
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedCustomer || saleItems.length === 0}
              >
                Next step
              </Button>
            </div>
          </div>
        ) : (
          // Step 2: Review and Payment
          <div className="space-y-6">
            {/* Customer */}
            <div>
              <Label className="block text-sm font-medium text-foreground mb-1">
                Customer
              </Label>
              <p className="text-foreground">
                {selectedCustomer?.firstName} {selectedCustomer?.lastName},{" "}
                {selectedCustomer?.user.phoneNumber}
              </p>
            </div>

            {/* Products */}
            <div>
              <Label className="block text-sm font-medium text-foreground mb-1">
                Products
              </Label>
              <div className="space-y-2">
                {saleItems.map((item, index) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-md"
                    >
                      <span>
                        {product?.name} (₹{product?.price.toLocaleString()})
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{item.quantity.toString().padStart(2, "0")}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSaleItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward Points Redemption */}
            {selectedCustomer && selectedCustomer.rewardPoints > 0 && (
              <div>
                <Label className="block text-sm font-medium text-foreground mb-1">
                  Select Rewards
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Available: {selectedCustomer.rewardPoints}, Max:{" "}
                  {maxDiscountFromPoints.toLocaleString()}
                </p>
                <Slider
                  value={[pointsToRedeem]}
                  onValueChange={(value: number[]) =>
                    setPointsToRedeem(value[0])
                  }
                  max={Math.min(
                    selectedCustomer.rewardPoints,
                    maxDiscountFromPoints
                  )}
                  min={0}
                  step={1}
                  className="mb-2"
                />
                <p className="text-sm text-foreground">{pointsToRedeem}</p>
              </div>
            )}

            {/* Price Details */}
            <div>
              <Label className="block text-sm font-medium text-foreground mb-1">
                Price Details
              </Label>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Sub total</span>
                  <span>₹{totalAmountBeforeDiscount.toLocaleString()}</span>
                </div>
                {discountFromPoints > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Redeem coins</span>
                    <span>-₹{discountFromPoints.toLocaleString()}</span>
                  </div>
                )}
                {discountFromPercentage > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>-₹{discountFromPercentage.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-yellow-500">
                  Earning {rewardsGiven.toLocaleString()} Rewards on this
                  transaction
                </p>
              </div>
            </div>

            {/* Payment Options */}
            <div>
              <Label className="block text-sm font-medium text-foreground mb-1">
                Pay Via
              </Label>
              <div className="flex gap-2">
                <Button
                  variant={paymentMethod === "Cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("Cash")}
                >
                  <IconCash className="h-4 w-4 mr-1" />
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === "UPI" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("UPI")}
                >
                  UPI
                </Button>
                <Button
                  variant={paymentMethod === "Card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("Card")}
                >
                  <IconCreditCard className="h-4 w-4 mr-1" />
                  Card
                </Button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!paymentMethod}>
                Create transaction
              </Button>
            </div>
          </div>
        )}

        {/* New Customer Modal */}
        <Dialog
          open={isNewCustomerModalOpen}
          onOpenChange={setIsNewCustomerModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Customer</DialogTitle>
              <DialogDescription>
                Enter the details of the new customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={newCustomer.firstName}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={newCustomer.lastName}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, lastName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={newCustomer.phoneNumber}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={handleCreateCustomer} className="w-full">
                Create Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* New Product Modal */}
        <Dialog
          open={isNewProductModalOpen}
          onOpenChange={setIsNewProductModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>
                Enter the details of the new product.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Name</Label>
                <Input
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <Button onClick={handleCreateProduct} className="w-full">
                Create Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default AddSale;
