/*
 * ===========================================================================================
 * shop
 * - require util.js, event.js
 * ===========================================================================================
 */
var shop = shop || {};
shop.event = { CART_CHANGED: 'cart_product_changed' };

(function() {
    "use strict";

    class ProductCache {

        constructor(name, notify) {

            this.name = name;
            this.NOTIFY = notify;
            this.CACHE_NAME = 'products_in_' + name;
            this.CACHE_NUMBERS = 'numbers_in_' + name;

            this.loadCache();
        }

        saveCache(srcCaller) {
            util.storage.setItem(this.CACHE_NAME, this._products);
            util.storage.setItem(this.CACHE_NUMBERS, this._numberProductItem);

            if (this.NOTIFY) {
                event.fire(this.NOTIFY, this.name, { src: srcCaller, tcount: this.quantity() });
            }
        }

        loadCache() {
            this._products = util.storage.getItem(this.CACHE_NAME) || {};
            this._numberProductItem = parseInt(util.storage.getItem(this.CACHE_NUMBERS)) || 0;
        }

        quantity() {
            return this._numberProductItem;
        }

        getProductList() {
            return Object.values(this._products);
        }

        setProductList(list) {

            if (!Array.isArray(list)) {
                return;
            }

            var products = {};
            var counter = 0;

            list.forEach((productItem) => {
                if (productItem.loc && productItem.item && productItem.quantity) {

                    productItem.quantity = parseInt(productItem.quantity);
                    products[productItem.loc] = JSON.parse(JSON.stringify(productItem));

                    counter += productItem.quantity;
                }
            });

            this._products = products;
            this._numberProductItem = counter;

            this.saveCache('setProductList');
        }

        clearProductList() {
            this._products = {};
            this._numberProductItem = 0;

            this.saveCache('clearProductList');
        }

        setProduct(product, stockId, quantity) {

            if (!product || !product.loc || !stockId || !quantity) {
                return;
            }

            var key = [product.loc, stockId].join('_');


            quantity = parseInt(quantity);

            var oldQuantity = 0;
            if (this._products[key]) {
                oldQuantity = this._products[key].quantity;
            }

            var productItem = JSON.parse(JSON.stringify(product));
            productItem.item = stockId;
            productItem.quantity = quantity;

            this._products[key] = productItem;
            this._numberProductItem += (quantity - oldQuantity);

            this.saveCache('setProduct');
        }

        addProduct(product, stockId, quantity) {

            if (!product || !product.loc || !stockId || !quantity) {
                return;
            }

            this._products = this._products || {};
            var key = [product.loc, stockId].join('_');

            quantity = parseInt(quantity);

            var oldQuantity = 0;
            var productItem = this._products[key];

            if (productItem) {
                oldQuantity = productItem.quantity;
                productItem.quantity += quantity;
            } else {
                productItem = JSON.parse(JSON.stringify(product));
                productItem.item = stockId;
                productItem.quantity = quantity;
            }

            this._products[key] = productItem;
            this._numberProductItem += (quantity + oldQuantity);

            this.saveCache('addProduct');
        }

        removeProduct(productLoc, stockId) {

            if (!productLoc || !stockId) {
                return;
            }

            var key = [productLoc, stockId].join('_');

            if (!this._products[key]) { return; }

            this._numberProductItem -= this._products[key].quantity;
            delete this._products[key];

            this.saveCache('removeProduct');
        }
    }

    // export
    shop.cart = new ProductCache("cart", shop.event.CART_CHANGED);
    shop.checkout = new ProductCache("checkout");

})();