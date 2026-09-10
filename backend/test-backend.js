import { validateBuild } from './utils/compatibilityEngine.js';

async function runTests() {
  console.log('=== RUNNING CARTVERSE FULL BACKEND INTEGRATION TEST SUITE ===\n');

  try {
    // 1. Health Check
    console.log('1. Health Check Endpoint (/api/health)...');
    const healthRes = await fetch('http://localhost:5000/api/health');
    const healthData = await healthRes.json();
    console.log('   Status:', healthData.status, '| Uptime:', healthData.uptime);
    if (healthRes.status !== 200 || healthData.status !== 'online') {
      throw new Error('Health check failed');
    }
    console.log('   ✅ Health check passed!\n');

    // 2. User Login
    console.log('2. Testing User Login (/api/auth/login)...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'prithvi@cartverse.in', password: 'password123' }),
    });
    const loginData = await loginRes.json();
    if (!loginData.token) {
      throw new Error('Login failed to return token');
    }
    const token = loginData.token;
    console.log(`   Logged in user: ${loginData.user?.name} (Admin: ${loginData.user?.isAdmin})`);
    console.log('   ✅ Auth Login passed!\n');

    // 3. Saved Builds Flow (/api/builds)
    console.log('3. Testing Saved Builds API (/api/builds)...');
    const sampleBuildComponents = {
      cpu: { id: 'cpu-1', name: 'Intel Core i9-14900K', price: 54999, specs: { socket: 'LGA1700', tdp: 253 } },
      motherboard: { id: 'mobo-1', name: 'ASUS ROG MAXIMUS Z790', price: 62999, specs: { socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX' } },
      ram: { id: 'ram-1', name: 'Corsair Dominator 64GB', price: 24999, specs: { ramType: 'DDR5' } },
      gpu: { id: 'gpu-1', name: 'NVIDIA RTX 4090 24GB', price: 189999, specs: { tdp: 450, gpuLengthMm: 304 } },
      cabinet: { id: 'case-1', name: 'Lian Li O11D EVO', price: 16999, specs: { maxGpuLengthMm: 426, supportedFormFactors: ['ATX'] } },
      psu: { id: 'psu-1', name: 'Corsair RM1000x', price: 18999, specs: { wattage: 1000 } },
    };

    const createBuildRes = await fetch('http://localhost:5000/api/builds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Flagship Apex Rig 2026',
        components: sampleBuildComponents,
        isPublic: true,
      }),
    });
    const savedBuildData = await createBuildRes.json();
    console.log(`   Saved Build Slug: ${savedBuildData.shareSlug} | Price: ₹${savedBuildData.totalPrice} | Wattage: ${savedBuildData.totalWattage}W`);
    if (createBuildRes.status !== 201 || !savedBuildData.shareSlug) {
      throw new Error('Failed to create saved build');
    }

    // Retrieve saved build by slug
    const getBuildRes = await fetch(`http://localhost:5000/api/builds/${savedBuildData.shareSlug}`);
    const getBuildData = await getBuildRes.json();
    if (getBuildRes.status !== 200 || getBuildData.name !== 'Flagship Apex Rig 2026') {
      throw new Error('Failed to retrieve saved build by slug');
    }
    console.log('   ✅ Saved Builds CRUD & Slug generation passed!\n');

    // 4. Cart Server Sync & Coupon Apply (/api/cart)
    console.log('4. Testing Server-Persisted Cart & Coupon Engine (/api/cart)...');
    const syncCartRes = await fetch('http://localhost:5000/api/cart/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [
          { name: 'NVIDIA RTX 4090', price: 189999, quantity: 1, image: 'GPU/NVIDIA/RTX_4090.jpg' },
          { name: 'Intel Core i9-14900K', price: 54999, quantity: 1, image: 'CPU_Image/INTEL/i9.jpg' },
        ],
      }),
    });
    const syncedCartData = await syncCartRes.json();
    console.log(`   Cart Subtotal: ₹${syncedCartData.subtotal} | Tax: ₹${syncedCartData.tax} | Total: ₹${syncedCartData.total}`);

    // Apply Coupon CART10 (10% off)
    const couponRes = await fetch('http://localhost:5000/api/cart/coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: 'CART10' }),
    });
    const couponData = await couponRes.json();
    console.log(`   Coupon Response: ${couponData.message} | Discount: ${couponData.cart?.coupon?.discountPercent}%`);
    if (couponRes.status !== 200 || couponData.cart?.coupon?.discountPercent !== 10) {
      throw new Error('Failed to apply coupon');
    }
    console.log('   ✅ Cart synchronization & coupon engine passed!\n');

    // 5. Razorpay Payments Integration (/api/payments)
    console.log('5. Testing Razorpay Payments Gateway (/api/payments)...');
    const paymentOrderRes = await fetch('http://localhost:5000/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    const paymentOrderData = await paymentOrderRes.json();
    console.log(`   Created Razorpay Order ID: ${paymentOrderData.razorpayOrderId} | Amount: ${paymentOrderData.amount} paise (₹${paymentOrderData.grandTotal})`);
    if (!paymentOrderData.razorpayOrderId) {
      throw new Error('Failed to create Razorpay payment order');
    }

    // Verify Payment & Generate Order
    const verifyRes = await fetch('http://localhost:5000/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: paymentOrderData.razorpayOrderId,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: 'test_signature_mock',
        shippingAddress: {
          name: 'Prithvi Kiran',
          phone: '+91 98765 43210',
          email: 'prithvi@cartverse.in',
          address: '#144, 100ft Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
        },
        orderItems: [
          { name: 'NVIDIA RTX 4090', price: 189999, qty: 1, image: 'GPU/NVIDIA/RTX_4090.jpg', product: '6aa1959be2efef618c4e912f' },
        ],
        itemsPrice: 189999,
        taxPrice: 34199,
        shippingPrice: 0,
        totalPrice: 224198,
      }),
    });
    const verifiedOrderData = await verifyRes.json();
    console.log(`   Verified Order ID: ${verifiedOrderData._id} | Status: ${verifiedOrderData.status} | Paid: ${verifiedOrderData.isPaid}`);
    if (verifyRes.status !== 201 && verifyRes.status !== 200) {
      throw new Error('Failed to verify payment');
    }
    console.log('   ✅ Razorpay payment initiation & verification passed!\n');

    // 6. Orders History & Details Flow (/api/orders)
    console.log('6. Testing Customer Orders History & Details (/api/orders)...');
    const myOrdersRes = await fetch('http://localhost:5000/api/orders?page=1&limit=5', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const myOrdersData = await myOrdersRes.json();
    console.log(`   Fetched ${myOrdersData.orders?.length} orders on page ${myOrdersData.page} of ${myOrdersData.pages} (Total: ${myOrdersData.total})`);
    if (!myOrdersData.orders || myOrdersData.orders.length === 0) {
      throw new Error('Orders history returned empty');
    }

    const singleOrderRes = await fetch(`http://localhost:5000/api/orders/${verifiedOrderData._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const singleOrderData = await singleOrderRes.json();
    console.log(`   Single Order Lookup: #${singleOrderData._id} with ${singleOrderData.transactions?.length || 0} embedded transactions`);
    if (!singleOrderData.transactions || singleOrderData.transactions.length === 0) {
      throw new Error('Embedded transactions not found on order detail');
    }
    console.log('   ✅ Orders pagination and confirmation retrieval passed!\n');

    // 7. Transactions Collection & Billing History Flow (/api/transactions)
    console.log('7. Testing Dedicated Transactions & Billing System (/api/transactions)...');
    const orderTxRes = await fetch(`http://localhost:5000/api/orders/${verifiedOrderData._id}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const orderTxData = await orderTxRes.json();
    console.log(`   Order #${verifiedOrderData._id} has ${orderTxData.length} transaction(s). Latest Status: ${orderTxData[0]?.status}`);
    if (!Array.isArray(orderTxData) || orderTxData.length === 0) {
      throw new Error('Order transactions endpoint failed');
    }

    const userTxRes = await fetch('http://localhost:5000/api/transactions?page=1&limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userTxData = await userTxRes.json();
    console.log(`   User Transactions: ${userTxData.transactions?.length} total records across orders (Amount: ₹${userTxData.transactions[0]?.amount / 100})`);
    if (!userTxData.transactions || userTxData.transactions.length === 0) {
      throw new Error('User transactions list failed');
    }

    // Test recording a failed payment attempt
    const failPaymentRes = await fetch('http://localhost:5000/api/payments/fail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId: verifiedOrderData._id,
        failureReason: 'User cancelled payment modal during checkout test',
      }),
    });
    const failData = await failPaymentRes.json();
    console.log(`   Recorded simulated payment failure: Status: ${failData.transaction?.status} | Reason: ${failData.transaction?.failureReason}`);

    // Test admin failed transactions query
    const adminTxRes = await fetch('http://localhost:5000/api/admin/transactions?status=failed', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const adminTxData = await adminTxRes.json();
    console.log(`   Admin query found ${adminTxData.total} failed transaction(s) for ops review.`);
    console.log('   ✅ Transactions lifecycle & endpoints passed!\n');

    // 8. PC Compatibility Engine
    console.log('8. Testing PC Compatibility Matrix Engine (/api/builder/validate)...');
    const builderRes = await fetch('http://localhost:5000/api/builder/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ build: sampleBuildComponents }),
    });
    const builderData = await builderRes.json();
    console.log(`   Build isCompatible: ${builderData.isCompatible} | Wattage: ${builderData.estimatedWattage}W | Recommended PSU: ${builderData.recommendedPsuWattage}W`);
    if (!builderData.isCompatible) {
      throw new Error('Builder validation test failed');
    }
    console.log('   ✅ PC compatibility matrix passed!\n');

    // 9. Guest Cart & Dual Identity Flow (No Auth Token)
    console.log('9. Testing Guest Cart Flow (No Auth Token)...');
    const guestHeaders = { 'Content-Type': 'application/json' };
    const guestCartSyncRes = await fetch('http://localhost:5000/api/cart/sync', {
      method: 'POST',
      headers: guestHeaders,
      body: JSON.stringify({
        items: [
          { name: 'AMD Ryzen 7 7800X3D', price: 38999, quantity: 1, image: 'CPU_Image/AMD/Ryzen_7.jpg' },
        ],
      }),
    });
    const guestGuestIdHeader = guestCartSyncRes.headers.get('x-guest-id');
    const guestCartData = await guestCartSyncRes.json();
    console.log(`   Guest Cart Subtotal: ₹${guestCartData.subtotal} | Guest ID Header: ${guestGuestIdHeader}`);
    if (!guestGuestIdHeader) {
      throw new Error('Server did not return x-guest-id header for unauthenticated cart');
    }
    console.log('   ✅ Guest cart resolution passed!\n');

    // 10. Guest Order Placement
    console.log('10. Testing Guest Order Placement (No Auth)...');
    const guestEmail = `guest_${Date.now()}@example.com`;
    const guestOrderRes = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-id': guestGuestIdHeader,
      },
      body: JSON.stringify({
        orderItems: [
          { name: 'AMD Ryzen 7 7800X3D', price: 38999, qty: 1, image: 'CPU_Image/AMD/Ryzen_7.jpg', product: '6aa1959be2efef618c4e912f' },
        ],
        shippingAddress: {
          name: 'Alex Guest',
          phone: '+91 91234 56789',
          email: guestEmail,
          address: '42 Tech Park',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500081',
        },
        paymentMethod: 'cod',
        itemsPrice: 38999,
        taxPrice: 7020,
        shippingPrice: 0,
        totalPrice: 46019,
        guestEmail,
      }),
    });
    const guestOrderData = await guestOrderRes.json();
    if (guestOrderRes.status !== 201) {
      console.error('   Guest order creation error:', guestOrderData);
    }
    console.log(`   Guest Order Created: ID: ${guestOrderData._id} | User: ${guestOrderData.user} | GuestId: ${guestOrderData.guestId} | Email: ${guestOrderData.guestEmail}`);
    if (guestOrderRes.status !== 201 || guestOrderData.user !== null || !guestOrderData.guestId || guestOrderData.guestEmail !== guestEmail) {
      throw new Error('Guest order placement failed or did not capture guest identity');
    }
    console.log('   ✅ Guest order placement passed!\n');

    // 11. Guest Order Lookup (/api/orders/lookup)
    console.log('11. Testing Guest Order Lookup (/api/orders/lookup)...');
    // Valid lookup
    const lookupRes = await fetch('http://localhost:5000/api/orders/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: guestOrderData._id,
        email: guestEmail,
      }),
    });
    const lookupData = await lookupRes.json();
    if (lookupRes.status !== 200 || lookupData._id !== guestOrderData._id) {
      throw new Error('Guest order lookup failed for valid order and email');
    }
    console.log(`   Lookup Success: Found order ${lookupData._id} with status ${lookupData.orderStatus}`);

    // Invalid email lookup (Must fail with 404 to avoid enumeration)
    const invalidLookupRes = await fetch('http://localhost:5000/api/orders/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: guestOrderData._id,
        email: 'wrong_email@example.com',
      }),
    });
    if (invalidLookupRes.status !== 404) {
      throw new Error('Guest lookup did not return 404 on mismatched email');
    }
    console.log('   ✅ Guest order lookup & privacy check passed!\n');

    // 12. Guest Razorpay Payment Verify
    console.log('12. Testing Guest Razorpay Payment Verification...');
    const guestPaymentVerifyRes = await fetch('http://localhost:5000/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-id': guestGuestIdHeader,
      },
      body: JSON.stringify({
        orderId: guestOrderData._id,
        razorpay_order_id: `order_test_${Date.now()}`,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: 'test_signature_mock',
        guestEmail,
      }),
    });
    const guestPaymentVerifyData = await guestPaymentVerifyRes.json();
    console.log(`   Order Payment Status: ${guestPaymentVerifyData.paymentStatus} | Paid: ${guestPaymentVerifyData.isPaid}`);
    if (guestPaymentVerifyData.paymentStatus !== 'paid' || !guestPaymentVerifyData.isPaid) {
      throw new Error('Guest payment verification failed');
    }
    console.log('   ✅ Guest payment verification passed!\n');

    // 13. Soft Account Creation with Order Migration
    console.log('13. Testing Guest Account Creation & Order Migration (/api/auth/register)...');
    const registerGuestRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-id': guestGuestIdHeader,
      },
      body: JSON.stringify({
        name: 'Alex Guest',
        email: guestEmail,
        password: 'password123',
        guestId: guestGuestIdHeader,
      }),
    });
    const registerGuestData = await registerGuestRes.json();
    console.log(`   Registered User ID: ${registerGuestData.user?.id} | Migrated Orders Count: ${registerGuestData.migratedOrdersCount}`);
    if (registerGuestRes.status !== 201 || registerGuestData.migratedOrdersCount < 1) {
      throw new Error('Order migration upon guest account registration failed');
    }

    // Verify order now belongs to the new user
    const checkOrderRes = await fetch(`http://localhost:5000/api/orders/${guestOrderData._id}`, {
      headers: { Authorization: `Bearer ${registerGuestData.token}` },
    });
    const checkOrderData = await checkOrderRes.json();
    console.log(`   Verified Order User Owner: ${checkOrderData.user?._id || checkOrderData.user}`);
    if (!checkOrderData.user || (checkOrderData.user._id || checkOrderData.user) !== registerGuestData.user.id) {
      throw new Error('Migrated order does not reflect new userId');
    }
    console.log('   ✅ Guest account creation & order migration passed!\n');

    console.log('================================================================');
    console.log('🎉 ALL 13 CARTVERSE INTEGRATION TESTS PASSED 100%!');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ TEST SUITE FAILED:', err);
    process.exit(1);
  }
}

setTimeout(runTests, 700);
