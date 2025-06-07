export function calculateCartTotal(items, menuItems, isLoggedIn = false) {
    let allProducts = [];
    items.forEach((item) => {
        const product = menuItems.find((m) => m.prodId === item.prodId);
        if (product) {
            for (let i = 0; i < item.qty; i++) {
                allProducts.push(product.price);
            }
        }
    });

    allProducts.sort((a, b) => a - b);

    const discountsApplied = [];

    // Buy 4 pay for 3, cheapest one is free.
    let total = 0;
    if (allProducts.length >= 4) {
        discountsApplied.push("Active Discount: Buy 4 pay for 3, cheapest one is free.");
    }
    for (let i = 0; i < allProducts.length; i++) {
        if ((i + 1) % 4 === 0) continue;
        total += allProducts[i];
    }

    // 10% discount for registered users
    if (isLoggedIn) {
        discountsApplied.push("Active Discount: 10% discount for registered users.");
        total = total * 0.9;
    }
    return {
        total: Math.round(total * 100) / 100,
        discountsApplied,
    };
}
