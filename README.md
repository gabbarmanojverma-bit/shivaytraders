# Shivay Traders Website — Product Catalogue Update

## What is included
- Real product photos added to the Products page.
- 40 selected catalogue cards after removing exact repeats and choosing the better shot where the same product was photographed twice.
- Current categories: Bangles, Bracelets, Mala, Rudraksh, Kada and Dhaga.
- Product codes are unique and are automatically included in WhatsApp enquiries.
- No online checkout: every product shows `Contact for Price` and an enquiry button.
- Product photos are optimized as WebP files for faster loading.
- Mobile/tablet/desktop catalogue layout remains responsive.

## Important naming rule
As requested, product display names are intentionally generic for now:
- Bangles products → `Bangles`
- Bracelet products → `Bracelet`
- Mala products → `Mala`
- Rudraksh products → `Rudraksh`
- Kada products → `Kada`
- Dhaga products → `Dhaga`

You can manually replace these names later without changing the product code or image.

## How to change a product name later
Open:

`js/products.js`

Example:

```js
{ name: "Mala", code: "ST-ML-001", category: "Mala", image: "assets/products/mala/st-ml-001.webp", ... }
```

Change only the `name` value, for example:

```js
{ name: "Crystal Mala", code: "ST-ML-001", category: "Mala", image: "assets/products/mala/st-ml-001.webp", ... }
```

The WhatsApp enquiry will automatically use the updated name.

## Product images
Optimized images are stored inside:

`assets/products/`

Each image is named with its product code, which makes it easy to identify the exact item.

## Preview
1. Extract the ZIP.
2. Open the website folder.
3. Double-click `index.html`.
4. Open `Products`.
5. Test the category filters and WhatsApp enquiry buttons.

## Deployment
For GitHub Pages, keep `index.html`, `products.html`, `css`, `js`, and `assets` at the repository root.
